ALTER TABLE cdr ADD COLUMN fromtypecall character varying(50) DEFAULT ''::character varying NOT NULL;
-- ******************************************************************************************************************************************************************** --
-- FUNCTIONS INACTIVES IN DB --
CREATE OR REPLACE FUNCTION remove_row_duplicate_on_insert()     
RETURNS trigger
AS $$
    BEGIN
        -- DELETE FROM cdr WHERE uniqueid=NEW.uniqueid AND disposition='ANSWERED' AND lastapp <> 'BackGround' AND lastapp <> 'Playback' AND disposition LIKE 'NO ANSWER';
        DELETE FROM cdr WHERE uniqueid=NEW.uniqueid AND NEW.disposition = 'ANSWERED' AND NEW.dstchannel <> '' AND disposition LIKE 'NO ANSWER' AND typecall='Recebida';
        DELETE FROM cdr WHERE linkedid=NEW.linkedid AND duration = 0 AND billsec = 0;
        return NEW;
    END;
$$ LANGUAGE plpgsql;

-- CREATE TRIGGER
DROP TRIGGER IF EXISTS execute_remove_row_duplicate_on_inserts ON cdr
CREATE TRIGGER execute_remove_row_duplicate_on_inserts
AFTER INSERT ON cdr
    FOR EACH ROW EXECUTE PROCEDURE remove_row_duplicate_on_insert();

-- FUNCTION INSERT CDR BACKUP
CREATE OR REPLACE FUNCTION add_row_deleted_from_cdr()     
RETURNS trigger
AS $$
    BEGIN
        INSERT INTO cdr_old
          (calldate, clid, src, dst, dcontext, channel, dstchannel, lastapp, lastdata, duration, billsec, disposition, amaflags, accountcode, uniqueid, userfield, peeraccount, linkedid, sequence, typecall, callprotocol, hangupcause, fromtypecall)
          VALUES
          (OLD.calldate, OLD.clid, OLD.src, OLD.dst, OLD.dcontext, OLD.channel, OLD.dstchannel, OLD.lastapp, OLD.lastdata, OLD.duration, OLD.billsec, OLD.disposition, OLD.amaflags, OLD.accountcode, OLD.uniqueid, OLD.userfield, OLD.peeraccount, OLD.linkedid, OLD.sequence, OLD.typecall, OLD.callprotocol, OLD.hangupcause, OLD.fromtypecall);

        return OLD;
    END;
$$ LANGUAGE plpgsql;

-- CREATE TRIGGER
DROP TRIGGER IF EXISTS execute_radd_row_deleted_from_cdr ON cdr
CREATE TRIGGER execute_radd_row_deleted_from_cdr
AFTER DELETE ON cdr
    FOR EACH ROW EXECUTE PROCEDURE add_row_deleted_from_cdr();
-- ******************************************************************************************************************************************************************** --

ALTER TABLE cdr DROP COLUMN peeraccount character varying(50) DEFAULT ''::character varying NOT NULL;

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--- 1- Function GET CALLS TO REPORT TABLE RECEIVED ---
DROP FUNCTION get_data_report_received;
CREATE OR REPLACE FUNCTION get_data_report_received(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "amount_calls" bigint,
    "answered_calls" bigint,
    "no_answer_calls" bigint,
    "busy_calls" bigint,
    "transshipment_calls" bigint,
    "total_time_calls" text,
    "average_time_calls" text,
    "average_queue_calls" text
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);

    BEGIN
      return query
      SELECT
        COUNT(DISTINCT(uniqueid)) AS amount_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          -- AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
          AND disposition LIKE 'ANSWERED' AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS answered_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr AS a
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND a.uniqueid
          NOT IN (SELECT DISTINCT(uniqueid) FROM cdr
            WHERE (calldate BETWEEN data_inicial AND data_final)
            -- AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
            AND disposition LIKE 'ANSWERED' AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
            AND lastdata LIKE '%' || recSector || '%'
            AND dstchannel LIKE '%' || endpoint || '%'
            AND src LIKE '%' || telNumber || '%'
            AND callprotocol LIKE '%' || protocol || '%'
            )
          -- AND disposition LIKE 'NO ANSWER' AND typecall = 'Recebida'
          AND disposition LIKE 'NO ANSWER' AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
          ) AS no_answer_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          -- AND  disposition LIKE 'BUSY' AND typecall = 'Recebida'
          AND  disposition LIKE 'BUSY' AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> '' AND typecall = 'Recebida'
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS busy_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          -- AND lastdata LIKE '%transb%' AND typecall = 'Recebida'
          AND lastdata LIKE '%transb%' AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
          ) AS transshipment_calls,
        (SELECT TO_CHAR((SUM(DISTINCT(duration)) || ' second')::interval, 'HH24:MI:SS')
          FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          -- AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
          AND disposition LIKE 'ANSWERED' AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS total_time_calls,
        (SELECT TO_CHAR((AVG(DISTINCT(duration)) || ' second')::interval, 'HH24:MI:SS')
          FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          -- AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
          AND disposition LIKE 'ANSWERED' AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS average_time_calls,
        (SELECT TO_CHAR((AVG(billsec) || ' second')::interval, 'HH24:MI:SS') FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          -- AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
          AND disposition LIKE 'ANSWERED' AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS average_queue_calls
      FROM cdr
      WHERE (calldate BETWEEN data_inicial AND data_final)
      -- AND typecall = 'Recebida'
      AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
      AND lastdata LIKE '%' || recSector || '%'
      AND dstchannel LIKE '%' || endpoint || '%'
      AND src LIKE '%' || telNumber || '%'
      AND callprotocol LIKE '%' || protocol || '%';
    END;
  $$;

SELECT * FROM  "get_data_report_received"('2022-01-26', '2022-01-26', '00:00:00', '23:59:59', '', '', '', '');
SELECT * FROM  "get_data_report_received"('2022-01-26', '2022-01-26', '00:00:00', '23:59:59', 'closer', '', '', '');
SELECT * FROM  "get_data_report_received"('2022-01-05 00:00:00', '2022-01-30 23:59:59', '', '4104', '', '');
SELECT * FROM  "get_data_report_received"('2022-01-05 00:00:00', '2022-01-30 23:59:59', '', '', '1430420844', '');
SELECT * FROM  "get_data_report_received"('2022-01-05 00:00:00', '2022-01-30 23:59:59', '', '', '', '202201061503397');

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--- 2- Function GET CALLS TO REPORT TABLE SENT ---
DROP FUNCTION get_data_report_sent;
CREATE OR REPLACE FUNCTION get_data_report_sent(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "amount_calls" bigint,
    "answered_calls" bigint,
    "no_answer_calls" bigint,
    "busy_calls" bigint,
    "failed_calls" bigint,
    "total_time_calls" text,
    "average_time_calls" text
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);

    BEGIN
      return query
      SELECT
        COUNT(DISTINCT(uniqueid)) AS amount_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          -- AND typecall = 'Efetuada' AND disposition LIKE 'ANSWERED' AND lastdata LIKE '%@%'
          AND disposition LIKE 'ANSWERED' AND lastdata LIKE '%@%' AND CHAR_LENGTH(dst) > 4
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS answered_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr AS a
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND a.uniqueid NOT IN (SELECT uniqueid FROM cdr 
            WHERE (calldate BETWEEN data_inicial AND data_final)
            AND disposition LIKE 'ANSWERED'
            -- AND typecall = 'Efetuada' AND lastdata LIKE '%@%'
            AND CHAR_LENGTH(dst) > 4 AND lastdata LIKE '%@%'
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%')
          -- AND disposition LIKE 'NO ANSWER' AND typecall = 'Efetuada' AND lastdata LIKE '%@%'
          AND disposition LIKE 'NO ANSWER' AND lastdata LIKE '%@%' AND CHAR_LENGTH(dst) > 4
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS no_answer_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND  disposition LIKE 'BUSY'
          -- AND typecall = 'Efetuada'
          AND CHAR_LENGTH(dst) > 4
           AND lastdata LIKE '%@%'
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS busy_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          -- AND  disposition LIKE 'FAILED' AND typecall = 'Efetuada' AND lastdata LIKE '%@%'
          AND  disposition LIKE 'FAILED' AND CHAR_LENGTH(dst) > 4 AND lastdata LIKE '%@%'
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS failed_calls,
        TO_CHAR((SUM(DISTINCT(duration)) || ' second')::interval, 'HH24:MI:SS') AS total_time_calls,
        TO_CHAR((AVG(DISTINCT(duration)) || ' second')::interval, 'HH24:MI:SS') AS average_time_calls
      FROM cdr
        WHERE (calldate BETWEEN data_inicial AND data_final)
        -- AND typecall = 'Efetuada' AND lastdata LIKE '%@%' AND CHAR_LENGTH(dst) > 4
        AND lastdata LIKE '%@%' AND CHAR_LENGTH(dst) > 4
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%';
    END;
  $$;

SELECT * FROM  "get_data_report_sent"('2022-01-28', '2022-01-28', '00:00:00', '23:59:59', '', '', '', '');
SELECT * FROM  "get_data_report_sent"('2022-01-05 00:00:00', '2022-01-30 23:59:59', '', '4104', '', '');
SELECT * FROM  "get_data_report_sent"('2022-01-05 00:00:00', '2022-01-30 23:59:59', '', '', '1430420844', '');
SELECT * FROM  "get_data_report_sent"('2022-01-05 00:00:00', '2022-01-30 23:59:59', '', '', '', '202201061503397');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 3- Function Get Endpoints as Volume Calls Received ANSWERED --
DROP FUNCTION get_vol_endp_rec_aswered;
CREATE OR REPLACE FUNCTION get_vol_endp_rec_aswered(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "endpoints" text,
    "received_answered" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return QUERY
      SELECT
        CASE 
        WHEN dstchannel SIMILAR TO '%@%' = False THEN 
          REPLACE(
            SUBSTRING(
              dstchannel, POSITION('/' in dstchannel) + 1,
                POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
              )
            , '-', ''
          )
        ELSE
          REPLACE(
            SUBSTRING(
              dstchannel, POSITION('/' in dstchannel) + 1,
                (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
              )
            , '-', ''
          )
      END
      AS endpoints, COUNT(dstchannel) FROM cdr
      WHERE (calldate BETWEEN data_inicial AND data_final)
      -- AND typecall = 'Recebida' AND dstchannel <> '' AND disposition = 'ANSWERED' AND CHAR_LENGTH(src) > 4 AND dstchannel SIMILAR TO '%@%' = False
      AND disposition = 'ANSWERED' AND CHAR_LENGTH(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
      AND lastdata LIKE '%' || recSector || '%'
      AND dstchannel LIKE '%' || endpoint || '%'
      AND src LIKE '%' || telNumber || '%'
      AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY endpoints
      ORDER BY endpoints;
    END;
  $$;

SELECT * FROM  "get_vol_endp_rec_aswered"('2022-02-14', '2022-02-14', '00:00:00', '23:59:59', '', '', '', '');

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 4- Function Get Endpoints as Volume Calls Received NO ANSWER--
DROP FUNCTION get_vol_endp_rec_no_aswer;
CREATE OR REPLACE FUNCTION get_vol_endp_rec_no_aswer(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "endpoints" text,
    "received_no_aswer" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return QUERY
      SELECT
        REPLACE(
          SUBSTRING(
            dstchannel, POSITION('/' in dstchannel) + 1,
              POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
            )
          , '-', ''
        ) AS endpoints, COUNT(DISTINCT(uniqueid)) FROM cdr AS a
      WHERE (calldate BETWEEN data_inicial AND data_final)
      AND a.uniqueid NOT IN (SELECT uniqueid FROM cdr
        -- WHERE (calldate BETWEEN data_inicial AND data_final) AND dstchannel <> '' AND disposition = 'ANSWERED' AND CHAR_LENGTH(src) > 4)
        WHERE (calldate BETWEEN data_inicial AND data_final) AND disposition = 'ANSWERED' AND CHAR_LENGTH(src) > 4  AND dstchannel <> '')
      -- AND typecall = 'Recebida' AND disposition = 'NO ANSWER' AND CHAR_LENGTH(src) > 4
      AND disposition = 'NO ANSWER' AND CHAR_LENGTH(src) > 4
      AND lastdata LIKE '%' || recSector || '%'
      AND dstchannel LIKE '%' || endpoint || '%'
      AND src LIKE '%' || telNumber || '%'
      AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY endpoints
      ORDER BY endpoints;
    END;
  $$;

SELECT * FROM  "get_vol_endp_rec_no_aswer"('2022-01-28', '2022-01-28', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 5- Function Get Endpoints as Volume Calls Sent ANSWERED--
DROP FUNCTION get_vol_sent_endp_answered;
CREATE OR REPLACE FUNCTION get_vol_sent_endp_answered(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "endpoints" character varying(80),
    "sent_answered" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return QUERY
      SELECT src AS endpoints, COUNT(DISTINCT(uniqueid)) FROM cdr
        WHERE  char_length(src) < 5
        AND (calldate BETWEEN data_inicial AND data_final)
        -- AND typecall = 'Efetuada' AND disposition = 'ANSWERED' AND char_length(dst) > 4
        AND disposition = 'ANSWERED' AND char_length(dst) > 4
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY endpoints
      ORDER BY endpoints;
    END;
  $$;

SELECT * FROM  "get_vol_sent_endp_answered"('2022-02-14', '2022-02-14', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 6- Function Get Endpoints as Volume Calls Sent NO ANSWER --
DROP FUNCTION get_vol_sent_endp_no_answer;
CREATE OR REPLACE FUNCTION get_vol_sent_endp_no_answer(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "endpoints" character varying(80),
    "sent_no_answer" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return QUERY
      SELECT src AS endpoints, COUNT(DISTINCT(uniqueid)) FROM cdr AS a
      WHERE char_length(src) < 5
      AND (calldate BETWEEN data_inicial AND data_final)
        AND a.uniqueid NOT IN (
          SELECT DISTINCT(uniqueid) FROM cdr
          WHERE char_length(src) < 5
          AND (calldate BETWEEN data_inicial AND data_final)
          AND disposition LIKE 'ANSWERED'
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%')
        AND disposition = 'NO ANSWER' AND char_length(dst) > 4
        AND src LIKE '%' || endpoint || '%'
        AND dst LIKE '%' || telNumber || '%'
        AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY endpoints
      ORDER BY endpoints;
    END;
  $$;

SELECT * FROM  "get_vol_sent_endp_no_answer"('2022-02-14', '2022-02-14', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 7- Function Get Volume Calls Sent Internal and External --
DROP FUNCTION get_volume_sent_external_and_external;
CREATE OR REPLACE FUNCTION get_volume_sent_external_and_external(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "externas" bigint,
    "internas" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return QUERY
      SELECT
        (SELECT COUNT(DISTINCT(uniqueid)) AS externas FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND typecall = 'Efetuada' AND dstchannel <> '' AND lastdata LIKE '%@%'
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS externas,
        (SELECT COUNT(DISTINCT(uniqueid)) internas FROM cdr AS a
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND typecall = 'Efetuada' AND CHAR_LENGTH(a.src) > 3 AND dstchannel <> ''
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
          AND a.lastdata NOT IN (SELECT DISTINCT(uniqueid) FROM cdr WHERE lastdata LIKE '%@%'
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%')
        ) AS internas;
    END;
  $$;

SELECT * FROM  "get_volume_sent_external_and_external"('2022-01-01', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 8- Function Get Volume Calls Received and Answered By Sector --
DROP FUNCTION get_vol_sec_rec;
CREATE OR REPLACE FUNCTION get_vol_sec_rec(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "sectors" text,
    "answered" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
    BEGIN
      return QUERY
      SELECT SUBSTRING(lastdata, 0, POSITION(',' in lastdata)) AS sectors, COUNT(DISTINCT(uniqueid)) as answered FROM cdr
      WHERE (calldate BETWEEN data_inicial AND data_final)
      AND lastapp = 'Queue' AND disposition = 'ANSWERED' AND CHAR_LENGTH(src) > 4  AND dstchannel <> ''
      AND lastdata LIKE '%' || recSector || '%'
      AND dstchannel LIKE '%' || endpoint || '%'
      AND src LIKE '%' || telNumber || '%'
      AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY sectors
      ORDER BY sectors;
    END;
  $$;

SELECT * FROM  "get_vol_sec_rec"('2022-01-28', '2022-01-28', '00:00:00', '23:59:59', 'comercial', '', '', '');

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 9- Function Get Volume Calls Received and Not Answered By Sector --
DROP FUNCTION get_vol_sec_no_ans;
CREATE OR REPLACE FUNCTION get_vol_sec_no_ans(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "sectors" text,
    "no_answer" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return QUERY
      SELECT SUBSTRING(lastdata, 0, POSITION(',' in lastdata)) AS sectors_not_atennd, COUNT(DISTINCT(uniqueid)) AS no_answer FROM cdr AS a
        WHERE (calldate BETWEEN data_inicial AND data_final)
        AND a.uniqueid NOT IN (
          SELECT uniqueid FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
           AND lastapp = 'Queue' AND disposition = 'ANSWERED' AND CHAR_LENGTH(src) > 4  AND dstchannel <> ''
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        )
        AND disposition LIKE 'NO ANSWER' AND lastapp = 'Queue' AND CHAR_LENGTH(src) > 4  AND dstchannel <> ''
        AND lastdata LIKE '%' || recSector || '%'
        AND dstchannel LIKE '%' || endpoint || '%'
        AND src LIKE '%' || telNumber || '%'
        AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY sectors_not_atennd
      ORDER BY sectors_not_atennd;
    END;
  $$;

SELECT * FROM  "get_vol_sec_no_ans"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 10- Function Get Volume Calls Received By Hour --
DROP FUNCTION get_vol_rec_answ_by_hour;
CREATE OR REPLACE FUNCTION get_vol_rec_answ_by_hour(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "hours_calls" double precision,
    "answered" bigint,
    "no_answer" integer
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return QUERY
        SELECT
          EXTRACT(HOUR FROM calldate) AS hours_calls, COUNT(DISTINCT(uniqueid)) AS answered, 0 AS no_answer
        FROM cdr 
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        GROUP BY hours_calls;
    END;
  $$;

SELECT * FROM  "get_vol_rec_answ_by_hour"('2022-02-25', '2022-02-25', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 11- Function Get Volume Calls Received By Hour --
DROP FUNCTION get_vol_rec_no_answ_by_hour;
CREATE OR REPLACE FUNCTION get_vol_rec_no_answ_by_hour(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "hours_calls" double precision,
    "answered" integer,
    "no_answer" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return query
        SELECT
          EXTRACT(HOUR FROM calldate) AS hours_calls, 0 AS answered,
          COUNT(DISTINCT(uniqueid)) AS no_answer 
        FROM cdr AS a
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND a.uniqueid NOT IN (
            SELECT uniqueid FROM cdr
            WHERE (calldate BETWEEN data_inicial AND data_final)
            AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
          )
          AND disposition LIKE 'NO ANSWER' AND typecall = 'Recebida'
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        GROUP BY hours_calls;
    END;
  $$;

SELECT * FROM  "get_vol_rec_no_answ_by_hour"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 12- Function Get Volume Calls Received Global Sectors --
DROP FUNCTION get_vol_rec_answered_and_no_answer_global;
CREATE OR REPLACE FUNCTION get_vol_rec_answered_and_no_answer_global(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "answered" bigint,
    "no_answer" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
    BEGIN
      return QUERY
      SELECT
        (SELECT
          COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND lastapp = 'Queue' AND disposition = 'ANSWERED' AND dstchannel <> ''
        AND lastdata LIKE '%' || recSector || '%'
        AND dstchannel LIKE '%' || endpoint || '%'
        AND src LIKE '%' || telNumber || '%'
        AND callprotocol LIKE '%' || protocol || '%') AS answered,
        (
          SELECT  
            COUNT(DISTINCT(uniqueid)) FROM cdr AS a
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND a.uniqueid NOT IN (
            SELECT uniqueid FROM cdr
            WHERE (calldate BETWEEN data_inicial AND data_final)
            AND lastapp = 'Queue' AND disposition = 'ANSWERED' AND dstchannel <> ''
            AND lastdata LIKE '%' || recSector || '%'
            AND dstchannel LIKE '%' || endpoint || '%'
            AND src LIKE '%' || telNumber || '%'
            AND callprotocol LIKE '%' || protocol || '%'
          )
          AND disposition LIKE 'NO ANSWER' AND lastapp = 'Queue' AND dstchannel <> ''
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS no_answer;
    END;
  $$;

SELECT * FROM  "get_vol_rec_answered_and_no_answer_global"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 13- Function Get Rows All Calls --
DROP FUNCTION get_all_calls_rows;
CREATE OR REPLACE FUNCTION get_all_calls_rows(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30),
  statusCall character varying(30),
  typeRecOrEfet character varying(30),
  limitGet integer,
  offsetGet integer
)
  RETURNS TABLE (
    data timestamptz,
    origem_primaria character varying(80),
    origem_segundaria character varying(80),
    destino_primario character varying(80),
    destino_secundario text,
    setor text,
    aguardando_atendimento bigint,
    duracao bigint,
    status text,
    sequencia integer,
    tipo character varying(80),
    protocolo character varying(150),
    tipo_saida character varying(80),
    id text,
    encerramento character varying(50),
    full_count bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);     
    BEGIN
      return QUERY
      SELECT
        calldate AS data,
        clid AS origem_primaria,
        src AS origem_segundaria,
        dst AS destino_primario,
        CASE 
          WHEN dstchannel SIMILAR TO '%@%' = True THEN            
            REPLACE(
              SUBSTRING(
                dstchannel, POSITION('/' in dstchannel) + 1,
                  (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
                )
              , '-', ''
            )
          ELSE REPLACE(
            SUBSTRING(
              dstchannel, POSITION('/' in dstchannel) + 1,
                POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
              )
            , '-', ''
          )
        END
        AS destino_secundario,
        CASE 
          WHEN typecall='Recebida' THEN
            SUBSTRING(lastdata, 0, POSITION(',' in lastdata))
          WHEN typecall='Efetuada' THEN
            dst
          ELSE '-'
        END
        AS setor,
        duration - billsec AS aguardando_atendimento,
        duration AS duracao,
        CASE 
          WHEN disposition='NO ANSWER' THEN 'Nao Atendida'
          WHEN disposition='ANSWERED' THEN 'Atendida'
          ELSE ''
        END
        AS status,
        sequence AS sequencia,
        typecall AS tipo,
        callprotocol AS protocolo,
        fromtypecall AS tipo_saida,
        REPLACE(uniqueid, 'VigosPBX-', '') AS id,
        hangupcause AS encerramento,
        count(*) OVER() AS full_count
      FROM cdr
        WHERE (calldate BETWEEN data_inicial AND data_final)
        AND lastapp <> '' AND lastapp <> 'Hangup' AND typecall <> ''
        AND
          CASE 
            WHEN recSector='' THEN
              lastdata LIKE '%'
            ELSE lastdata LIKE recSector || '%'
          END
        AND
          CASE 
            WHEN typeRecOrEfet='Recebida' THEN
              dstchannel LIKE '%' || endpoint || '%'
            WHEN typeRecOrEfet='Efetuada' THEN
              src LIKE '%' || endpoint || '%'
            ELSE dstchannel LIKE '%' || endpoint || '%'
          END
        AND
          CASE 
            WHEN typeRecOrEfet='Recebida' THEN
              src LIKE '%' || telNumber || '%'
            WHEN typeRecOrEfet='Efetuada' THEN
              dst LIKE '%' || telNumber || '%'
            ELSE src LIKE '%' || telNumber || '%'
          END
        AND callprotocol LIKE '%' || protocol || '%'
        AND disposition LIKE '%' || statusCall || '%'
        AND typecall LIKE '%' || typeRecOrEfet || '%'
      ORDER BY calldate DESC, id DESC
      LIMIT limitGet OFFSET offsetGet;
    END;
  $$;

SELECT * FROM get_all_calls_rows('2021-02-14', '2022-02-14', '00:00:00', '23:59:59', '', '', '', '', '', 'Efetuada', '50', '0');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 14- Function Get All Data Report --
DROP FUNCTION get_itens_report;
CREATE OR REPLACE FUNCTION get_itens_report( 
  ref1 refcursor,
  ref2 refcursor,
  ref3 refcursor,
  ref4 refcursor,
  ref5 refcursor,
  ref6 refcursor,
  ref7 refcursor,
  ref8 refcursor,
  ref9 refcursor,
  ref10 refcursor,
  ref11 refcursor,
  ref12 refcursor,
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
RETURNS SETOF refcursor 
LANGUAGE 'plpgsql'
COST 100
VOLATILE PARALLEL UNSAFE
ROWS 2000

AS $BODY$
DECLARE
            
BEGIN
  OPEN ref1 FOR SELECT * FROM  "get_vol_endp_rec_aswered"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref1;

  OPEN ref2 FOR SELECT * FROM  "get_vol_endp_rec_no_aswer"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref2;

  OPEN ref3 FOR SELECT * FROM  "get_vol_sent_endp_answered"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref3;

  OPEN ref4 FOR SELECT * FROM  "get_vol_sent_endp_no_answer"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref4;

  OPEN ref5 FOR SELECT * FROM  "get_volume_sent_external_and_external"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref5;

  OPEN ref6 FOR SELECT * FROM  "get_vol_sec_rec"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref6;

  OPEN ref7 FOR SELECT * FROM  "get_vol_sec_no_ans"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref7;

  OPEN ref8 FOR SELECT * FROM  "get_vol_rec_answ_by_hour"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref8;

  OPEN ref9 FOR SELECT * FROM  "get_vol_rec_no_answ_by_hour"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref9;

  OPEN ref10 FOR SELECT * FROM  "get_vol_rec_answered_and_no_answer_global"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref10;

  OPEN ref11 FOR SELECT * FROM  "get_data_report_received"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref11;

  OPEN ref12 FOR SELECT * FROM  "get_data_report_sent"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref12;
END;
$BODY$;

DROP FUNCTION get_itens_report( 
  ref1 refcursor,
  ref2 refcursor,
  ref3 refcursor,
  ref4 refcursor,
  ref5 refcursor,
  ref6 refcursor,
  ref7 refcursor,
  ref8 refcursor,
  ref9 refcursor,
  ref10 refcursor,
  ref11 refcursor,
  ref12 refcursor,
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
);

BEGIN;
    SELECT get_itens_report('Ref1', 'Ref2', 'Ref3', 'Ref4', 'Ref5', 'Ref6', 'Ref7', 'Ref8', 'Ref9', 'Ref10', 'Ref11', 'Ref12', '2022-01-26', '2022-01-26', '00:00:00', '23:59:59', 'boutique', '', '', '');
    FETCH ALL IN "Ref1";
    FETCH ALL IN "Ref2";
    FETCH ALL IN "Ref3";
    FETCH ALL IN "Ref4";
    FETCH ALL IN "Ref5";
    FETCH ALL IN "Ref6";
    FETCH ALL IN "Ref7";
    FETCH ALL IN "Ref8";
    FETCH ALL IN "Ref9";
    FETCH ALL IN "Ref10";
    FETCH ALL IN "Ref11";
    FETCH ALL IN "Ref12";
COMMIT;

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 15- Function Get List Sector --
DROP FUNCTION get_sectors;
CREATE OR REPLACE FUNCTION get_sectors()
  RETURNS TABLE (
    "sector" text
  )
  LANGUAGE plpgsql AS
  $$
    BEGIN
      return QUERY
      SELECT DISTINCT(SUBSTRING(lastdata, 0, POSITION(',' in lastdata))) FROM cdr
      WHERE disposition LIKE 'ANSWERED' AND typecall = 'Recebida' AND lastapp = 'Queue';
    END;
  $$;

SELECT * FROM  "get_sectors"();
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 16- Function Get Rows For Calls --
DROP FUNCTION get_chart_by_sectors_rows;
CREATE OR REPLACE FUNCTION get_chart_by_sectors_rows(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  statusCall character varying(30),
  limitGet integer,
  offsetGet integer
)
  RETURNS TABLE (
    id character varying(32),
    data timestamptz,
    origem_primaria character varying(80),
    origem_segundaria character varying(80),
    destino_primario character varying(80),
    destino_secundario text,
    setor text,
    aguardando_atendimento bigint,
    duracao bigint,
    status text,
    sequencia integer,
    tipo character varying(80),
    protocolo character varying(150),
    tipo_saida character varying(80),
    id_sub character varying(32),
    encerramento character varying(50)
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);     
    BEGIN
      return QUERY
      SELECT
        DISTINCT ON (uniqueid) id,
        calldate AS data,
        clid AS origem_primaria,
        src AS origem_segundaria,
        dst AS destino_primario,
        REPLACE(
          SUBSTRING(
            dstchannel, POSITION('/' in dstchannel) + 1,
              POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
            )
          , '-', ''
        )
        AS destino_secundario,
        CASE 
          WHEN typecall='Recebida' THEN
            SUBSTRING(lastdata, 0, POSITION(',' in lastdata))
          WHEN typecall='Efetuada' THEN
            dst
          ELSE SUBSTRING(lastdata, 0, POSITION(',' in lastdata))
        END
        AS setor,
        duration - billsec AS aguardando_atendimento,
        duration AS duracao,
        CASE 
          WHEN disposition='NO ANSWER' THEN 'Não Atendida'
          WHEN disposition='ANSWERED' THEN 'Atendida'
          ELSE ''
        END
        AS status,
        sequence AS sequencia,
        typecall AS tipo,
        callprotocol AS protocolo,
        fromtypecall AS tipo_saida,
        uniqueid AS id_sub,
        hangupcause AS encerramento
      FROM cdr AS a
        WHERE (calldate BETWEEN data_inicial AND data_final)
        AND
          CASE
            WHEN statusCall = 'Atendida' THEN
              disposition = 'ANSWERED'
            WHEN statusCall='Não Atendida' THEN
              a.uniqueid NOT IN (
              SELECT DISTINCT(uniqueid) FROM cdr
              WHERE (calldate BETWEEN data_inicial AND data_final)
              AND disposition LIKE 'ANSWERED' AND lastapp = 'Queue' 
              AND lastdata LIKE '%' || recSector || '%'
              AND dstchannel LIKE '%' || endpoint || '%'
            )
          END
        AND
          CASE 
            WHEN recSector='' THEN
              lastdata LIKE '%'
            ELSE lastdata LIKE recSector || '%'
          END
        AND dstchannel LIKE '%' || endpoint || '%'
      ORDER BY uniqueid DESC, calldate DESC
      LIMIT limitGet OFFSET offsetGet;
    END;
  $$;

SELECT * FROM get_chart_by_sectors_rows('2022-01-26', '2022-01-26', '00:00:00', '23:59:59', 'tests', '', 'Atendida', '50', '0');
SELECT * FROM get_chart_by_sectors_rows('2022-01-26', '2022-01-26', '00:00:00', '23:59:59', 'atendimento', '', 'Não Atendida', '50', '0');
SELECT * FROM get_chart_by_sectors_rows('2022-01-26', '2022-01-26', '00:00:00', '23:59:59', 'agricola', '', 'Não Atendida', '50', '0');
SELECT * FROM get_chart_by_sectors_rows('2022-01-25', '2022-01-25', '00:00:00', '23:59:59', '', '7007', 'Atendida', '50', '0');
SELECT * FROM get_chart_by_sectors_rows('2022-01-25', '2022-01-25', '00:00:00', '23:59:59', '', '1025', 'Não Atendida', '50', '0');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- WORKING --
-- ** Filtros ** --
-- Data: calldate ===> dateInitial, dateEnd
-- Tipo: 'typecall' ===> 
-- Setor: Apenas Recebidas --> lastdata ===> recSector
-- Ramal:
--      Recebida: '%dstchannel%'
--      Efetuada: 'src'
-- Telefone:
--      Recebida: '%src'
--      Efetuada: '%dst'
-- Protocolo: 'callprotocol'
-- Código de Area ---> Não Usar

SELECT
  COUNT(DISTINCT(uniqueid)) AS no_answer 
FROM cdr AS a
  WHERE (calldate BETWEEN '2022-02-25 00:00:00' AND '2022-02-25 23:59:59')
  AND a.uniqueid NOT IN (
    SELECT uniqueid FROM cdr
    WHERE (calldate BETWEEN '2022-02-25 00:00:00' AND '2022-02-25 23:59:59')
    AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
  )
GROUP BY hours_calls;

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 17- Function Get All Data Report --

COPY (SELECT * FROM  "get_vol_endp_rec_aswered"('2022-02-25', '2022-02-25', '00:00:00', '23:59:59', '', '', '', '')) TO '/var/lib/postgresql/report/allcsv/1_ramais_recebidas_atendidas.csv' WITH csv HEADER;
COPY (SELECT * FROM  "get_vol_endp_rec_no_aswer"('2022-02-25', '2022-02-25', '00:00:00', '23:59:59', '', '', '', '')) TO '/var/lib/postgresql/report/allcsv/2_ramais_recebidas_nao-atendidas.csv' WITH csv HEADER;
COPY (SELECT * FROM  "get_vol_sent_endp_answered"('2022-02-25', '2022-02-25', '00:00:00', '23:59:59', '', '', '', '')) TO '/var/lib/postgresql/report/allcsv/3_ramais_efetuadas_atendidas.csv' WITH csv HEADER;
COPY (SELECT * FROM  "get_vol_sent_endp_no_answer"('2022-02-25', '2022-02-25', '00:00:00', '23:59:59', '', '', '', '')) TO '/var/lib/postgresql/report/allcsv/4_ramais_efetuadas_nao-atendidas.csv' WITH csv HEADER;
COPY (SELECT * FROM  "get_vol_rec_answ_by_hour"('2022-02-25', '2022-02-25', '00:00:00', '23:59:59', '', '', '', '')) TO '/var/lib/postgresql/report/allcsv/5_por_hora.csv' WITH csv HEADER;
COPY (SELECT * FROM  "get_vol_rec_no_answ_by_hour"('2022-02-25', '2022-02-25', '00:00:00', '23:59:59', '', '', '', '')) TO '/var/lib/postgresql/report/allcsv/6_or_hora_nao_atendida.csv' WITH csv HEADER;
COPY (SELECT * FROM  "get_vol_sec_rec"('2022-02-25', '2022-02-25', '00:00:00', '23:59:59', 'crm', '', '', '')) TO '/var/lib/postgresql/report/allcsv/7_setor_recebidas_atendidas.csv' WITH csv HEADER;
COPY (SELECT * FROM  "get_vol_sec_no_ans"('2022-02-25', '2022-02-25', '00:00:00', '23:59:59', 'crm', '', '', '')) TO '/var/lib/postgresql/report/allcsv/8_setor_recebidas_nao-atendidas.csv' WITH csv HEADER;
COPY (SELECT * FROM  "get_data_report_received"('2022-02-25', '2022-02-25', '00:00:00', '23:59:59', '', '', '', '')) TO '/var/lib/postgresql/report/allcsv/9_report_global_recebidas.csv' WITH csv HEADER;
COPY (SELECT * FROM  "get_data_report_sent"('2022-02-25', '2022-02-25', '00:00:00', '23:59:59', '', '', '', '')) TO '/var/lib/postgresql/report/allcsv/99_report_global_efetuadas.csv' WITH csv HEADER;
COPY (SELECT * FROM get_all_calls_rows('2022-02-25', '2022-02-25', '00:00:00', '23:59:59', '', '', '', '', '', '', '50000', '0')) TO '/var/lib/postgresql/report/log_chamadas.csv' WITH csv HEADER;

-- cat /var/lib/postgresql/report/allcsv/*.csv > /var/lib/postgresql/report/report.csv
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
SELECT
CASE 
  WHEN dstchannel SIMILAR TO '%@%' = False THEN 
    REPLACE(
      SUBSTRING(
        dstchannel, POSITION('/' in dstchannel) + 1,
          POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
        )
      , '-', ''
    )
  ELSE
    REPLACE(
      SUBSTRING(
        dstchannel, POSITION('/' in dstchannel) + 1,
          (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
        )
      , '-', ''
    )
END
AS endpoints, COUNT(dstchannel)
FROM cdr
WHERE (calldate BETWEEN '2022-02-14 00:00:00' AND '2022-02-14 23:59:59')
AND typecall = 'Recebida' AND dstchannel <> '' AND disposition = 'ANSWERED' AND CHAR_LENGTH(src) > 4
GROUP BY endpoints
ORDER BY endpoints;




------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES (1421045555, 'sip:1421045555@189.52.73.116:5060', 120);
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, from_domain, direct_media, dtmf_mode, language, tos_audio, cos_audio)
  VALUES
(1421045555, 'udp_transport', 'Embratel', 'all', 'ulaw,alaw', 1421045555, '200.191.211.54', 'no', 'info', 'pt_BR', 'af42', 3);
INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, transport) VALUES (1421045555, 'sip:189.52.73.116', 'sip:1421045555@ 200.191.211.54', 1421045555, 'udp_transport');
INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES (1421045555, 1421045555, '189.52.73.116');

INSERT INTO ps_aors (id, max_contacts, qualify_frequency, remove_existing) VALUES (1001, 1, 120, 'yes');
INSERT INTO ps_auths (id, auth_type, password, username) VALUES (1001, 'userpass', '!vigos!!interface#01!', 1001);
INSERT INTO ps_endpoints (id, transport, aors, auth, context, callerid, language, inband_progress, rtp_timeout, message_context, allow_subscribe, subscribe_context, direct_media, dtmf_mode, device_state_busy_at, disallow, allow)
  VALUES
(5555, 'udp_transport', 5555, 5555, 'ddd-celular', '5555 <5555>', 'pt_BR', 'no', 120, 'textmessages', 'yes', 'subscriptions', 'no', 'inband', 1, 'all', 'ulaw');

CREATE TYPE sip_dtmfmode_values AS ENUM ('rfc2833', 'info', 'inband', 'auto');


UPDATE FROM cdr SET typecall = 'Recebida' WHERE CHAR_LENGTH(src) > 4;
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--- 1- Function GET CALLS TO REPORT TABLE RECEIVED ---
DROP FUNCTION get_data_report_received;
CREATE OR REPLACE FUNCTION get_data_report_received(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "amount_calls" bigint,
    "answered_calls" bigint,
    "no_answer_calls" bigint,
    "busy_calls" bigint,
    "transshipment_calls" bigint,
    "total_time_calls" text,
    "average_time_calls" text,
    "average_queue_calls" text
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);

    BEGIN
      return query
      SELECT
      COUNT(DISTINCT(uniqueid)) AS amount_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          -- AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
          AND disposition LIKE 'ANSWERED' AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS answered_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr AS a
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND a.uniqueid
          NOT IN (SELECT DISTINCT(uniqueid) FROM cdr
            WHERE (calldate BETWEEN data_inicial AND data_final)
            -- AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
            AND disposition LIKE 'ANSWERED' AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
            AND lastdata LIKE '%' || recSector || '%'
            AND src LIKE '%' || telNumber || '%'
            AND callprotocol LIKE '%' || protocol || '%'
            )
          AND disposition LIKE 'NO ANSWER' AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
          AND dstchannel LIKE '%' || endpoint || '%'
          AND lastdata LIKE '%' || recSector || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
          ) AS no_answer_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          -- AND  disposition LIKE 'BUSY' AND typecall = 'Recebida'
          AND  disposition LIKE 'BUSY' AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
          AND
            CASE WHEN char_length(recSector) > 0 THEN
              CASE 
                WHEN dstchannel SIMILAR TO '%@%' = False THEN 
                  REPLACE(
                    SUBSTRING(
                      dstchannel, POSITION('/' in dstchannel) + 1,
                        POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
                      )
                    , '-', ''
                  )
                ELSE
                  REPLACE(
                    SUBSTRING(
                      dstchannel, POSITION('/' in dstchannel) + 1,
                        (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
                      )
                    , '-', ''
                  )
              END
                IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
              ELSE
                dstchannel LIKE '%' || endpoint || '%'
            END
          -- AND lastdata LIKE '%' || recSector || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS busy_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          -- AND lastdata LIKE '%transb%' AND typecall = 'Recebida'
           AND lastdata LIKE '%transb%' AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
          AND
            CASE WHEN char_length(recSector) > 0 THEN
              CASE 
                WHEN dstchannel SIMILAR TO '%@%' = False THEN 
                  REPLACE(
                    SUBSTRING(
                      dstchannel, POSITION('/' in dstchannel) + 1,
                        POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
                      )
                    , '-', ''
                  )
                ELSE
                  REPLACE(
                    SUBSTRING(
                      dstchannel, POSITION('/' in dstchannel) + 1,
                        (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
                      )
                    , '-', ''
                  )
              END
                IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
              ELSE
                dstchannel LIKE '%' || endpoint || '%'
            END
          -- AND lastdata LIKE '%' || recSector || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
          ) AS transshipment_calls,
        (SELECT TO_CHAR((SUM(DISTINCT(duration)) || ' second')::interval, 'HH24:MI:SS')
          FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          -- AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
          AND disposition LIKE 'ANSWERED' AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
          AND
            CASE WHEN char_length(recSector) > 0 THEN
              CASE 
                WHEN dstchannel SIMILAR TO '%@%' = False THEN 
                  REPLACE(
                    SUBSTRING(
                      dstchannel, POSITION('/' in dstchannel) + 1,
                        POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
                      )
                    , '-', ''
                  )
                ELSE
                  REPLACE(
                    SUBSTRING(
                      dstchannel, POSITION('/' in dstchannel) + 1,
                        (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
                      )
                    , '-', ''
                  )
              END
                IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
              ELSE
                dstchannel LIKE '%' || endpoint || '%'
            END
          -- AND lastdata LIKE '%' || recSector || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS total_time_calls,
        (SELECT TO_CHAR((AVG(DISTINCT(duration)) || ' second')::interval, 'HH24:MI:SS')
          FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          -- AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
          AND disposition LIKE 'ANSWERED' AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
          AND
            CASE WHEN char_length(recSector) > 0 THEN
              CASE 
                WHEN dstchannel SIMILAR TO '%@%' = False THEN 
                  REPLACE(
                    SUBSTRING(
                      dstchannel, POSITION('/' in dstchannel) + 1,
                        POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
                      )
                    , '-', ''
                  )
                ELSE
                  REPLACE(
                    SUBSTRING(
                      dstchannel, POSITION('/' in dstchannel) + 1,
                        (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
                      )
                    , '-', ''
                  )
              END
                IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
              ELSE
                dstchannel LIKE '%' || endpoint || '%'
            END
          -- AND lastdata LIKE '%' || recSector || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS average_time_calls,
        (SELECT TO_CHAR((AVG(billsec) || ' second')::interval, 'HH24:MI:SS') FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          -- AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
          AND disposition LIKE 'ANSWERED' AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
          AND
            CASE WHEN char_length(recSector) > 0 THEN
              CASE 
                WHEN dstchannel SIMILAR TO '%@%' = False THEN 
                  REPLACE(
                    SUBSTRING(
                      dstchannel, POSITION('/' in dstchannel) + 1,
                        POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
                      )
                    , '-', ''
                  )
                ELSE
                  REPLACE(
                    SUBSTRING(
                      dstchannel, POSITION('/' in dstchannel) + 1,
                        (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
                      )
                    , '-', ''
                  )
              END
                IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
              ELSE
                dstchannel LIKE '%' || endpoint || '%'
            END
          -- AND lastdata LIKE '%' || recSector || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS average_queue_calls
      FROM cdr
      WHERE (calldate BETWEEN data_inicial AND data_final)
      -- AND typecall = 'Recebida'
      AND char_length(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
      AND
        CASE WHEN char_length(recSector) > 0 THEN
          CASE 
              WHEN dstchannel SIMILAR TO '%@%' = False THEN 
                REPLACE(
                  SUBSTRING(
                    dstchannel, POSITION('/' in dstchannel) + 1,
                      POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
                    )
                  , '-', ''
                )
              ELSE
                REPLACE(
                  SUBSTRING(
                    dstchannel, POSITION('/' in dstchannel) + 1,
                      (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
                    )
                  , '-', ''
                )
            END
          IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
          ELSE
            dstchannel LIKE '%' || endpoint || '%'
        END
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%';
    END;
  $$;

-- SELECT * FROM  "get_data_report_received"('2022-04-01', '2022-04-12', '00:00:00', '23:59:59', 'isr_n1', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--- 2- Function GET CALLS TO REPORT TABLE SENT ---
DROP FUNCTION get_data_report_sent;
CREATE OR REPLACE FUNCTION get_data_report_sent(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "amount_calls" bigint,
    "answered_calls" bigint,
    "no_answer_calls" bigint,
    "busy_calls" bigint,
    "failed_calls" bigint,
    "total_time_calls" text,
    "average_time_calls" text
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);

    BEGIN
      return query
      SELECT
        COUNT(DISTINCT(uniqueid)) AS amount_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND disposition LIKE 'ANSWERED' AND lastdata LIKE '%@%' AND CHAR_LENGTH(dst) > 4
          AND src IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
          AND
            CASE WHEN char_length(recSector) > 0 THEN 
              src IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
            ELSE
              src LIKE '%' || endpoint || '%'
            END
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS answered_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr AS a
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND a.uniqueid NOT IN (SELECT uniqueid FROM cdr 
            WHERE (calldate BETWEEN data_inicial AND data_final)
            AND disposition LIKE 'ANSWERED'
            AND CHAR_LENGTH(dst) > 4 AND lastdata LIKE '%@%'
          AND
            CASE WHEN char_length(recSector) > 0 THEN 
              src IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
            ELSE
              src LIKE '%' || endpoint || '%'
            END
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%')
          AND disposition LIKE 'NO ANSWER' AND lastdata LIKE '%@%' AND CHAR_LENGTH(dst) > 4
          AND
            CASE WHEN char_length(recSector) > 0 THEN 
              src IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
            ELSE
              src LIKE '%' || endpoint || '%'
            END
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS no_answer_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND  disposition LIKE 'BUSY'
          AND CHAR_LENGTH(dst) > 4
           AND lastdata LIKE '%@%'
          AND
            CASE WHEN char_length(recSector) > 0 THEN 
              src IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
            ELSE
              src LIKE '%' || endpoint || '%'
            END
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS busy_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND  disposition LIKE 'FAILED' AND CHAR_LENGTH(dst) > 4 AND lastdata LIKE '%@%'
          AND
            CASE WHEN char_length(recSector) > 0 THEN 
              src IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
            ELSE
              src LIKE '%' || endpoint || '%'
            END
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS failed_calls,
        TO_CHAR((SUM(DISTINCT(duration)) || ' second')::interval, 'HH24:MI:SS') AS total_time_calls,
        TO_CHAR((AVG(DISTINCT(duration)) || ' second')::interval, 'HH24:MI:SS') AS average_time_calls
      FROM cdr
        WHERE (calldate BETWEEN data_inicial AND data_final)
        AND lastdata LIKE '%@%' AND CHAR_LENGTH(dst) > 4
          AND
            CASE WHEN char_length(recSector) > 0 THEN 
              src IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
            ELSE
              src LIKE '%' || endpoint || '%'
            END
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%';
    END;
  $$;

-- SELECT * FROM  "get_data_report_sent"('2022-03-01', '2022-03-15', '00:00:00', '23:59:59', '', '', '', '');
-- SELECT * FROM  "get_data_report_sent"('2022-01-05 00:00:00', '2022-01-30 23:59:59', '', '4104', '', '');
-- SELECT * FROM  "get_data_report_sent"('2022-01-05 00:00:00', '2022-01-30 23:59:59', '', '', '1430420844', '');
-- SELECT * FROM  "get_data_report_sent"('2022-01-05 00:00:00', '2022-01-30 23:59:59', '', '', '', '202201061503397');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 3- Function Get Endpoints as Volume Calls Received ANSWERED --
DROP FUNCTION get_vol_endp_rec_aswered;
CREATE OR REPLACE FUNCTION get_vol_endp_rec_aswered(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "endpoints" text,
    "received_answered" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return QUERY
      SELECT
        CASE 
        WHEN dstchannel SIMILAR TO '%@%' = False THEN 
          REPLACE(
            SUBSTRING(
              dstchannel, POSITION('/' in dstchannel) + 1,
                POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
              )
            , '-', ''
          )
        ELSE
          REPLACE(
            SUBSTRING(
              dstchannel, POSITION('/' in dstchannel) + 1,
                (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
              )
            , '-', ''
          )
        END
      AS endpoints, COUNT(dstchannel) FROM cdr
      WHERE (calldate BETWEEN data_inicial AND data_final)
      AND disposition = 'ANSWERED' AND CHAR_LENGTH(src) > 4 AND dstchannel SIMILAR TO '%@%' = False AND dstchannel <> ''
      -- AND lastdata LIKE '%' || recSector || '%'
      AND
        CASE WHEN char_length(recSector) > 0 THEN
          CASE 
          WHEN dstchannel SIMILAR TO '%@%' = True THEN            
            REPLACE(
              SUBSTRING(
                dstchannel, POSITION('/' in dstchannel) + 1,
                  (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
                )
              , '-', ''
            )
          ELSE REPLACE(
            SUBSTRING(
              dstchannel, POSITION('/' in dstchannel) + 1,
                POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
              )
            , '-', ''
          )
          END IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
        ELSE
          dstchannel LIKE '%' || endpoint || '%'
        END
      AND src LIKE '%' || telNumber || '%'
      AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY endpoints
      ORDER BY endpoints;
    END;
  $$;

-- SELECT * FROM  "get_vol_endp_rec_aswered"('2022-03-15', '2022-03-30', '00:00:00', '23:59:59', '', '', '', '');

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 4- Function Get Endpoints as Volume Calls Received NO ANSWER--
DROP FUNCTION get_vol_endp_rec_no_aswer;
CREATE OR REPLACE FUNCTION get_vol_endp_rec_no_aswer(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "endpoints" text,
    "received_no_aswer" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return QUERY
      SELECT
        REPLACE(
          SUBSTRING(
            dstchannel, POSITION('/' in dstchannel) + 1,
              POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
            )
          , '-', ''
        ) AS endpoints, COUNT(DISTINCT(uniqueid)) FROM cdr AS a
      WHERE (calldate BETWEEN data_inicial AND data_final)
      AND a.uniqueid NOT IN (SELECT uniqueid FROM cdr
        WHERE (calldate BETWEEN data_inicial AND data_final) AND disposition = 'ANSWERED' AND CHAR_LENGTH(src) > 4  AND dstchannel <> '')
      AND disposition = 'NO ANSWER' AND CHAR_LENGTH(src) > 4
      -- AND lastdata LIKE '%' || recSector || '%'
      AND
        CASE WHEN char_length(recSector) > 0 THEN
          CASE 
          WHEN dstchannel SIMILAR TO '%@%' = True THEN            
            REPLACE(
              SUBSTRING(
                dstchannel, POSITION('/' in dstchannel) + 1,
                  (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
                )
              , '-', ''
            )
          ELSE REPLACE(
            SUBSTRING(
              dstchannel, POSITION('/' in dstchannel) + 1,
                POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
              )
            , '-', ''
          )
          END IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
        ELSE
          dstchannel LIKE '%' || endpoint || '%'
        END
      AND src LIKE '%' || telNumber || '%'
      AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY endpoints
      ORDER BY endpoints;
    END;
  $$;

-- SELECT * FROM  "get_vol_endp_rec_no_aswer"('2022-01-28', '2022-01-28', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 5- Function Get Endpoints as Volume Calls Sent ANSWERED--
DROP FUNCTION get_vol_sent_endp_answered;
CREATE OR REPLACE FUNCTION get_vol_sent_endp_answered(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "endpoints" character varying(80),
    "sent_answered" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return QUERY
      SELECT src AS endpoints, COUNT(DISTINCT(uniqueid)) FROM cdr
        WHERE  char_length(src) < 5
        AND (calldate BETWEEN data_inicial AND data_final)
        AND disposition = 'ANSWERED' AND char_length(dst) > 4
        AND
          CASE WHEN char_length(recSector) > 0 THEN 
            src IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
          ELSE
            src LIKE '%' || endpoint || '%'
          END
        AND dst LIKE '%' || telNumber || '%'
        AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY endpoints
      ORDER BY endpoints;
    END;
  $$;

-- SELECT * FROM  "get_vol_sent_endp_answered"('2022-02-14', '2022-02-14', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 6- Function Get Endpoints as Volume Calls Sent NO ANSWER --
DROP FUNCTION get_vol_sent_endp_no_answer;
CREATE OR REPLACE FUNCTION get_vol_sent_endp_no_answer(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "endpoints" character varying(80),
    "sent_no_answer" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return QUERY
      SELECT src AS endpoints, COUNT(DISTINCT(uniqueid)) FROM cdr AS a
      WHERE char_length(src) < 5
      AND (calldate BETWEEN data_inicial AND data_final)
        AND a.uniqueid NOT IN (
          SELECT DISTINCT(uniqueid) FROM cdr
          WHERE char_length(src) < 5
          AND (calldate BETWEEN data_inicial AND data_final)
          AND disposition LIKE 'ANSWERED'
          AND src IN (SELECT id FROM ps_endpoints WHERE named_pickup_group = 'crm')
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%')
        AND disposition = 'NO ANSWER' AND char_length(dst) > 4
        AND
          CASE WHEN char_length(recSector) > 0 THEN 
            src IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
          ELSE
            src LIKE '%' || endpoint || '%'
          END
        AND dst LIKE '%' || telNumber || '%'
        AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY endpoints
      ORDER BY endpoints;
    END;
  $$;

-- SELECT * FROM  "get_vol_sent_endp_no_answer"('2022-02-14', '2022-02-14', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 7- Function Get Volume Calls Sent Internal and External --
DROP FUNCTION get_volume_sent_external_and_external;
CREATE OR REPLACE FUNCTION get_volume_sent_external_and_external(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "externas" bigint,
    "internas" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return QUERY
      SELECT
        (
          SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND typecall = 'Efetuada' AND dstchannel <> '' AND lastdata LIKE '%@%' AND CHAR_LENGTH(dst) > 4
          AND
            CASE WHEN char_length(recSector) > 0 THEN 
              src IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
            ELSE
              src LIKE '%' || endpoint || '%'
            END
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS externas,
        (
          SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND typecall = 'Efetuada' AND dstchannel <> '' AND CHAR_LENGTH(dst) < 5
          AND
            CASE WHEN char_length(recSector) > 0 THEN 
              src IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
            ELSE
              src LIKE '%' || endpoint || '%'
            END
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS internas;
    END;
  $$;

-- SELECT * FROM  "get_volume_sent_external_and_external"('2022-01-01', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 8- Function Get Volume Calls Received and Answered By Sector --
DROP FUNCTION get_vol_sec_rec;
CREATE OR REPLACE FUNCTION get_vol_sec_rec(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "sectors" text,
    "answered" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
    BEGIN
      return QUERY
      SELECT SUBSTRING(lastdata, 0, POSITION(',' in lastdata)) AS sectors, COUNT(DISTINCT(uniqueid)) as answered FROM cdr
      WHERE (calldate BETWEEN data_inicial AND data_final)
      AND lastapp = 'Queue' AND disposition = 'ANSWERED' AND CHAR_LENGTH(src) > 4  AND dstchannel <> ''
      AND lastdata LIKE '%' || recSector || '%'
      AND dstchannel LIKE '%' || endpoint || '%'
      AND src LIKE '%' || telNumber || '%'
      AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY sectors
      ORDER BY sectors;
    END;
  $$;

-- SELECT * FROM  "get_vol_sec_rec"('2022-01-28', '2022-01-28', '00:00:00', '23:59:59', 'comercial', '', '', '');

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 9- Function Get Volume Calls Received and Not Answered By Sector --
DROP FUNCTION get_vol_sec_no_ans;
CREATE OR REPLACE FUNCTION get_vol_sec_no_ans(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "sectors" text,
    "no_answer" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return QUERY
      SELECT SUBSTRING(lastdata, 0, POSITION(',' in lastdata)) AS sectors_not_atennd, COUNT(DISTINCT(uniqueid)) AS no_answer FROM cdr AS a
        WHERE (calldate BETWEEN data_inicial AND data_final)
        AND a.uniqueid NOT IN (
          SELECT uniqueid FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
           AND lastapp = 'Queue' AND disposition = 'ANSWERED' AND CHAR_LENGTH(src) > 4  AND dstchannel <> ''
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        )
        AND disposition LIKE 'NO ANSWER' AND lastapp = 'Queue' AND CHAR_LENGTH(src) > 4  AND dstchannel <> ''
        AND lastdata LIKE '%' || recSector || '%'
        AND dstchannel LIKE '%' || endpoint || '%'
        AND src LIKE '%' || telNumber || '%'
        AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY sectors_not_atennd
      ORDER BY sectors_not_atennd;
    END;
  $$;

-- SELECT * FROM  "get_vol_sec_no_ans"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 10- Function Get Volume Calls Received By Hour Answered--
DROP FUNCTION get_vol_rec_answ_by_hour;
CREATE OR REPLACE FUNCTION get_vol_rec_answ_by_hour(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "hours_calls" double precision,
    "answered" bigint,
    "no_answer" integer
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return QUERY
        SELECT
          EXTRACT(HOUR FROM calldate) AS hours_calls, COUNT(DISTINCT(uniqueid)) AS answered, 0 AS no_answer
        FROM cdr 
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
          AND lastdata LIKE '%' || recSector || '%'
          AND
            CASE WHEN char_length(recSector) > 0 THEN
              CASE 
              WHEN dstchannel SIMILAR TO '%@%' = True THEN            
                REPLACE(
                  SUBSTRING(
                    dstchannel, POSITION('/' in dstchannel) + 1,
                      (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
                    )
                  , '-', ''
                )
              ELSE REPLACE(
                SUBSTRING(
                  dstchannel, POSITION('/' in dstchannel) + 1,
                    POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
                  )
                , '-', ''
              )
              END IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
            ELSE
              dstchannel LIKE '%' || endpoint || '%'
            END
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        GROUP BY hours_calls;
    END;
  $$;

-- SELECT * FROM  "get_vol_rec_answ_by_hour"('2022-02-25', '2022-02-25', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 11- Function Get Volume Calls Received By Hour No Answer--
DROP FUNCTION get_vol_rec_no_answ_by_hour;
CREATE OR REPLACE FUNCTION get_vol_rec_no_answ_by_hour(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "hours_calls" double precision,
    "answered" integer,
    "no_answer" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return query
        SELECT
          EXTRACT(HOUR FROM calldate) AS hours_calls, 0 AS answered,
          COUNT(DISTINCT(uniqueid)) AS no_answer 
        FROM cdr AS a
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND a.uniqueid NOT IN (
            SELECT uniqueid FROM cdr
            WHERE (calldate BETWEEN data_inicial AND data_final)
            AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
          AND lastdata LIKE '%' || recSector || '%'
          AND
            CASE WHEN char_length(recSector) > 0 THEN
              CASE 
              WHEN dstchannel SIMILAR TO '%@%' = True THEN            
                REPLACE(
                  SUBSTRING(
                    dstchannel, POSITION('/' in dstchannel) + 1,
                      (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
                    )
                  , '-', ''
                )
              ELSE REPLACE(
                SUBSTRING(
                  dstchannel, POSITION('/' in dstchannel) + 1,
                    POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
                  )
                , '-', ''
              )
              END IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
            ELSE
              dstchannel LIKE '%' || endpoint || '%'
            END
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
          )
          AND disposition LIKE 'NO ANSWER' AND typecall = 'Recebida'
          AND lastdata LIKE '%' || recSector || '%'
          AND
        CASE WHEN char_length(recSector) > 0 THEN
          CASE 
          WHEN dstchannel SIMILAR TO '%@%' = True THEN            
            REPLACE(
              SUBSTRING(
                dstchannel, POSITION('/' in dstchannel) + 1,
                  (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
                )
              , '-', ''
            )
          ELSE REPLACE(
            SUBSTRING(
              dstchannel, POSITION('/' in dstchannel) + 1,
                POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
              )
            , '-', ''
          )
          END IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
        ELSE
          dstchannel LIKE '%' || endpoint || '%'
        END
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        GROUP BY hours_calls;
    END;
  $$;

-- SELECT * FROM  "get_vol_rec_no_answ_by_hour"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 12- Function Get Volume Calls Received Global Sectors --
DROP FUNCTION get_vol_rec_answered_and_no_answer_global;
CREATE OR REPLACE FUNCTION get_vol_rec_answered_and_no_answer_global(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
  RETURNS TABLE (
    "answered" bigint,
    "no_answer" bigint
  )
  LANGUAGE plpgsql AS
  $$
    DECLARE
      data_inicial timestamp = CONCAT(dateInitial, ' ', hourInitial);
      data_final timestamp = CONCAT(dateEnd, ' ', hourEnd);
      
    BEGIN
      return QUERY
      SELECT
        (SELECT
          COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND disposition LIKE 'ANSWERED' AND lastapp = 'Queue'
        AND lastdata LIKE '%' || recSector || '%'
        AND
        CASE WHEN char_length(recSector) > 0 THEN
          CASE 
          WHEN dstchannel SIMILAR TO '%@%' = True THEN            
            REPLACE(
              SUBSTRING(
                dstchannel, POSITION('/' in dstchannel) + 1,
                  (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
                )
              , '-', ''
            )
          ELSE REPLACE(
            SUBSTRING(
              dstchannel, POSITION('/' in dstchannel) + 1,
                POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
              )
            , '-', ''
          )
          END IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
        ELSE
          dstchannel LIKE '%' || endpoint || '%'
        END
        AND src LIKE '%' || telNumber || '%'
        AND callprotocol LIKE '%' || protocol || '%') AS answered,
        (SELECT
          COUNT(DISTINCT(uniqueid))
        FROM cdr AS a
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND a.uniqueid NOT IN (
            SELECT DISTINCT(uniqueid) FROM cdr
            WHERE (calldate BETWEEN data_inicial AND data_final)
            AND disposition LIKE 'ANSWERED' AND lastapp = 'Queue'
            AND lastdata LIKE '%' || recSector || '%'
            AND
              CASE WHEN char_length(recSector) > 0 THEN
                CASE 
                WHEN dstchannel SIMILAR TO '%@%' = True THEN            
                  REPLACE(
                    SUBSTRING(
                      dstchannel, POSITION('/' in dstchannel) + 1,
                        (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
                      )
                    , '-', ''
                  )
                ELSE REPLACE(
                  SUBSTRING(
                    dstchannel, POSITION('/' in dstchannel) + 1,
                      POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
                    )
                  , '-', ''
                )
                END IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
              ELSE
                dstchannel LIKE '%' || endpoint || '%'
              END
            AND src LIKE '%' || telNumber || '%'
            AND callprotocol LIKE '%' || protocol || '%'
          )
          AND disposition LIKE 'NO ANSWER' AND lastapp = 'Queue'
          AND lastdata LIKE '%' || recSector || '%'
          AND
            CASE WHEN char_length(recSector) > 0 THEN
              CASE 
              WHEN dstchannel SIMILAR TO '%@%' = True THEN            
                REPLACE(
                  SUBSTRING(
                    dstchannel, POSITION('/' in dstchannel) + 1,
                      (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
                    )
                  , '-', ''
                )
              ELSE REPLACE(
                SUBSTRING(
                  dstchannel, POSITION('/' in dstchannel) + 1,
                    POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
                  )
                , '-', ''
              )
              END IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%'|| recSector || '%')
            ELSE
              dstchannel LIKE '%' || endpoint || '%'
            END
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%') AS no_answer;
    END;
  $$;

-- SELECT * FROM  "get_vol_rec_answered_and_no_answer_global"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 14- Function Get All Data Report --
DROP FUNCTION get_itens_report;
CREATE OR REPLACE FUNCTION get_itens_report( 
  ref1 refcursor,
  ref2 refcursor,
  ref3 refcursor,
  ref4 refcursor,
  ref5 refcursor,
  ref6 refcursor,
  ref7 refcursor,
  ref8 refcursor,
  ref9 refcursor,
  ref10 refcursor,
  ref11 refcursor,
  ref12 refcursor,
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)
RETURNS SETOF refcursor 
LANGUAGE 'plpgsql'
COST 100
VOLATILE PARALLEL UNSAFE
ROWS 2000

AS $BODY$
DECLARE
            
BEGIN
  OPEN ref1 FOR SELECT * FROM  "get_vol_endp_rec_aswered"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref1;

  OPEN ref2 FOR SELECT * FROM  "get_vol_endp_rec_no_aswer"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref2;

  OPEN ref3 FOR SELECT * FROM  "get_vol_sent_endp_answered"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref3;

  OPEN ref4 FOR SELECT * FROM  "get_vol_sent_endp_no_answer"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref4;

  OPEN ref5 FOR SELECT * FROM  "get_volume_sent_external_and_external"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref5;

  OPEN ref6 FOR SELECT * FROM  "get_vol_sec_rec"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref6;

  OPEN ref7 FOR SELECT * FROM  "get_vol_sec_no_ans"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref7;

  OPEN ref8 FOR SELECT * FROM  "get_vol_rec_answ_by_hour"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref8;

  OPEN ref9 FOR SELECT * FROM  "get_vol_rec_no_answ_by_hour"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref9;

  OPEN ref10 FOR SELECT * FROM  "get_vol_rec_answered_and_no_answer_global"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref10;

  OPEN ref11 FOR SELECT * FROM  "get_data_report_received"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref11;

  OPEN ref12 FOR SELECT * FROM  "get_data_report_sent"(dateInitial, dateEnd, hourInitial, hourEnd, recSector, endpoint, telNumber, protocol);
  RETURN NEXT ref12;
END;
$BODY$;

DROP FUNCTION get_itens_report( 
  ref1 refcursor,
  ref2 refcursor,
  ref3 refcursor,
  ref4 refcursor,
  ref5 refcursor,
  ref6 refcursor,
  ref7 refcursor,
  ref8 refcursor,
  ref9 refcursor,
  ref10 refcursor,
  ref11 refcursor,
  ref12 refcursor,
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
);

BEGIN;
    SELECT get_itens_report('Ref1', 'Ref2', 'Ref3', 'Ref4', 'Ref5', 'Ref6', 'Ref7', 'Ref8', 'Ref9', 'Ref10', 'Ref11', 'Ref12', '2022-01-26', '2022-01-26', '00:00:00', '23:59:59', 'boutique', '', '', '');
    FETCH ALL IN "Ref1";
    FETCH ALL IN "Ref2";
    FETCH ALL IN "Ref3";
    FETCH ALL IN "Ref4";
    FETCH ALL IN "Ref5";
    FETCH ALL IN "Ref6";
    FETCH ALL IN "Ref7";
    FETCH ALL IN "Ref8";
    FETCH ALL IN "Ref9";
    FETCH ALL IN "Ref10";
    FETCH ALL IN "Ref11";
    FETCH ALL IN "Ref12";
COMMIT;

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 16- Function Get Rows For Calls --
SELECT
  calldate, src, dst, dstchannel, lastapp, lastdata
FROM cdr
AND lastapp = 'Queue'
-- AND lastdata LIKE '%closer%'
AND dstchannel LIKE '%/7252%'
ORDER BY calldate DESC;

SELECT
  calldate, src, dst, dstchannel, lastapp, lastdata
FROM cdr
WHERE (calldate BETWEEN '2022-03-29 00:00:00' AND '2022-03-29 23:59:59')
AND lastdata LIKE 'crm%'
AND dstchannel LIKE '%/251%'
ORDER BY calldate
DESC LIMIT 50;

SELECT
  calldate, src, dst, dstchannel, lastapp, lastdata
FROM cdr
WHERE (calldate BETWEEN '2022-03-29 00:00:00' AND '2022-03-29 23:59:59')
AND lastdata LIKE 'closer%'
AND dstchannel LIKE '%7277%'
ORDER BY calldate
DESC LIMIT 50;

SELECT
  calldate, src, dst, dstchannel, lastapp, lastdata
FROM cdr
WHERE (calldate BETWEEN '2022-03-29 00:00:00' AND '2022-03-29 23:59:59')
AND lastdata LIKE 'sdr_n2%'
AND dstchannel LIKE '%7251%'
ORDER BY calldate
DESC LIMIT 50;

'crm,rthHk,,,45'

UPDATE cdr SET lastdata = 'sdr_n2,rthHk,,,45'
WHERE lastdata LIKE 'crm%'
AND dstchannel LIKE '%/7251%';

UPDATE cdr SET lastdata = 'sdr_n2,rthHk,,,45'
WHERE lastdata LIKE 'crm%'
AND dstchannel LIKE '%7271%';

UPDATE cdr SET lastdata = 'sdr_n2,rthHk,,,45'
WHERE lastdata LIKE 'crm%'
AND dstchannel LIKE '%7265%';

UPDATE cdr SET lastdata = 'sdr_n2,rthHk,,,45'
WHERE lastdata LIKE 'crm%'
AND dstchannel LIKE '%7277%';



SELECT calldate, src, dst, dstchannel FROM cdr WHERE
CASE 
WHEN dstchannel SIMILAR TO '%@%' = False THEN 
  REPLACE(
    SUBSTRING(
      dstchannel, POSITION('/' in dstchannel) + 1,
        POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
      )
    , '-', ''
  )
ELSE
  REPLACE(
    SUBSTRING(
      dstchannel, POSITION('/' in dstchannel) + 1,
        (POSITION('@' in dstchannel) - POSITION('/' in dstchannel)) - 1
      )
    , '-', ''
  )
END
IN (SELECT id FROM ps_endpoints WHERE named_call_group LIKE '%isr_n1%');
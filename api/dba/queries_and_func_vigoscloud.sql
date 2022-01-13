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

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--- 1- Function GET CALLS TO REPORT TABLE RECEIVED ---
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
    "total_time_calls" text,
    "average_time_calls" text,
    "answered_calls" bigint,
    "no_answer_calls" bigint,
    "busy_calls" bigint,
    "average_queue_calls" text,
    "transshipment_calls" bigint
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
        TO_CHAR((SUM(DISTINCT(duration)) || ' second')::interval, 'HH24:MI:SS') AS total_time_calls,
        TO_CHAR((AVG(DISTINCT(duration)) || ' second')::interval, 'HH24:MI:SS') AS average_time_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS answered_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr AS a
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND a.uniqueid
          NOT IN (SELECT uniqueid FROM cdr
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
          ) AS no_answer_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND  disposition LIKE 'BUSY' AND typecall = 'Recebida'
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS busy_calls,
        (SELECT TO_CHAR((AVG(duration - billsec) || ' second')::interval, 'HH24:MI:SS') FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS average_queue_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND lastdata LIKE '%transb%' AND typecall = 'Recebida'
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
          ) AS transshipment_calls
      FROM cdr
      WHERE (calldate BETWEEN data_inicial AND data_final)
      AND typecall = 'Recebida'
      AND lastdata LIKE '%' || recSector || '%'
      AND dstchannel LIKE '%' || endpoint || '%'
      AND src LIKE '%' || telNumber || '%'
      AND callprotocol LIKE '%' || protocol || '%';
    END;
  $$;

DROP FUNCTION get_data_report_received(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
);

SELECT * FROM  "get_data_report_received"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
SELECT * FROM  "get_data_report_received"('2022-01-05 00:00:00', '2022-01-30 23:59:59', 'suporte', '', '', '');
SELECT * FROM  "get_data_report_received"('2022-01-05 00:00:00', '2022-01-30 23:59:59', '', '4104', '', '');
SELECT * FROM  "get_data_report_received"('2022-01-05 00:00:00', '2022-01-30 23:59:59', '', '', '1430420844', '');
SELECT * FROM  "get_data_report_received"('2022-01-05 00:00:00', '2022-01-30 23:59:59', '', '', '', '202201061503397');

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--- 2- Function GET CALLS TO REPORT TABLE SENT ---
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
    "total_time_calls" text,
    "average_time_calls" text,
    "answered_calls" bigint,
    "no_answer_calls" bigint,
    "busy_calls" bigint,
    "failed_calls" bigint
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
        TO_CHAR((SUM(DISTINCT(duration)) || ' second')::interval, 'HH24:MI:SS') AS total_time_calls,
        TO_CHAR((AVG(DISTINCT(duration)) || ' second')::interval, 'HH24:MI:SS') AS average_time_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND typecall = 'Efetuada' AND dstchannel <> '' AND disposition LIKE 'ANSWERED'
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS answered_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr AS a
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND a.uniqueid NOT IN (SELECT uniqueid FROM cdr 
            WHERE (calldate BETWEEN data_inicial AND data_final)
            AND disposition LIKE 'ANSWERED'
            AND typecall = 'Efetuada' AND dstchannel <> ''
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%')
          AND disposition LIKE 'NO ANSWER' AND typecall = 'Efetuada'
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS no_answer_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND  disposition LIKE 'BUSY'
          AND typecall = 'Efetuada'
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS busy_calls,
        (SELECT COUNT(DISTINCT(uniqueid)) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND  disposition LIKE 'FAILED' AND typecall = 'Efetuada'
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS failed_calls
      FROM cdr
        WHERE (calldate BETWEEN data_inicial AND data_final)
        AND typecall = 'Efetuada' AND dstchannel <> ''
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%';
    END;
  $$;

DROP FUNCTION get_data_report_sent(
  dateInitial timestamp,
  dateEnd timestamp,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
  );

SELECT * FROM  "get_data_report_sent"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
SELECT * FROM  "get_data_report_sent"('2022-01-05 00:00:00', '2022-01-30 23:59:59', '', '4104', '', '');
SELECT * FROM  "get_data_report_sent"('2022-01-05 00:00:00', '2022-01-30 23:59:59', '', '', '1430420844', '');
SELECT * FROM  "get_data_report_sent"('2022-01-05 00:00:00', '2022-01-30 23:59:59', '', '', '', '202201061503397');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 3- Function Get Endpoints as Volume Calls Received ANSWERED --
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
        REPLACE(
          SUBSTRING(
            dstchannel, POSITION('/' in dstchannel) + 1,
              POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
            )
          , '-', ''
        ) AS endpoints, COUNT(*) FROM cdr
      WHERE (calldate BETWEEN data_inicial AND data_final)
      AND typecall = 'Recebida' AND dstchannel <> '' AND disposition = 'ANSWERED'
      AND lastdata LIKE '%' || recSector || '%'
      AND dstchannel LIKE '%' || endpoint || '%'
      AND src LIKE '%' || telNumber || '%'
      AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY endpoints
      ORDER BY endpoints;
    END;
  $$;


DROP FUNCTION get_vol_endp_rec_aswered(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
);

SELECT * FROM  "get_vol_endp_rec_aswered"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 4- Function Get Endpoints as Volume Calls Received NO ANSWER--
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
      AND a.uniqueid NOT IN (SELECT uniqueid FROM cdr WHERE (calldate BETWEEN data_inicial AND data_final) AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida')
      AND typecall = 'Recebida' AND disposition = 'NO ANSWER'
      AND lastdata LIKE '%' || recSector || '%'
      AND dstchannel LIKE '%' || endpoint || '%'
      AND src LIKE '%' || telNumber || '%'
      AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY endpoints
      ORDER BY endpoints;
    END;
  $$;

DROP FUNCTION get_vol_endp_rec_no_aswer(
  dateInitial timestamp,
  dateEnd timestamp,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
);

SELECT * FROM  "get_vol_endp_rec_no_aswer"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 5- Function Get Endpoints as Volume Calls Sent ANSWERED--
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
      SELECT src AS endpoints, COUNT(*) FROM cdr
        WHERE (calldate BETWEEN data_inicial AND data_final)
        AND typecall = 'Efetuada' AND dstchannel <> '' AND disposition = 'ANSWERED'
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY endpoints
      ORDER BY endpoints;
    END;
  $$;

DROP FUNCTION get_vol_sent_endp_answered(
  dateInitial timestamp,
  dateEnd timestamp,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
);
SELECT * FROM  "get_vol_sent_endp_answered"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 6- Function Get Endpoints as Volume Calls Sent NO ANSWER --
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
      SELECT src AS endpoints, COUNT(*) FROM cdr AS a
      WHERE (calldate BETWEEN data_inicial AND data_final)
        AND a.uniqueid NOT IN (SELECT uniqueid FROM cdr WHERE (calldate BETWEEN data_inicial AND data_final) AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida')
        AND typecall = 'Efetuada' AND disposition = 'NO ANSWER'
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY endpoints
      ORDER BY endpoints;
    END;
  $$;

DROP FUNCTION get_vol_sent_endp_no_answer(
  dateInitial timestamp,
  dateEnd timestamp,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
);
SELECT * FROM  "get_vol_sent_endp_no_answer"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 7- Function Get Volume Calls Sent Internal and External --
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
        (SELECT COUNT(lastapp) AS externas FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND typecall = 'Efetuada' AND dstchannel <> '' AND lastdata LIKE '%@%' --AND disposition = 'ANSWERED'
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS externas,
        (SELECT COUNT(lastapp) internas FROM cdr AS a
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND typecall = 'Efetuada' AND CHAR_LENGTH(a.src) > 3 AND dstchannel <> '' -- AND disposition = 'ANSWERED'
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
          AND a.lastdata NOT IN (SELECT lastdata FROM cdr WHERE lastdata LIKE '%@%')
        ) AS internas;
    END;
  $$;

DROP FUNCTION get_volume_sent_external_and_external(
  dateInitial timestamp,
  dateEnd timestamp,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
);

SELECT * FROM  "get_volume_sent_external_and_external"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 8- Function Get Volume Calls Received and Answered By Sector --
-- SUBSTRING(lastdata, 0, CHAR_LENGTH(lastdata) - 9)
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
      SELECT SUBSTRING(lastdata, 0, POSITION(',' in lastdata)) AS sectors, COUNT(*) as answered FROM cdr
      WHERE (calldate BETWEEN data_inicial AND data_final)
      AND typecall = 'Recebida' AND lastapp = 'Queue' AND dstchannel <> '' AND disposition = 'ANSWERED'
      AND lastdata LIKE '%' || recSector || '%'
      AND dstchannel LIKE '%' || endpoint || '%'
      AND src LIKE '%' || telNumber || '%'
      AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY sectors
      ORDER BY sectors;
    END;
  $$;

DROP FUNCTION get_vol_sec_rec(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
);

SELECT * FROM  "get_vol_sec_rec"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 9- Function Get Volume Calls Received and Not Answered By Sector --
-- SUBSTRING(lastdata, 0, CHAR_LENGTH(lastdata) - 9)
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
      SELECT SUBSTRING(lastdata, 0, POSITION(',' in lastdata)) AS sectors_not_atennd, COUNT(*) AS no_answer FROM cdr AS a
        WHERE (calldate BETWEEN data_inicial AND data_final)
        AND a.uniqueid NOT IN (SELECT uniqueid FROM cdr WHERE (calldate BETWEEN data_inicial AND data_final) AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida')
        AND disposition LIKE 'NO ANSWER' AND typecall = 'Recebida' AND lastapp = 'Queue'
        AND lastdata LIKE '%' || recSector || '%'
        AND dstchannel LIKE '%' || endpoint || '%'
        AND src LIKE '%' || telNumber || '%'
        AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY sectors_not_atennd
      ORDER BY sectors_not_atennd;
    END;
  $$;

DROP FUNCTION get_vol_sec_no_ans(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
);

SELECT * FROM  "get_vol_sec_no_ans"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 10- Function Get Volume Calls Received By Hour --
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

DROP FUNCTION get_vol_rec_answ_by_hour(
  dateInitial timestamp,
  dateEnd timestamp,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
 );

SELECT * FROM  "get_vol_rec_answ_by_hour"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 11- Function Get Volume Calls Received By Hour --
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
      return QUERY
        SELECT
          EXTRACT(HOUR FROM calldate) AS hours_calls, 0 AS answered, COUNT(DISTINCT(uniqueid)) AS no_answer 
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

DROP FUNCTION get_vol_rec_no_answ_by_hour(
  dateInitial timestamp,
  dateEnd timestamp,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
);

SELECT * FROM  "get_vol_rec_no_answ_by_hour"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 12- Function Get Volume Calls Received Global --
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
          AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
        AND lastdata LIKE '%' || recSector || '%'
        AND dstchannel LIKE '%' || endpoint || '%'
        AND src LIKE '%' || telNumber || '%'
        AND callprotocol LIKE '%' || protocol || '%') AS answered,
        (SELECT
          COUNT(DISTINCT(uniqueid))
        FROM cdr AS a
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND a.uniqueid NOT IN (
            SELECT uniqueid FROM cdr
            WHERE (calldate BETWEEN dateInitial
            AND dateEnd) AND disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
          )
          AND disposition LIKE 'NO ANSWER' AND typecall = 'Recebida'
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%') AS no_answer;
    END;
  $$;

DROP FUNCTION get_vol_rec_answered_and_no_answer_global(
  dateInitial timestamp,
  dateEnd timestamp,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
  );

SELECT * FROM  "get_vol_rec_answered_and_no_answer_global"('2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 11- Function Get Rows All Calls --
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
          ELSE ''
        END
        AS setor,
        billsec AS aguardando_atendimento,
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
        hangupcause AS encerramento
      FROM cdr 
        WHERE (calldate BETWEEN data_inicial AND data_final)
        AND lastdata LIKE '%' || recSector || '%'
        AND dstchannel LIKE '%' || endpoint || '%'
        AND src LIKE '%' || telNumber || '%'
        AND callprotocol LIKE '%' || protocol || '%'
        AND disposition LIKE '%' || statusCall || '%'
      ORDER BY data DESC, sequencia ASC
      LIMIT limitGet OFFSET offsetGet;
    END;
  $$;

DROP FUNCTION get_all_calls_rows(
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30),
  disposition character varying(30),
  limitGet integer,
  offsetGet integer
);

SELECT * FROM get_all_calls_rows('2022-01-12', '2022-01-12', '00:00:00', '23:59:59', '', '', '', '', '', '30', '0');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- 13- Function Get All Data Report --
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
  dateInitial date,
  dateEnd date,
  hourInitial time,
  hourEnd time,
  recSector character varying(30),
  endpoint character varying(30),
  telNumber character varying(30),
  protocol character varying(30)
)

BEGIN;
    SELECT get_itens_report('Ref1', 'Ref2', 'Ref3', 'Ref4', 'Ref5', 'Ref6', 'Ref7', 'Ref8', 'Ref9', 'Ref10', 'Ref11', 'Ref12', '2022-01-05', '2022-01-30', '00:00:00', '23:59:59', '', '', '', '');
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
-- WORKING --

SELECT
REPLACE(
  SUBSTRING(
    dstchannel, POSITION('/' in dstchannel) + 1,
      POSITION('-' in dstchannel) - POSITION('/' in dstchannel)
    )
  , '-', ''
) AS endpoints
SELECT
  (SELECT
    COUNT(DISTINCT(uniqueid)) FROM cdr
    WHERE disposition LIKE 'ANSWERED' AND typecall = 'Recebida') AS answered,
  (SELECT
    COUNT(DISTINCT(uniqueid))
  FROM cdr AS a
    WHERE a.uniqueid NOT IN (
      SELECT uniqueid FROM cdr
      WHERE disposition LIKE 'ANSWERED' AND typecall = 'Recebida'
    )
    AND disposition LIKE 'NO ANSWER' AND typecall = 'Recebida') AS no_answer;

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


------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


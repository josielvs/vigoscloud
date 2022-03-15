--- FUNCTIONS REPORT
--- 1- Function GET CALLS TO REPORT TABLE RECEIVED ---
DROP FUNCTION get_data_report_received
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

-- 6- Function Get Endpoints as Volume Calls Sent NO ANSWER --
DROP FUNCTION get_vol_sent_endp_no_answer
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
        -- AND typecall = 'Efetuada' AND disposition = 'NO ANSWER' AND char_length(dst) > 4
        AND disposition = 'NO ANSWER' AND char_length(dst) > 4
        AND src LIKE '%' || endpoint || '%'
        AND dst LIKE '%' || telNumber || '%'
        AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY endpoints
      ORDER BY endpoints;
    END;
  $$;

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
          AND typecall = 'Efetuada' AND dstchannel <> '' AND lastdata LIKE '%@%' --AND disposition = 'ANSWERED'
          AND src LIKE '%' || endpoint || '%'
          AND dst LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        ) AS externas,
        (SELECT COUNT(DISTINCT(uniqueid)) internas FROM cdr AS a
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND typecall = 'Efetuada' AND CHAR_LENGTH(a.src) > 3 AND dstchannel <> '' -- AND disposition = 'ANSWERED'
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
      AND lastapp = 'Queue' AND disposition = 'ANSWERED'
      AND lastdata LIKE '%' || recSector || '%'
      AND dstchannel LIKE '%' || endpoint || '%'
      AND src LIKE '%' || telNumber || '%'
      AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY sectors
      ORDER BY sectors;
    END;
  $$;

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
          SELECT DISTINCT(uniqueid) FROM cdr
          WHERE (calldate BETWEEN data_inicial AND data_final)
          AND disposition LIKE 'ANSWERED'
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%'
        )
        AND disposition LIKE 'NO ANSWER' AND lastapp = 'Queue' AND typecall = 'Recebida'
        AND lastdata LIKE '%' || recSector || '%'
        AND dstchannel LIKE '%' || endpoint || '%'
        AND src LIKE '%' || telNumber || '%'
        AND callprotocol LIKE '%' || protocol || '%'
      GROUP BY sectors_not_atennd
      ORDER BY sectors_not_atennd;
    END;
  $$;

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
        AND dstchannel LIKE '%' || endpoint || '%'
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
            AND dstchannel LIKE '%' || endpoint || '%'
            AND src LIKE '%' || telNumber || '%'
            AND callprotocol LIKE '%' || protocol || '%'
          )
          AND disposition LIKE 'NO ANSWER' AND lastapp = 'Queue'
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%') AS no_answer;
    END;
  $$;

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
        AND dstchannel LIKE '%' || endpoint || '%'
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
            AND dstchannel LIKE '%' || endpoint || '%'
            AND src LIKE '%' || telNumber || '%'
            AND callprotocol LIKE '%' || protocol || '%'
          )
          AND disposition LIKE 'NO ANSWER' AND lastapp = 'Queue'
          AND lastdata LIKE '%' || recSector || '%'
          AND dstchannel LIKE '%' || endpoint || '%'
          AND src LIKE '%' || telNumber || '%'
          AND callprotocol LIKE '%' || protocol || '%') AS no_answer;
    END;
  $$;

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
              AND disposition LIKE 'ANSWERED'
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
      ORDER BY uniqueid ASC
      LIMIT limitGet OFFSET offsetGet;
    END;
  $$;

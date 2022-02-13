  1 | Vigos   | adm@vigossolucoes.com.br     | $2a$05$A1Xso4kAVGLXxpJj1oAIxO5o4JR.PA0OdBKqZTwra10JQ62FCirj. | 7000     | admin | t
  2 | Api     | api@vigossolucoes.com.br     | $2a$05$jbclBshzhwZhCyMgjbTcfOoeiOrGSv1Hyp6XIHZavat2.O8EnMARC | 7000     | api   | t
  3 | User    | user@vigossolucoes.com.br    | $2a$05$t77fhcB.jNZLLiYys6.aFuI5dZ07kTa/uTuF9cuIMK.TeyFfCp5Za | 7000     | user  | t
  4 | Gustavo | gustavo@vigossolucoes.com.br | $2a$05$jbclBshzhwZhCyMgjbTcfOoeiOrGSv1Hyp6XIHZavat2.O8EnMARC | 4108     | admin | t
  5 | Victor  | victor@vigossolucoes.com.br  | $2a$05$ABJrNY5NXVQzgoMqenBlBuScfsCeFPtDxFp1qtyy8ovnJeluZqq4m | 4109     | admin | t

INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('Vigos', 'adm@vigossolucoes.com.br', '$2a$05$A1Xso4kAVGLXxpJj1oAIxO5o4JR.PA0OdBKqZTwra10JQ62FCirj.', '2000', 'admin', 'true');
INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('User', 'user@vigossolucoes.com.br', '$2a$05$t77fhcB.jNZLLiYys6.aFuI5dZ07kTa/uTuF9cuIMK.TeyFfCp5Za', '9900', 'user', 'true');
INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('Support', 'support@vigossolucoes.com.br', '$2a$05$jbclBshzhwZhCyMgjbTcfOoeiOrGSv1Hyp6XIHZavat2.O8EnMARC', '9900', 'tecnical', 'true');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--############-- WEB PHONE --############--
INSERT INTO ps_aors (id, max_contacts, qualify_frequency, remove_existing) VALUES (1000, 1, 120, 'yes');
INSERT INTO ps_auths (id, auth_type, password, username) VALUES (1000, 'userpass', '!vigos!!interface#01!', 1000);
INSERT INTO ps_endpoints (id, transport, aors, auth, context, callerid, language, allow, webrtc, use_avpf, media_encryption, dtls_verify, dtls_setup, ice_support, media_use_received_transport, rtcp_mux, dtls_cert_file, dtls_private_key, dtls_ca_file)
  VALUES
(1000, 'wss_transport', 1000, 1000, 'from-extensions', '1000 <1000>', 'pt_BR', 'opus,ulaw,vp9,vp8,h264', 'yes', 'yes', 'dtls', 'fingerprint', 'actpass', 'yes', 'yes', 'yes', '/home/vjpbx/certificates/certs/vigoscloud.crt', '/home/vjpbx/certificates/certs/vigoscloud.key', '/home/vjpbx/certificates/ca/vigoscloud-Root-CA.crt');
--############################################--

--############-- SIP PHONE --############--
INSERT INTO ps_aors (id, max_contacts, qualify_frequency, remove_existing) VALUES (1001, 1, 120, 'yes');
INSERT INTO ps_auths (id, auth_type, password, username) VALUES (1001, 'userpass', '!vigos!!interface#01!', 1001);
INSERT INTO ps_endpoints (id, transport, aors, auth, context, callerid, language, inband_progress, rtp_timeout, message_context, allow_subscribe, subscribe_context, direct_media, dtmf_mode, device_state_busy_at, disallow, allow)
  VALUES
(1001, 'udp_transport', 1001, 1001, 'from-extensions', '1001 <1001>', 'pt_BR', 'no', 120, 'textmessages', 'yes', 'subscriptions', 'no', 'info', 1, 'all', 'ulaw');
--############################################--

--############-- PROVIDER TRUNK IP --############--
INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES (32018500, 'sip:32018500@172.26.159.65:5060', 120);
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, from_domain, from_user, direct_media, "100rel", language, tos_audio, cos_audio)
  VALUES
(32018500, 'udp_transport', 'Algar', 'all', 'alaw', '32018500', '10.55.216.217', '32018500', 'no', 'yes', 'pt_BR', 'af42', 3);
INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, transport, endpoint, line)
VALUES
(32018500, 'sip:172.26.159.65:5060', 'sip:32018500@10.55.216.217:5060', '32018500', 'udp_transport', '32018500', 'yes');
INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES (32018500, '32018500', '172.26.159.65');
--############################################--

--##########-- PROVIDER TRUNK AUTH --#########--
INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES (KZBRI, 'sip:KZBRI@189.84.133.135:5060', 120);
INSERT INTO ps_auths (id, auth_type, password, username) VALUES (KZBRI, 'userpass', 'QX1hzIP2YN2fov9w', KZBRI);
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, from_domain, direct_media, language, tos_audio, cos_audio)
  VALUES
(KZBRI, 'udp_transport', 'DirectCall', 'all', 'ulaw,alaw', KZBRI, '189.84.133.135', 'no', 'pt_BR', 'af42', 3);
INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, transport) VALUES (KZBRI, 'sip:189.84.133.135', 'sip:KZBRI@189.84.133.135', 'KZBRI', 'udp_transport');
INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES (KZBRI, 'KZBRI', '189.84.133.135');
--############################################--

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION endpointsSipGenerate(
  initEndpoint integer,
  qttEndpoints integer
)
RETURNS boolean 
AS
$$
DECLARE
  i integer = (initEndpoint + qttEndpoints) - 1;
BEGIN
  IF initEndpoint > 0 THEN
    FOR endpoint in initEndpoint .. i LOOP
      INSERT INTO ps_aors (id, max_contacts, qualify_frequency, remove_existing) VALUES (endpoint, 1, 120, 'yes');
      INSERT INTO ps_auths (id, auth_type, password, username) VALUES (endpoint, 'userpass', '!vigos!!interface#01!', endpoint);
      INSERT INTO ps_endpoints (id, transport, aors, auth, context, callerid, language, inband_progress, rtp_timeout, message_context, allow_subscribe, subscribe_context, direct_media, dtmf_mode, device_state_busy_at, disallow, allow)
      VALUES
      (endpoint, 'udp_transport', endpoint, endpoint, 'ddd-celular', CONCAT(endpoint, ' ', '<', endpoint, '>'), 'pt_BR', 'no', 120, 'textmessages', 'yes', 'subscriptions', 'no', 'info', 1, 'all', 'ulaw');
    END LOOP;
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION endpointsSipGenerate;

SELECT endpointsSipGenerate(7200, 50);
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION endpointsWebGenerate(
  initEndpoint integer,
  qttEndpoints integer
)
RETURNS boolean 
AS
$$
DECLARE
  i integer = (initEndpoint + qttEndpoints) - 1;
BEGIN
  IF initEndpoint > 0 THEN
    FOR endpoint in initEndpoint .. i LOOP
      INSERT INTO ps_aors (id, max_contacts, qualify_frequency, remove_existing) VALUES (endpoint, 1, 120, 'yes');
      INSERT INTO ps_auths (id, auth_type, password, username) VALUES (endpoint, 'userpass', '!vigos!!interface#01!', endpoint);
      INSERT INTO ps_endpoints (id, transport, aors, auth, context, callerid, language, allow, webrtc, use_avpf, media_encryption, dtls_verify, dtls_setup, ice_support, media_use_received_transport, rtcp_mux, dtls_cert_file, dtls_private_key, dtls_ca_file)
      VALUES
      (endpoint, 'wss_transport', endpoint, endpoint, 'from-extensions', CONCAT(endpoint, ' ', '<', endpoint, '>'), 'pt_BR', 'opus,ulaw,vp9,vp8,h264', 'yes', 'yes', 'dtls', 'fingerprint', 'actpass', 'yes', 'yes', 'yes', '/home/vjpbx/certificates/certs/vigoscloud.crt', '/home/vjpbx/certificates/certs/vigoscloud.key', '/home/vjpbx/certificates/ca/vigoscloud-Root-CA.crt');
    END LOOP;
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION endpointsWebGenerate;

SELECT endpointsWebGenerate(7250, 500);
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Queues Generate
name VARCHAR(128) NOT NULL, 
musiconhold VARCHAR(128), 
announce VARCHAR(128), 
context VARCHAR(128), 
timeout INTEGER, 
ringinuse yesno_values, 
setinterfacevar yesno_values, 
setqueuevar yesno_values, 
setqueueentryvar yesno_values, 
monitor_format VARCHAR(8), 
membermacro VARCHAR(512), 
membergosub VARCHAR(512), 
queue_youarenext VARCHAR(128), 
queue_thereare VARCHAR(128), 
queue_callswaiting VARCHAR(128), 
queue_quantity1 VARCHAR(128), 
queue_quantity2 VARCHAR(128), 
queue_holdtime VARCHAR(128), 
queue_minutes VARCHAR(128), 
queue_minute VARCHAR(128), 
queue_seconds VARCHAR(128), 
queue_thankyou VARCHAR(128), 
queue_callerannounce VARCHAR(128), 
queue_reporthold VARCHAR(128), 
announce_frequency INTEGER, 
announce_to_first_user yesno_values, 
min_announce_frequency INTEGER, 
announce_round_seconds INTEGER, 
announce_holdtime VARCHAR(128), 
announce_position VARCHAR(128), 
announce_position_limit INTEGER, 
periodic_announce VARCHAR(50), 
periodic_announce_frequency INTEGER, 
relative_periodic_announce yesno_values, 
random_periodic_announce yesno_values, 
retry INTEGER, 
wrapuptime INTEGER, 
penaltymemberslimit INTEGER, 
autofill yesno_values, 
monitor_type VARCHAR(128), 
autopause queue_autopause_values, 
autopausedelay INTEGER, 
autopausebusy yesno_values, 
autopauseunavail yesno_values, 
maxlen INTEGER, 
servicelevel INTEGER, 
strategy queue_strategy_values, 
joinempty VARCHAR(128), 
leavewhenempty VARCHAR(128), 
reportholdtime yesno_values, 
memberdelay INTEGER, 
weight INTEGER, 
timeoutrestart yesno_values, 
defaultrule VARCHAR(128), 
timeoutpriority VARCHAR(128), 
PRIMARY KEY (name)

name VALUES VARCHAR(128)
strategy VALUES ('ringall', 'leastrecent', 'fewestcalls', 'random', 'rrmemory', 'linear', 'wrandom', 'rrordered');
autofill VALUES ('yes', 'no');
maxlen INTEGER (20);
ringinuse VALUES ('yes', 'no');
announce_position VALUES ('yes', 'no');
announce_frequency INTEGER (30);
announce_holdtime VALUES ('yes', 'no');
min_announce_frequency INTEGER (30);
setqueueentryvar VALUES ('yes', 'no');
wrapuptime INTEGER (4) 


INSERT INTO queues (name, strategy, autofill, maxlen, ringinuse, announce_position, announce_frequency, announce_holdtime, min_announce_frequency, setqueueentryvar, wrapuptime)
VALUES
('crm', 'ringall', 'yes', 20, 'no', 'yes', 30, 'yes', 30, 'yes', 4);

CREATE OR REPLACE FUNCTION queuesGenerate(
  nameQueue character varying(128)
)
RETURNS boolean 
AS
$$
BEGIN
  IF CHAR_LENGTH(nameQueue) > 0 THEN
    INSERT INTO queues (name, strategy, autofill, maxlen, ringinuse, announce_position, announce_frequency, announce_holdtime, min_announce_frequency, setqueueentryvar, wrapuptime)
      VALUES
    (nameQueue, 'ringall', 'yes', 20, 'no', 'yes', 30, 'yes', 30, 'yes', 4);
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION queuesGenerate;

SELECT queuesGenerate('fin');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    queue_name VARCHAR(80) NOT NULL, 
    interface VARCHAR(80) NOT NULL, 
    uniqueid VARCHAR(80) NOT NULL, 
    membername VARCHAR(80), 
    state_interface VARCHAR(80), 
    penalty INTEGER, 
    paused INTEGER, 
    PRIMARY KEY (queue_name, interface)


INSERT INTO queue_members (queue_name, interface) VALUES ('crm', 'PJSIP/7251', 1);

CREATE OR REPLACE FUNCTION queuesMembersGenerate(
  nameQueue character varying(128),
  initEndpoint integer,
  finalEndpoint integer
)
RETURNS boolean 
AS
$$
BEGIN
  IF initEndpoint > 0 THEN
    FOR endpoint in initEndpoint .. finalEndpoint LOOP
      INSERT INTO queue_members (queue_name, interface, uniqueid) VALUES (nameQueue, CONCAT('PJSIP/', endpoint), endpoint);
      -- raise notice 'Value: %', CONCAT('PJSIP/', endpoint);
    END LOOP;
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION queuesMembersGenerate;

SELECT queuesMembersGenerate('fin', 7251, 7400);

DELETE FROM ps_endpoints WHERE id='1431085999';


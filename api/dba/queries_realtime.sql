  1 | Vigos   | adm@vigossolucoes.com.br     | $2a$05$A1Xso4kAVGLXxpJj1oAIxO5o4JR.PA0OdBKqZTwra10JQ62FCirj. | 7000     | admin | t
  2 | Api     | api@vigossolucoes.com.br     | $2a$05$jbclBshzhwZhCyMgjbTcfOoeiOrGSv1Hyp6XIHZavat2.O8EnMARC | 7000     | api   | t
  3 | User    | user@vigossolucoes.com.br    | $2a$05$t77fhcB.jNZLLiYys6.aFuI5dZ07kTa/uTuF9cuIMK.TeyFfCp5Za | 7000     | user  | t
  4 | Gustavo | gustavo@vigossolucoes.com.br | $2a$05$jbclBshzhwZhCyMgjbTcfOoeiOrGSv1Hyp6XIHZavat2.O8EnMARC | 4108     | admin | t
  5 | Victor  | victor@vigossolucoes.com.br  | $2a$05$ABJrNY5NXVQzgoMqenBlBuScfsCeFPtDxFp1qtyy8ovnJeluZqq4m | 4109     | admin | t

INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('Vigos', 'adm@vigossolucoes.com.br', '$2a$05$A1Xso4kAVGLXxpJj1oAIxO5o4JR.PA0OdBKqZTwra10JQ62FCirj.', '2000', 'admin', 'true');
INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('User', 'user@vigossolucoes.com.br', '$2a$05$t77fhcB.jNZLLiYys6.aFuI5dZ07kTa/uTuF9cuIMK.TeyFfCp5Za', '9900', 'user', 'true');
INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('Support', 'support@vigossolucoes.com.br', '$2a$05$jbclBshzhwZhCyMgjbTcfOoeiOrGSv1Hyp6XIHZavat2.O8EnMARC', '9900', 'tecnical', 'true');
INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('Salete', 'salete@agrosolo.com.br', '$2a$05$vbjKbVzigocllTO2qvHZ6.qeZpM7bz1fwxz/W0rUt3xJlDzBY0GoG', '1152', 'admin', 'true');


------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--############-- WEB PHONE --############--
INSERT INTO ps_aors (id, max_contacts, qualify_frequency, remove_existing) VALUES (8701, 1, 120, 'yes');
INSERT INTO ps_auths (id, auth_type, password, username) VALUES (8701, 'userpass', '!vigos!!interface#01!', 8701);
INSERT INTO ps_endpoints (id, transport, aors, auth, context, callerid, language, allow, webrtc, use_avpf, media_encryption, dtls_verify, dtls_setup, ice_support, media_use_received_transport, rtcp_mux, dtls_cert_file, dtls_private_key, dtls_ca_file)
  VALUES
(8701, 'wss_transport', 8701, 8701, 'ddd-celular', '8701 <8701>', 'pt_BR', 'opus,ulaw,vp9,vp8,h264', 'yes', 'yes', 'dtls', 'fingerprint', 'actpass', 'yes', 'yes', 'yes', '/home/vjpbx/certificates/certs/vigoscloud.crt', '/home/vjpbx/certificates/certs/vigoscloud.key', '/home/vjpbx/certificates/ca/vigoscloud-Root-CA.crt');
--############################################--

--############-- SIP PHONE --############--
INSERT INTO ps_aors (id, max_contacts, qualify_frequency, remove_existing) VALUES (1001, 1, 120, 'yes');
INSERT INTO ps_auths (id, auth_type, password, username) VALUES (1001, 'userpass', '!vigos!!interface#01!', 1001);
INSERT INTO ps_endpoints (id, transport, aors, auth, context, callerid, language, inband_progress, rtp_timeout, message_context, allow_subscribe, subscribe_context, direct_media, dtmf_mode, device_state_busy_at, disallow, allow)
  VALUES
(1001, 'udp_transport', 1001, 1001, 'from-extensions', '1001 <1001>', 'pt_BR', 'no', 120, 'textmessages', 'yes', 'subscriptions', 'no', 'info', 1, 'all', 'ulaw');
--############################################--

--############-- PROVIDER TRUNK IP --############--
INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES (1421045555, 'sip:1421045555@189.52.73.116:5060', 120);
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, from_domain, from_user, direct_media, language, tos_audio, cos_audio)
  VALUES
(1421045555, 'udp_transport', 'Embratel', 'all', 'alaw', '1421045555', '200.191.211.54', '1421045555', 'no', 'pt_BR', 'af42', 3);
INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, transport, endpoint, line)
VALUES
(1421045555, 'sip:189.52.73.116:5060', 'sip:1421045555@200.191.211.54:5060', '1421045555', 'udp_transport', '1421045555', 'yes');
INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES (1421045555, '1421045555', '189.52.73.116');
--############################################--

--##########-- PROVIDER TRUNK AUTH --#########--
INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES (32838070, 'sip:32838070@192.168.2.240:5060', 120);
INSERT INTO ps_auths (id, auth_type, password, username) VALUES (32838070, 'userpass', '32838070', '32838070');
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, direct_media, language, tos_audio, cos_audio, outbound_auth)
  VALUES
(32838070, 'udp_transport', 'VIVO', 'all', 'ulaw', '32838070', 'no', 'pt_BR', 'af42', 3, '32838070');
INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, transport, endpoint, line)
  VALUES
(32838070, 'sip:192.168.2.240:5060', 'sip:32838070@192.168.2.240:5060', '32838070', 'udp_transport', '32838070', 'yes');
INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES (32838070, '32838070', '192.168.2.240');
--############################################--

INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES (32838070, 'sip:32838070@192.168.2.240:5060', 120);
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, from_domain, from_user, direct_media, language, tos_audio, cos_audio)
  VALUES
(32838070, 'udp_transport', 'Embratel', 'all', 'alaw', '32838070', '192.168.2.241', '32838070', 'no', 'pt_BR', 'af42', 3);
INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, transport, endpoint, line)
VALUES
(32838070, 'sip:192.168.2.240:5060', 'sip:32838070@192.168.2.241:5060', '32838070', 'udp_transport', '32838070', 'yes');
INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES (32838070, '32838070', '192.168.2.240');

TRUNCATE TABLE ps_aors;
TRUNCATE TABLE ps_auths;
TRUNCATE TABLE ps_endpoints;
TRUNCATE TABLE ps_registrations;
TRUNCATE TABLE ps_endpoint_id_ips;

[DirectCall]
type=endpoint
language=pt_BR
transport=udp_transport
context=DirectCall
direct_media=no
disallow=all
allow=ulaw
outbound_auth=DirectCall
aors=DirectCall

[DirectCall]
type=aor
contact=sip:189.84.133.135

[DirectCall]
type=auth
auth_type=userpass
username=KZBRI
password=QX1hzIP2YN2fov9w

[DirectCall]
type=registration
outbound_auth=DirectCall
server_uri=sip:189.84.133.135
client_uri=sip:KZBRI@189.84.133.135
contact_user=KZBRI

[DirectCall]
type=identify
endpoint=DirectCall
match=189.84.133.135


;--
[VIVO]
type=aor
contact=sip:172.16.0.60:5060

[VIVO]
type=auth
auth_type=userpass
username=30102000
password=30102000

[VIVO]
type=endpoint
transport=udp_transport
context=VIVO
direct_media=no
disallow=all
allow=ulaw
outbound_auth=VIVO
aors=VIVO

[VIVO]
type=registration
outbound_auth=VIVO
server_uri=sip:172.16.0.60:5060
client_uri=sip:30102000@172.16.0.60:5060
contact_user=30102000

[VIVO]
type=identify
endpoint=VIVO
match=172.16.0.60
--;

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

  SELECT endpointsSipGenerate(7670, 1);
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
named_call_group VARCHAR(40), 
named_pickup_group VARCHAR(40), 

UPDATE ps_endpoints SET named_call_group = 'crm', named_pickup_group = 'crm' WHERE id = ''

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

  SELECT endpointsWebGenerate(8050, 50);
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

  SELECT queuesGenerate('recepcao');
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

SELECT queuesMembersGenerate('recepcao', 5550);





DELETE FROM ps_endpoints WHERE id='1431085999';

DELETE FROM queue_members WHERE queue_name = 'sac';

UPDATE queue_members SET paused = 1 WHERE queue_name = 'sac';

UPDATE queue_members SET paused = 0 WHERE uniqueid = '7472';


INSERT INTO queue_members (queue_name, interface, uniqueid) VALUES ('recepcao', CONCAT('PJSIP/', '5539'), '5539');
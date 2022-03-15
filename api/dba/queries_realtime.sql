  1 | Vigos   | adm@vigossolucoes.com.br     | $2a$05$A1Xso4kAVGLXxpJj1oAIxO5o4JR.PA0OdBKqZTwra10JQ62FCirj. | 7000     | admin | t
  2 | Api     | api@vigossolucoes.com.br     | $2a$05$jbclBshzhwZhCyMgjbTcfOoeiOrGSv1Hyp6XIHZavat2.O8EnMARC | 7000     | api   | t
  3 | User    | user@vigossolucoes.com.br    | $2a$05$t77fhcB.jNZLLiYys6.aFuI5dZ07kTa/uTuF9cuIMK.TeyFfCp5Za | 7000     | user  | t
  4 | Gustavo | gustavo@vigossolucoes.com.br | $2a$05$jbclBshzhwZhCyMgjbTcfOoeiOrGSv1Hyp6XIHZavat2.O8EnMARC | 4108     | admin | t
  5 | Victor  | victor@vigossolucoes.com.br  | $2a$05$ABJrNY5NXVQzgoMqenBlBuScfsCeFPtDxFp1qtyy8ovnJeluZqq4m | 4109     | admin | t

INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('Vigos', 'adm@vigossolucoes.com.br', '$2a$05$A1Xso4kAVGLXxpJj1oAIxO5o4JR.PA0OdBKqZTwra10JQ62FCirj.', '2000', 'admin', 'true');
INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('User', 'user@vigossolucoes.com.br', '$2a$05$t77fhcB.jNZLLiYys6.aFuI5dZ07kTa/uTuF9cuIMK.TeyFfCp5Za', '9900', 'user', 'true');
INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('Support', 'support@vigossolucoes.com.br', '$2a$05$jbclBshzhwZhCyMgjbTcfOoeiOrGSv1Hyp6XIHZavat2.O8EnMARC', '9900', 'tecnical', 'true');
INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('Salete', 'salete@agrosolo.com.br', '$2a$05$vbjKbVzigocllTO2qvHZ6.qeZpM7bz1fwxz/W0rUt3xJlDzBY0GoG', '1152', 'admin', 'true');

INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('Recepcao', 'recepcaomonsenhor@magna.med.br', '$2a$05$I69z7Eqhu8zoPBFYIbqgmew6AObLz2QolP0BbInR4shLU26HG/OBm', '2500', 'user', 'true');
INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('Recepcao', 'recepcaohb@magna.med.br', '$2a$05$IRMSFDUgHg0bqfktB7Jj3.ki/02gBBpzUr7Kai3VkVD29yU0eluZ2', '2600', 'user', 'true');
INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('Recepcao', 'recepcaoaeroporto@magna.med.br', '$2a$05$IRMSFDUgHg0bqfktB7Jj3.il3LjkjrSo/RSCOF6576bcrygrXA4BC', '2300', 'user', 'true');
INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('Recepcao', 'recepcaocomendador@magna.med.br', '$2a$05$YWvEiOQpSd5amcr41tKVeO3eIhRItF0GEb/M8XegZ8u.Q/gQ/7Lci', '2300', 'user', 'true');

TRUNCATE TABLE ps_aors;
TRUNCATE TABLE ps_auths;
TRUNCATE TABLE ps_endpoints;
TRUNCATE TABLE ps_registrations;
TRUNCATE TABLE ps_endpoint_id_ips;

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

--############-- PROVIDER TRUNK IP - NUMBER --############--
INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES (1432352500, 'sip:1432352500@172.26.156.70:5060', 120);
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, from_domain, from_user, direct_media, language, tos_audio, cos_audio)
  VALUES
(1432352500, 'udp_transport', 'Algar-Monsenhor', 'all', 'alaw', '1432352500', '10.61.32.165', '1432352500', 'no', 'pt_BR', 'af42', 3);
INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, transport, endpoint, line)
VALUES
(1432352500, 'sip:172.26.156.70:5060', 'sip:1432352500@10.61.32.165:5060', '1432352500', 'udp_transport', '1432352500', 'yes');
INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES (1432352500, '1432352500', '172.26.156.70');
--#########################################################--

--############-- PROVIDER TRUNK IP - NAMED --############--
INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES ('Embratel', 'sip:21061500@189.52.73.116:5060', 120);
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, from_domain, from_user, direct_media, language, tos_audio, cos_audio)
  VALUES
('Embratel', 'udp_transport', 'Embratel', 'all', 'alaw', 'Embratel', '189.2.25.170', '21061500', 'no', 'pt_BR', 'af42', 3);
INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, transport, endpoint, line)
VALUES
('Embratel', 'sip:189.52.73.116:5060', 'sip:21061500@189.2.25.170:5060', '21061500', 'udp_transport', 'Embratel', 'yes');
INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES ('Embratel', 'Embratel', '189.52.73.116');
--########################################################--

--##########-- PROVIDER TRUNK AUTH - NUMBER --#########--
INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES (21061500, 'sip:0537@131.196.224.6:5060', 120);
INSERT INTO ps_auths (id, auth_type, password, username) VALUES (21061500, 'userpass', '2l1@mVcXe37u8i', '0537');
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, direct_media, language, tos_audio, cos_audio, outbound_auth)
  VALUES
(21061500, 'udp_transport', 'NOVA', 'all', 'ulaw', '21061500', 'no', 'pt_BR', 'af42', 3, '21061500');
INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, transport, endpoint)
  VALUES
(21061500, 'sip:0537@131.196.224.6:5060', 'sip:0537@131.196.224.6:5060', '0537', 'udp_transport', '21061500');
INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES (21061500, '21061500', '131.196.224.6');
--#####################################################--

--############-- PROVIDER TRUNK AUTH - NAMED --###########--
INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES ('NOVA', 'sip:131.196.224.6:5060', 120);
INSERT INTO ps_auths (id, auth_type, username, password) VALUES ('NOVA', 'userpass', '0537', '2l1@mVcXe37u8i');
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, direct_media, language, outbound_auth)
  VALUES
('NOVA', 'udp_transport', 'NOVA', 'all', 'ulaw', 'NOVA', 'no', 'pt_BR', 'NOVA');
INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, outbound_auth)
  VALUES
('NOVA', 'sip:0537@131.196.224.6:5060', 'sip:0537@131.196.224.6:5060', '0537', 'NOVA');
INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES ('NOVA', 'NOVA', '131.196.224.6');
--########################################################--

INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES ('DirectCall', 'sip:S8BHM@189.84.129.12:5060', 120);
INSERT INTO ps_auths (id, auth_type, username, password) VALUES ('DirectCall', 'userpass', 'S8BHM', '123456');
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, direct_media, language, outbound_auth)
  VALUES
('DirectCall', 'udp_transport', 'DirectCall', 'all', 'ulaw', 'DirectCall', 'no', 'pt_BR', 'DirectCall');
INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, outbound_auth)
  VALUES
('DirectCall', 'sip:S8BHM@189.84.129.12:5060', 'sip:S8BHM@192.168.0.41:5060', 'S8BHM', 'DirectCall');
INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES ('DirectCall', 'DirectCall', '189.84.129.12');

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Endpoints SIP Generate --
DROP FUNCTION endpointsSipGenerate;
CREATE OR REPLACE FUNCTION endpointsSipGenerate(
  initEndpoint integer,
  qttEndpoints integer,
  passwordValue character varying(50),
  transportValue character varying(50), -- udp_transport, tcp_transport and wss_transport
  contextValue character varying(50),
  dtmfMode pjsip_dtmf_mode_values_v3, -- 'rfc2833', 'info', 'shortinfo', 'inband', 'auto'
  stateBusy integer, 
  codec character varying(50), -- ulaw or alaw
  callGroup character varying(50),
  pickupGroup character varying(50),
  nat yesno_values
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
      INSERT INTO ps_auths (id, auth_type, password, username) VALUES (endpoint, 'userpass', passwordValue, endpoint);
      INSERT INTO ps_endpoints
        (id, transport, aors, auth, context, callerid, language, inband_progress, rtp_timeout, message_context, allow_subscribe, subscribe_context, direct_media, dtmf_mode,
         device_state_busy_at, disallow, allow, named_call_group, named_pickup_group, force_rport, rewrite_contact, rtp_symmetric)
      VALUES
        (endpoint, transportValue, endpoint, endpoint, contextValue, CONCAT(endpoint, ' ', '<', endpoint, '>'), 'pt_BR', 'no', 120, 'textmessages', 'yes', 'subscriptions', 'no', dtmfMode,
         stateBusy, 'all', codec, callGroup, pickupGroup, nat, nat, nat);
    END LOOP;
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

SELECT endpointsSipGenerate(1501, 1, '!vigos!!interface#01!', 'udp_transport', 'ddd-celular', 'info', 1, 'auto', 'geral', 'geral', 'no');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Endpoints SIP UPDATE --
DROP FUNCTION endpointsSipUpdate;
CREATE OR REPLACE FUNCTION endpointsSipUpdate(
  endpoint character varying(50),
  passwordValue character varying(50),
  transportValue character varying(50), -- udp_transport, tcp_transport and wss_transport
  contextValue character varying(50),
  dtmfMode pjsip_dtmf_mode_values_v3, -- 'rfc2833', 'info', 'shortinfo', 'inband', 'auto'
  stateBusy integer, 
  codec character varying(50), -- ulaw or alaw
  callGroup character varying(50),
  pickupGroup character varying(50),
  nat  yesno_values
)
RETURNS boolean 
AS
$$
BEGIN
  IF endpoint <> '' THEN
      UPDATE ps_auths SET password = passwordValue WHERE id = endpoint;
      UPDATE ps_endpoints SET 
      (id, transport, aors, auth, context, callerid, language, inband_progress, rtp_timeout, message_context, allow_subscribe, subscribe_context, direct_media, dtmf_mode,
       device_state_busy_at, disallow, allow, named_call_group, named_pickup_group, force_rport, rewrite_contact, rtp_symmetric)
      =
      (endpoint, transportValue, endpoint, endpoint, contextValue, CONCAT(endpoint, ' ', '<', endpoint, '>'), 'pt_BR', 'no', 120, 'textmessages', 'yes', 'subscriptions', 'no', dtmfMode,
       stateBusy, 'all', codec, callGroup, pickupGroup, nat, nat, nat)
      WHERE id = endpoint;
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

SELECT endpointsSipUpdate('1501', 'ABC', 'udp_transport', 'ddd-celular', 'info', 1, 'ulaw', 'geral', 'geral', 'no');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Endpoints Web Generate --
DROP FUNCTION endpointsWebGenerate;
CREATE OR REPLACE FUNCTION endpointsWebGenerate(
  initEndpoint integer,
  qttEndpoints integer,
  passwordValue character varying(50),
  transportValue character varying(50), -- udp_transport, tcp_transport and wss_transport
  contextValue character varying(50),
  dtmfMode pjsip_dtmf_mode_values_v3, -- 'rfc2833', 'info', 'shortinfo', 'inband', 'auto'
  stateBusy integer, 
  codec character varying(50), -- ulaw or alaw
  callGroup character varying(50),
  pickupGroup character varying(50),
  nat yesno_values
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
      INSERT INTO ps_auths (id, auth_type, password, username) VALUES (endpoint, 'userpass', passwordValue, endpoint);
      INSERT INTO ps_endpoints
        (id, transport, aors, auth, context, callerid, language, allow, webrtc, use_avpf, media_encryption, dtls_verify, dtls_setup, ice_support, media_use_received_transport, rtcp_mux, dtmf_mode,
         device_state_busy_at, dtls_cert_file, dtls_private_key, dtls_ca_file, named_call_group, named_pickup_group, rewrite_contact)
      VALUES
        (endpoint, transportValue, endpoint, endpoint, contextValue, CONCAT(endpoint, ' ', '<', endpoint, '>'), 'pt_BR', codec, 'yes', 'yes', 'dtls', 'fingerprint', 'actpass', 'yes', 'yes', 'yes', dtmfMode,
         stateBusy, '/home/vjpbx/certificates/certs/vigoscloud.crt', '/home/vjpbx/certificates/certs/vigoscloud.key', '/home/vjpbx/certificates/ca/vigoscloud-Root-CA.crt', callGroup, pickupGroup, nat);
    END LOOP;
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;


SELECT endpointsWebGenerate(5560, 1, '!vigos!!interface#01!', 'wss_transport', 'ddd-celular', 'info', 1, 'opus', 'geral', 'geral', 'no');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Endpoints WEB UPDATE --
DROP FUNCTION endpointsWebUpdate;
CREATE OR REPLACE FUNCTION endpointsWebUpdate(
  endpoint character varying(50),
  passwordValue character varying(50),
  transportValue character varying(50), -- udp_transport, tcp_transport and wss_transport
  contextValue character varying(50),
  dtmfMode pjsip_dtmf_mode_values_v3, -- 'rfc2833', 'info', 'shortinfo', 'inband', 'auto'
  stateBusy integer, 
  codec character varying(50), -- ulaw or alaw
  callGroup character varying(50),
  pickupGroup character varying(50),
  nat yesno_values
)
RETURNS boolean 
AS
$$
BEGIN
  IF endpoint <> '' THEN
      UPDATE ps_auths SET password = passwordValue WHERE id = endpoint;
      UPDATE ps_endpoints SET 
        (id, transport, aors, auth, context, callerid, language, allow, webrtc, use_avpf, media_encryption, dtls_verify, dtls_setup, ice_support, media_use_received_transport, rtcp_mux,
         dtmf_mode, device_state_busy_at, dtls_cert_file, dtls_private_key, dtls_ca_file, named_call_group, named_pickup_group, rewrite_contact)
      =
        (endpoint, transportValue, endpoint, endpoint, contextValue, CONCAT(endpoint, ' ', '<', endpoint, '>'), 'pt_BR', codec, 'yes', 'yes', 'dtls', 'fingerprint', 'actpass', 'yes', 'yes', 'yes',
        dtmfMode, stateBusy, '/home/vjpbx/certificates/certs/vigoscloud.crt', '/home/vjpbx/certificates/certs/vigoscloud.key', '/home/vjpbx/certificates/ca/vigoscloud-Root-CA.crt', callGroup, pickupGroup, nat)
      WHERE id = endpoint;
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

SELECT endpointsWebUpdate('5560', 'TESTE', 'wss_transport', 'ddd-celular', 'info', 1, 'ulaw', 'geral', 'geral', 'yes');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Queues Generate --
INSERT INTO queues (name, strategy, autofill, maxlen, ringinuse, announce_position, announce_frequency, announce_holdtime, min_announce_frequency, setqueueentryvar, wrapuptime)
VALUES
('crm', 'ringall', 'yes', 20, 'no', 'yes', 30, 'yes', 30, 'yes', 4);

DROP FUNCTION queuesGenerate;
CREATE OR REPLACE FUNCTION queuesGenerate(
  queueName character varying(128),
  queueMusicOnHold character varying(128),
  queueStrategy queue_strategy_values, -- ringall, leastrecent, fewestcalls, random, rrmemory, linear, wrandom, rrordered
  queueAutoFill yesno_values, -- yes or no
  queueMaxLen integer,
  queueRinginuse yesno_values, -- yes or no
  queueAnnouncePosition yesno_values, -- yes or no
  queueAnnounceFrequency integer,
  queueAnnounceHoldTime yesno_values, -- yes or no
  queueMinAnnounceFrequency integer,
  queueSetQueueEntryVarQueue yesno_values, -- yes or no
  queueWrapuptime integer
)
RETURNS boolean 
AS
$$
BEGIN
  IF CHAR_LENGTH(queueName) > 0 THEN
    INSERT INTO queues (name, musiconhold, strategy, autofill, maxlen, ringinuse, announce_position, announce_frequency, announce_holdtime, min_announce_frequency, setqueueentryvar, wrapuptime)
      VALUES
    (queueName, queueMusicOnHold, queueStrategy, queueAutoFill, queueMaxLen, queueRinginuse, queueAnnouncePosition, queueAnnounceFrequency, queueAnnounceHoldTime, queueMinAnnounceFrequency, queueSetQueueEntryVarQueue, queueWrapuptime);
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

SELECT queuesGenerate('avancadas', 'default', 'ringall', 'yes', 20, 'no', 'yes', 30, 'yes', 30, 'yes', 4);
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Queues Update --
DROP FUNCTION queuesUpdate;
CREATE OR REPLACE FUNCTION queuesUpdate(
  queueName character varying(128),
  queueMusicOnHold character varying(128),
  queueStrategy queue_strategy_values, -- ringall, leastrecent, fewestcalls, random, rrmemory, linear, wrandom, rrordered
  queueAutoFill yesno_values, -- yes or no
  queueMaxLen integer,
  queueRinginuse yesno_values, -- yes or no
  queueAnnouncePosition yesno_values, -- yes or no
  queueAnnounceFrequency integer,
  queueAnnounceHoldTime yesno_values, -- yes or no
  queueMinAnnounceFrequency integer,
  queueSetQueueEntryVarQueue yesno_values, -- yes or no
  queueWrapuptime integer
)
RETURNS boolean 
AS
$$
BEGIN
  IF CHAR_LENGTH(queueName) > 0 THEN
    UPDATE queues SET
      (name, musiconhold, strategy, autofill, maxlen, ringinuse, announce_position, announce_frequency, announce_holdtime, min_announce_frequency, setqueueentryvar, wrapuptime)
    =
      (queueName, queueMusicOnHold, queueStrategy, queueAutoFill, queueMaxLen, queueRinginuse, queueAnnouncePosition, queueAnnounceFrequency, queueAnnounceHoldTime, queueMinAnnounceFrequency, queueSetQueueEntryVarQueue, queueWrapuptime)
    WHERE name = queueName;
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

SELECT queuesUpdate('avancadas', 'default', 'ringall', 'yes', 20, 'no', 'yes', 30, 'yes', 30, 'yes', 4);
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Queue Membres Generate --
INSERT INTO queue_members (queue_name, interface) VALUES ('crm', 'PJSIP/7251', 1);

DROP FUNCTION queuesMembersGenerate;
CREATE OR REPLACE FUNCTION queuesMembersGenerate(
  nameQueue character varying(128),
  initEndpoint integer,
  finalEndpoint integer
)
RETURNS boolean 
AS
$$
DECLARE
  existsUniqueid integer;
BEGIN
  IF initEndpoint > 0 THEN
    FOR endpoint in initEndpoint .. finalEndpoint LOOP
      existsUniqueid = (SELECT COUNT(*) FROM queue_members WHERE uniqueid = endpoint);
      -- raise notice 'SELECT: %', existsUniqueid;
      IF existsUniqueid::integer < 1 THEN
        INSERT INTO queue_members (queue_name, interface, uniqueid) VALUES (nameQueue, CONCAT('PJSIP/', endpoint), endpoint);
      ELSE
        INSERT INTO queue_members (queue_name, interface, uniqueid) VALUES (nameQueue, CONCAT('PJSIP/', endpoint), (endpoint + to_char(ROUND(RANDOM()*10000), '0000')::integer));
      END IF;
    END LOOP;
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

SELECT queuesMembersGenerate('recepcao', 2000, 2000);

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Music on hold
CREATE TYPE moh_mode_values AS ENUM ('custom', 'files', 'mp3nb', 'quietmp3nb', 'quietmp3');

CREATE TABLE musiconhold (
    name VARCHAR(80) NOT NULL, 
    mode moh_mode_values, 
    directory VARCHAR(255), 
    application VARCHAR(255), 
    digit VARCHAR(1), 
    sort VARCHAR(10), 
    format VARCHAR(10), 
    stamp TIMESTAMP WITHOUT TIME ZONE, 
    PRIMARY KEY (name)
);

INSERT INTO musiconhold (name, mode, directory) VALUES ('imobiliaria-jau', 'files', '/var/lib/asterisk/moh-imobiliaria');
-- Function Music On Hold Generate --
INSERT INTO queue_members (queue_name, interface) VALUES ('crm', 'PJSIP/7251', 1);

DROP FUNCTION mohGenerate;

CREATE OR REPLACE FUNCTION mohGenerate(
  mohName character varying(128),
  mohMode character varying(128), -- custom, files, mp3nb, quietmp3nb, quietmp3
)
RETURNS boolean 
AS
$$
BEGIN
  IF char_length(mohName) > 0 THEN
    INSERT INTO musiconhold (name, mode, directory) VALUES (mohName, mohMode, '/var/lib/asterisk/moh-imobiliaria');
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

SELECT queuesMembersGenerate('teste', 'files');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

named_call_group, named_pickup_group

DELETE FROM ps_endpoints WHERE id='1431085999';

DELETE FROM queue_members WHERE queue_name = 'sac';

UPDATE queue_members SET paused = 1 WHERE queue_name = 'sac';

UPDATE queue_members SET paused = 0 WHERE uniqueid = '7472';

INSERT INTO queue_members (queue_name, interface, uniqueid) VALUES ('recepcao', CONCAT('PJSIP/', '5539'), '5539');
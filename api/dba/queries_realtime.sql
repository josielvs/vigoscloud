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

INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('Recepção', 'recep.bru@lagosan.com.br', '$2a$05$otXhMerurrt1Gobom4bUOOKpewrVwEX/7RYmxfHcP8Byw6gpESnjy', '6200', 'user', 'true');

TRUNCATE TABLE ps_aors;
TRUNCATE TABLE ps_auths;
TRUNCATE TABLE ps_endpoints;
TRUNCATE TABLE ps_registrations;
TRUNCATE TABLE ps_endpoint_id_ips;
TRUNCATE TABLE queues;
TRUNCATE TABLE queue_members;
TRUNCATE TABLE cdr;

INSERT INTO ps_endpoints
        (id, transport, aors, auth, context, callerid, language, inband_progress, rtp_timeout, message_context, allow_subscribe, subscribe_context, direct_media, dtmf_mode, device_state_busy_at, disallow, allow, named_call_group, named_pickup_group, force_rport, rewrite_contact, rtp_symmetric)
      VALUES
        (endpoint, transportValue, endpoint, endpoint, contextValue, CONCAT(endpoint, ' ', '<', endpoint, '>'), 'pt_BR', 'no', 120, 'textmessages', 'yes', 'subscriptions', 'no', dtmfMode,
         stateBusy, 'all', codec, callGroup, pickupGroup, nat, nat, nat);

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--############-- WEB PHONE --############--
INSERT INTO ps_aors (id, max_contacts, qualify_frequency, remove_existing) VALUES (8701, 1, 120, 'yes');
INSERT INTO ps_auths (id, auth_type, password, username) VALUES (8701, 'userpass', '!vigos!!interface#01!', 8701);
INSERT INTO ps_endpoints (id, transport, aors, auth, context, callerid, language, allow, webrtc, use_avpf, media_encryption, dtls_verify, dtls_setup, ice_support, media_use_received_transport, rtcp_mux, dtls_cert_file, dtls_private_key, dtls_ca_file)
  VALUES
(8701, 'wss_transport', 8701, 8701, 'ddd-celular', '8701 <8701>', 'pt_BR', 'opus,ulaw,vp9,vp8,h264', 'yes', 'yes', 'dtls', 'fingerprint', 'actpass', 'yes', 'yes', 'yes', '/home/vjpbx/certificates/certs/vigoscloud.crt', '/home/vjpbx/certificates/certs/vigoscloud.key', '/home/vjpbx/certificates/ca/vigoscloud-Root-CA.crt');
--########################################--

--############-- SIP PHONE --############--
INSERT INTO ps_aors (id, max_contacts, qualify_frequency, remove_existing) VALUES (2014, 1, 120, 'yes');
INSERT INTO ps_auths (id, auth_type, password, username) VALUES (2014, 'userpass', '!vigos!!interface#01!', 2014);
INSERT INTO ps_endpoints (id, transport, aors, auth, context, callerid, language, inband_progress, rtp_timeout, message_context, allow_subscribe, subscribe_context, direct_media, dtmf_mode, device_state_busy_at, disallow, allow)
  VALUES
(2014, 'udp_transport', 2014, 2014, 'ddd-celular', '2014 <2014>', 'pt_BR', 'no', 120, 'textmessages', 'yes', 'subscriptions', 'no', 'info', 1, 'all', 'ulaw');
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

--#############-- PROVIDER TRUNK IP - NAMED --#############--
INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES ('Embratel', 'sip:1433129900@189.52.73.116:5060', 120);
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, from_domain, from_user, direct_media, language, tos_audio, cos_audio)
  VALUES
('Embratel', 'udp_transport', 'Embratel', 'all', 'alaw', 'Embratel', '200.210.39.6', '1433129900', 'no', 'pt_BR', 'af42', 3);
INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, transport, endpoint, line)
VALUES
('Embratel', 'sip:189.52.73.116:5060', 'sip:1433129900@200.210.39.6:5060', '1433129900', 'udp_transport', 'Embratel', 'yes');
INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES ('Embratel', 'Embratel', '189.52.73.116');
--########################################################--

--##########-- PROVIDER TRUNK AUTH - NUMBER --#########--
INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES (21061500, 'sip:0537@131.196.224.6:5060', 120);
INSERT INTO ps_auths (id, auth_type, password, username) VALUES (21061500, 'userpass', '2l1@mVcXe37u8i', '0537');
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, direct_media, language, tos_audio, cos_audio, outbound_auth, from_user)
  VALUES
(21061500, 'udp_transport', 'NOVA', 'all', 'ulaw', '21061500', 'no', 'pt_BR', 'af42', 3, '21061500', '0537');
INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, transport, endpoint)
  VALUES
(21061500, 'sip:0537@131.196.224.6:5060', 'sip:0537@131.196.224.6:5060', '0537', 'udp_transport', '21061500');
INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES (21061500, '21061500', '131.196.224.6');
--#####################################################--

--############-- PROVIDER TRUNK AUTH - NAMED --###########--
INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES ('NOVA', 'sip:131.196.224.6:5060', 120);
INSERT INTO ps_auths (id, auth_type, username, password) VALUES ('NOVA', 'userpass', '0537', '2l1@mVcXe37u8i');
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, direct_media, language, outbound_auth, from_user)
  VALUES
('NOVA', 'udp_transport', 'NOVA', 'all', 'ulaw', 'NOVA', 'no', 'pt_BR', 'NOVA', '0537');
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
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Trunk Generate --
DROP FUNCTION trunkIPGenerate;
CREATE OR REPLACE FUNCTION trunkIPGenerate(
  provider character varying(50),
  ipSbcTrunk character varying(50),
  ipGwLocal character varying(50),
  keyTrunk character varying(50),
  codec character varying(50)
)
RETURNS boolean 
AS
$$
BEGIN
  IF char_length(provider) > 0 THEN
      INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES (provider, 'sip:' || keyTrunk || '@' || ipSbcTrunk || ':5060', 120);
      INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, from_domain, from_user, direct_media, language, tos_audio, cos_audio)
        VALUES
      (provider, 'udp_transport', provider, 'all', codec, provider, ipGwLocal, keyTrunk, 'no', 'pt_BR', 'af42', 3);
      INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, transport, endpoint, line)
      VALUES
      (provider, 'sip:' || ipSbcTrunk || ':5060', 'sip:' || keyTrunk || '@' || ipGwLocal || ':5060', keyTrunk, 'udp_transport', provider, 'yes');
      INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES (provider, provider, ipSbcTrunk);
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- SELECT trunkIPGenerate('VIVO', '189.52.73.117', '200.166.105.119', '1434340365', 'alaw');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Trunk AUTH Generate --
DROP FUNCTION trunkAuthGenerate;
CREATE OR REPLACE FUNCTION trunkAuthGenerate(
  provider character varying(50),
  ipSbcTrunk character varying(50),
  authUserName character varying(50),
  password character varying(50),
  codec character varying(50)
)
RETURNS boolean 
AS
$$
BEGIN
  IF char_length(provider) > 0 THEN
      INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES (provider, 'sip:' || ipSbcTrunk || ':5060', 120);
      INSERT INTO ps_auths (id, auth_type, username, password) VALUES (provider, 'userpass', authUserName, password);
      INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, direct_media, language, outbound_auth)
        VALUES
      (provider, 'udp_transport', provider, 'all', codec, provider, 'no', 'pt_BR', provider);
      INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, outbound_auth)
        VALUES
      (provider, 'sip:' || ipSbcTrunk || ':5060', 'sip:' || authUserName || '@' || ipSbcTrunk || ':5060', authUserName, provider);
      INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES (provider, provider, ipSbcTrunk);
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- SELECT trunkAuthGenerate('DirectCall', '189.84.133.135', 'KZBRI', 'QX1hzIP2YN2fov9w', 'ulaw');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Trunk SELECT --
DROP FUNCTION trunksSelect;
CREATE OR REPLACE FUNCTION trunksSelect()
RETURNS TABLE (
  name character varying(50),
  modeTransport character varying(50),
  trunkContext character varying(50),
  codec character varying(50),
  server character varying(50),
  client character varying(50),
  authUser character varying(50),
  authPassword character varying(50)
)
  LANGUAGE plpgsql AS
$$
BEGIN
  return QUERY
  SELECT
    (SELECT id FROM ps_endpoints WHERE id IN (SELECT id FROM ps_endpoint_id_ips)) AS name,
    (SELECT transport FROM ps_endpoints WHERE id IN (SELECT id FROM ps_endpoint_id_ips)) AS modeTransport ,
    (SELECT context FROM ps_endpoints WHERE id IN (SELECT id FROM ps_endpoint_id_ips)) AS trunkContext,
    (SELECT allow FROM ps_endpoints WHERE id IN (SELECT id FROM ps_endpoint_id_ips)) AS codec,
    (SELECT server_uri FROM ps_registrations WHERE id IN (SELECT id FROM ps_endpoint_id_ips)) AS server,
    (SELECT client_uri FROM ps_registrations WHERE id IN (SELECT id FROM ps_endpoint_id_ips)) AS client,
    (SELECT username FROM ps_auths WHERE id IN (SELECT id FROM ps_endpoint_id_ips)) AS authUser,
    (SELECT password FROM ps_auths WHERE id IN (SELECT id FROM ps_endpoint_id_ips)) AS authPassword;
END;
$$;

-- SELECT trunksSelect();
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Endpoints DELETE --
DROP FUNCTION trunkDelete;
CREATE OR REPLACE FUNCTION trunkDelete(
  elements text[]
)
RETURNS boolean 
AS
$$
BEGIN
  IF array_length(elements::text[], 0) IS NULL THEN
      DELETE FROM ps_aors WHERE id = ANY(elements);
      DELETE FROM ps_auths WHERE id = ANY(elements);
      DELETE FROM ps_endpoints WHERE id = ANY(elements);
      DELETE FROM ps_registrations WHERE id = ANY(elements);
      DELETE FROM ps_endpoint_id_ips WHERE id = ANY(elements);
      -- Deletar
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- SELECT trunkDelete(ARRAY['9002', '9910'], 1);
-- SELECT trunkDelete('{ALGAR}');
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

-- SELECT endpointsSipGenerate('2014', 30, '!vigos!!interface#01!', 'udp_transport', 'ddd-celular', 'info', 1, 'ulaw', 'geral', 'geral', 'no');
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
        (endpoint, 'wss_transport', endpoint, endpoint, contextValue, CONCAT(endpoint, ' ', '<', endpoint, '>'), 'pt_BR', codec, 'yes', 'yes', 'dtls', 'fingerprint', 'actpass', 'yes', 'yes', 'yes', dtmfMode,
         stateBusy, '/home/vjpbx/certificates/certs/vigoscloud.crt', '/home/vjpbx/certificates/certs/vigoscloud.key', '/home/vjpbx/certificates/ca/vigoscloud-Root-CA.crt', callGroup, pickupGroup, nat);
    END LOOP;
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;


-- SELECT endpointsWebGenerate(6200, 1, '!vigos!!interface#01!', 'wss_transport', 'ddd-celular', 'info', 1, 'opus', 'geral', 'geral', 'no');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Endpoints SELECT --
DROP FUNCTION endpointsSelect;
CREATE OR REPLACE FUNCTION endpointsSelect()
RETURNS TABLE (
  endpoint character varying(30),
  transportName character varying(30),
  contextName character varying(30),
  languageName character varying(30),
  codec character varying(30),
  dtmf pjsip_dtmf_mode_values_v3,
  busy integer,
  callGroup  character varying(30),
  captureGroup character varying(30),
  nat yesno_values
)
  LANGUAGE plpgsql AS
$$
BEGIN
  return QUERY
  SELECT
    id AS endpoint,
    transport AS transportName,
    context as contextName,
    language,
    allow AS codec,
    dtmf_mode AS dtmf,
    device_state_busy_at AS busy,
    named_call_group AS callGroup,
    named_pickup_group AS captureGroup,
    rewrite_contact AS nat
  FROM
    ps_endpoints
  ORDER BY id;
END;
$$;

-- SELECT endpointsSelect();
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Endpoint SELECT By ID --
DROP FUNCTION endpointByIdSelect;
CREATE OR REPLACE FUNCTION endpointByIdSelect(
  elements text[]
)
RETURNS TABLE (
  endpoint character varying(30),
  transportName character varying(30),
  contextName character varying(30),
  languageName character varying(30),
  codec character varying(30),
  dtmf pjsip_dtmf_mode_values_v3,
  busy integer,
  callGroup  character varying(30),
  captureGroup character varying(30),
  nat yesno_values
) 
AS
$$
BEGIN
  return QUERY
  SELECT
    id AS endpoint,
    transport AS transportName,
    context as contextName,
    language,
    allow AS codec,
    dtmf_mode AS dtmf,
    device_state_busy_at AS busy,
    named_call_group AS callGroup,
    named_pickup_group AS captureGroup,
    rewrite_contact AS nat
  FROM
    ps_endpoints
  WHERE id = ANY(elements);
END;
$$ LANGUAGE plpgsql;


-- SELECT endpointByIdSelect(ARRAY["9000"]);
-- SELECT endpointByIdSelect('{9000, 9001}');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Endpoint UPDATE --
DROP FUNCTION endpointsUpdate;
CREATE OR REPLACE FUNCTION endpointsUpdate(
  endpoint text[],
  passwordValue character varying(150),
  transportValue character varying(150), -- udp_transport, tcp_transport and wss_transport
  contextValue character varying(150),
  languageValue character varying(150),
  dtmfMode pjsip_dtmf_mode_values_v3, -- 'rfc2833', 'info', 'shortinfo', 'inband', 'auto'
  stateBusy integer, 
  codec character varying(150), -- ulaw or alaw
  callGroup character varying(150),
  pickupGroup character varying(150),
  nat yesno_values
)
RETURNS boolean
AS
$$
BEGIN
  IF array_length(endpoint::bigint[], 0) IS NULL THEN
      UPDATE ps_auths SET password = passwordValue WHERE id = ANY(endpoint);
      UPDATE ps_endpoints SET 
        (transport, context, language, dtmf_mode, device_state_busy_at, allow, named_call_group, named_pickup_group, force_rport, rewrite_contact, rtp_symmetric)
        =
        (transportValue, contextValue, languageValue, dtmfMode, stateBusy, codec, callGroup, pickupGroup, nat, nat, nat)
      WHERE id = ANY(endpoint);
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- SELECT endpointsUpdate('{8502, 8002}', '!vigos!!zzzzzzzz#01!', 'tcp_transport', 'ddd-celular', 'en-teste', 'info', 1, 'ulaw', 'geral-3', 'geral-3', 'yes');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Endpoints DELETE --
DROP FUNCTION endpointDelete;
CREATE OR REPLACE FUNCTION endpointDelete(
  elements text[]
)
RETURNS boolean 
AS
$$
BEGIN
  IF array_length(elements::bigint[], 0) IS NULL THEN
      DELETE FROM ps_aors WHERE id = ANY(elements);
      DELETE FROM ps_auths WHERE id = ANY(elements);
      DELETE FROM ps_endpoints WHERE id = ANY(elements);
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- SELECT endpointDelete(ARRAY['9002', '9910'], 1);
-- SELECT endpointDelete('{8002, 8504}');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Queues Generate --
-- Se "leavewhenempty" for definido como "strict".
-- E "joinempty" definido como "strict".
-- Impedirá que os chamadores de entrada sejam colocados em filas onde não há agentes para atender chamadas.
-- O aplicativo Queue() retornará e o plano de discagem poderá determinar o que fazer em seguida.
-- Essa configuração controla se os chamadores podem ingressar em uma fila sem membros.
-- Existem três escolhas: 
--   yes - os chamadores podem entrar em uma fila sem membros ou apenas membros indisponíveis
--   no - os chamadores não podem entrar em uma fila sem membros
--   strict - os chamadores não podem entrar em uma fila sem membros ou apenas membros indisponíveis
--   soltos - o mesmo que restrito, mas os membros da fila pausados ​​não contar como indisponível



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
  queueWrapuptime integer,
  queueJoinempty character varying(128),
  queueLeavewhenempty character varying(128)
)
RETURNS boolean 
AS
$$
BEGIN
  IF CHAR_LENGTH(queueName) > 0 THEN
    INSERT INTO queues (name, musiconhold, strategy, autofill, maxlen, ringinuse, announce_position, announce_frequency, announce_holdtime, min_announce_frequency, setqueueentryvar, wrapuptime, joinempty, leavewhenempty)
      VALUES
    (queueName, queueMusicOnHold, queueStrategy, queueAutoFill, queueMaxLen, queueRinginuse, queueAnnouncePosition, queueAnnounceFrequency, queueAnnounceHoldTime, queueMinAnnounceFrequency, queueSetQueueEntryVarQueue, queueWrapuptime, queueJoinempty, queueLeavewhenempty);
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- SELECT queuesGenerate('atendimento', 'default', 'ringall', 'yes', 20, 'yes', 'yes', 30, 'yes', 30, 'yes', 5, '', ''); -- Com Anuncio
-- SELECT queuesGenerate('falcao', 'default', 'ringall', 'yes', 20, 'yes', 'yes', 30, 'yes', 30, 'yes', 5, '', ''); -- Com Anuncio
-- SELECT queuesGenerate('mary-dota', 'default', 'ringall', 'yes', 20, 'yes', 'yes', 30, 'yes', 30, 'yes', 5, '', ''); -- Com Anuncio
-- SELECT queuesGenerate('backoffice-ok', 'default', 'ringall', 'yes', 20, 'yes', 'yes', 30, 'yes', 30, 'yes', 5, '', ''); -- Com Anuncio
-- SELECT queuesGenerate('saleops-ok', 'default', 'ringall', 'yes', 20, 'yes', 'yes', 30, 'yes', 30, 'yes', 5, '', ''); -- Com Anuncio
-- SELECT queuesGenerate('salesenablement-ok', 'default', 'ringall', 'yes', 20, 'yes', 'yes', 30, 'yes', 30, 'yes', 5, '', ''); -- Com Anuncio
-- SELECT queuesGenerate('isr_n1-ok', 'default', 'ringall', 'yes', 20, 'yes', 'yes', 30, 'yes', 30, 'yes', 5, '', ''); -- Com Anuncio
-- SELECT queuesGenerate('isr_n2-ok', 'default', 'ringall', 'yes', 20, 'yes', 'yes', 30, 'yes', 30, 'yes', 5, '', ''); -- Com Anuncio
-- SELECT queuesGenerate('isr_n3-ok', 'default', 'ringall', 'yes', 20, 'yes', 'yes', 30, 'yes', 30, 'yes', 5, '', ''); -- Com Anuncio
-- SELECT queuesGenerate('isr_n4-ok', 'default', 'ringall', 'yes', 20, 'yes', 'yes', 30, 'yes', 30, 'yes', 5, '', ''); -- Com Anuncio

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
  queueWrapuptime integer,
  queueJoinempty character varying(128),
  queueLeavewhenempty character varying(128)
)
RETURNS boolean 
AS
$$
BEGIN
  IF CHAR_LENGTH(queueName) > 0 THEN
    UPDATE queues SET
      (musiconhold, strategy, autofill, maxlen, ringinuse, announce_position, announce_frequency, announce_holdtime, min_announce_frequency, setqueueentryvar, wrapuptime, joinempty, leavewhenempty)
    =
      (queueMusicOnHold, queueStrategy, queueAutoFill, queueMaxLen, queueRinginuse, queueAnnouncePosition, queueAnnounceFrequency, queueAnnounceHoldTime, queueMinAnnounceFrequency, queueSetQueueEntryVarQueue, queueWrapuptime, queueJoinempty, queueLeavewhenempty)
    WHERE name = queueName;
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Com anuncio
-- SELECT queuesUpdate('pecas', 'default', 'ringall', 'yes', 20, 'no', 'yes', 30, 'yes', 30, 'yes', 5, 'no', 'no');

-- Sem anuncio
-- SELECT queuesUpdate('monsenhor', 'default', 'ringall', 'yes', 20, 'no', 'no', 0, 'no', 0, 'yes', 5, '', '');
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Queue Membres Generate --
-- INSERT INTO queue_members (queue_name, interface) VALUES ('crm', 'PJSIP/7251', 1);

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

-- SELECT queuesMembersGenerate('atendimento', 1615, 1654);
INSERT INTO queue_members (queue_name, interface, uniqueid) VALUES ('atendimento', 'PJSIP/2013', 2013);
-- SELECT queuesMembersGenerate('castelo', 6218, 6221);
-- SELECT queuesMembersGenerate('falcao', 6210, 6216);
-- SELECT queuesMembersGenerate('mary-dota', 6217, 6225);
-- SELECT queuesMembersGenerate('polo_bauru', 4120, 4120);
-- SELECT queuesMembersGenerate('polo_bauru', 4044, 4044);

-- SELECT queuesMembersGenerate('polo_bauru', 4110, 4110);
-- SELECT queuesMembersGenerate('polo_bauru', 4118, 4118);

-- SELECT queuesMembersGenerate('trasb_polo_bauru', 4007, 4007);
-- SELECT queuesMembersGenerate('trasb_polo_bauru', 4122, 4122);
-- SELECT queuesMembersGenerate('trasb_polo_bauru', 4117, 4117);
-- SELECT queuesMembersGenerate('trasb_polo_bauru', 4119, 4119);
-- SELECT queuesMembersGenerate('trasb_polo_bauru', 4044, 4044);
-- SELECT queuesMembersGenerate('agendamento', 4122, 4122);
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Function Queue Membres Update --
DROP FUNCTION queuesMembersUpdate;
CREATE OR REPLACE FUNCTION queuesMembersUpdate(
  nameQueue character varying(128),
  endpointId integer,
  pause integer
)
RETURNS boolean 
AS
$$
BEGIN
  IF endpointId > 0 THEN
    UPDATE queue_members SET (queue_name, paused) = (nameQueue, pause) WHERE uniqueid = endpointId;
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- SELECT queuesMembersUpdate('avancadas', 5560);
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

INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES ('NOVA', 'sip:0537@131.196.224.6:5060', 120);
INSERT INTO ps_auths (id, auth_type, username, password) VALUES ('NOVA', 'userpass', '0537', '2l1@mVcXe37u8i');
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, direct_media, language, outbound_auth)
  VALUES
('NOVA', 'udp_transport', 'NOVA', 'all', 'ulaw', 'NOVA', 'no', 'pt_BR', 'NOVA');
INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, outbound_auth)
  VALUES
('NOVA', 'sip:0537@131.196.224.6:5060', 'sip:0537@131.196.224.6:5060', '0537', 'NOVA');
INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES ('NOVA', 'NOVA', '131.196.224.6');



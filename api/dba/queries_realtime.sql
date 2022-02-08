  1 | Vigos   | adm@vigossolucoes.com.br     | $2a$05$A1Xso4kAVGLXxpJj1oAIxO5o4JR.PA0OdBKqZTwra10JQ62FCirj. | 7000     | admin | t
  2 | Api     | api@vigossolucoes.com.br     | $2a$05$jbclBshzhwZhCyMgjbTcfOoeiOrGSv1Hyp6XIHZavat2.O8EnMARC | 7000     | api   | t
  3 | User    | user@vigossolucoes.com.br    | $2a$05$t77fhcB.jNZLLiYys6.aFuI5dZ07kTa/uTuF9cuIMK.TeyFfCp5Za | 7000     | user  | t
  4 | Gustavo | gustavo@vigossolucoes.com.br | $2a$05$jbclBshzhwZhCyMgjbTcfOoeiOrGSv1Hyp6XIHZavat2.O8EnMARC | 4108     | admin | t
  5 | Victor  | victor@vigossolucoes.com.br  | $2a$05$ABJrNY5NXVQzgoMqenBlBuScfsCeFPtDxFp1qtyy8ovnJeluZqq4m | 4109     | admin | t

INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('Vigos', 'adm@vigossolucoes.com.br', '$2a$05$A1Xso4kAVGLXxpJj1oAIxO5o4JR.PA0OdBKqZTwra10JQ62FCirj.', '5555', 'admin', 'true');
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
INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES (1433129900, 'sip:1433129900@189.52.73.116:5060', 120);
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, from_domain, direct_media, language, tos_audio, cos_audio)
  VALUES
(1433129900, 'udp_transport', 'Embratel', 'all', 'ulaw,alaw', 1433129900, '200.208.223.42', 'no', 'pt_BR', 'af42', 3);
INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, transport) VALUES (1433129900, 'sip:189.52.73.116', 'sip:1433129900@ 200.208.223.42', 1433129900, 'udp_transport');
INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES (1433129900, 1433129900, '189.52.73.116');
--############################################--

--##########-- PROVIDER TRUNK AUTH --#########--
INSERT INTO ps_aors (id, contact, qualify_frequency) VALUES (KZBRI, 'sip:KZBRI@189.84.133.135:5060', 120);
INSERT INTO ps_auths (id, auth_type, password, username) VALUES (KZBRI, 'userpass', 'QX1hzIP2YN2fov9w', KZBRI);
INSERT INTO ps_endpoints (id, transport, context, disallow, allow, aors, from_domain, direct_media, language, tos_audio, cos_audio)
  VALUES
(KZBRI, 'udp_transport', 'DirectCall', 'all', 'ulaw,alaw', KZBRI, '189.84.133.135', 'no', 'pt_BR', 'af42', 3);
INSERT INTO ps_registrations (id, server_uri, client_uri, contact_user, transport) VALUES (KZBRI, 'sip:189.84.133.135', 'sip:KZBRI@189.84.133.135', KZBRI, 'udp_transport');
INSERT INTO ps_endpoint_id_ips (id, endpoint, match) VALUES (KZBRI, KZBRI, '189.84.133.135');
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
      (endpoint, 'udp_transport', endpoint, endpoint, 'from-extensions', CONCAT(endpoint, ' ', '<', endpoint, '>'), 'pt_BR', 'no', 120, 'textmessages', 'yes', 'subscriptions', 'no', 'info', 1, 'all', 'ulaw');
    END LOOP;
    RETURN True;
  ELSE
    RETURN False;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION endpointsSipGenerate;

SELECT endpointsSipGenerate(7000, 30);
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
  i integer = initEndpoint + qttEndpoints;
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

SELECT endpointsWebGenerate(7000, 30);
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

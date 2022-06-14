import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import PbxContext from '../../../context/PbxContext';
import { accessLocalStorage, exportCreateEndpoints } from '../../../services';

import '../../../libs/bulma.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSquare } from '@fortawesome/free-solid-svg-icons';

function EndpointsCreate() {
  const getItensStateGlobal = useContext(PbxContext);
  const { toggleIsHidden, validCharactersPassword } = getItensStateGlobal;

  let url = window.location.href;
  url = url.split('/')[2];

  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [first, setFirst] = useState('');
  const [qtt, setQtt] = useState(0);
  const [password, setPassword] = useState('');
  const [transport, setTransport] = useState('');
  const [context, setContext] = useState('');
  const [language, setlanguage] = useState('');
  const [dtmf, setDtmf] = useState('');
  const [state, setState] = useState(0);
  const [codec, setCodec] = useState('');
  const [callGroup, setCallGroup] = useState('');
  const [pickupGroup, setPickupGroup] = useState('');
  const [nat, setNat] = useState('');

  const passwordRef = useRef(null);

  // const validCharactersPassword = new RegExp('[a-zA-Z0-9._:@!-]$');

  const handleChangeCharacters = () => {
    passwordRef.current.className = 'input is-danger';
    console.log('Length: ', password.length >= 6)
    const check = validCharactersPassword.test(password);
    console.log('Characters is valid: ', check)
  }

  const history = useHistory();

  const occ = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const keysAnalyseIsItemsEmpty = (obj) => {
    const myKeys = Object.keys(obj);
    const myValues = Object.values(obj);
    for (let index = 0; index < myKeys.length; index++) {
      const element = myValues[index];
      if (element === '' || element === 0) return false;
    }
    return true;
  };

  const sendDataEndpointsGenerate = async () => {
    const createItems = {
      type,
      first,
      qtt,
      password,
      transport,
      context,
      language,
      dtmf,
      state,
      codec,
      callGroup,
      pickupGroup,
      nat,
    };

    const analyse = keysAnalyseIsItemsEmpty(createItems);
    if(!analyse) {
      toggleIsHidden('#alert-create-endpoints');
      return
    };
    try {
      const alertAcitve = document.querySelector('#alert-create-endpoints').classList.value.split(' ');
      alertAcitve.forEach(element => {
        if(element === 'is-active') toggleIsHidden('#alert-create-endpoints');
      });
      const result = await exportCreateEndpoints(createItems);
      console.log('No error: ', result)
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const validateUserLogged = useCallback(async () => {
    const dataUser = await accessLocalStorage.getUserLocalStorage();
    const { user: { role } } = dataUser;
    if (!dataUser) return history.push('/');
    if (dataUser && role !== 'admin') return history.push('/home');
  }, []);

  useEffect(() => {
    validateUserLogged()
  }, [validateUserLogged]);

  return (
    <div>
      <div className="columns">
        <div className="column is-half is-offset-one-quarter has-text-centered">
          <strong className="is-size-3">ADICIONAR RAMAIS</strong>
          <hr className="dropdown-divider"/>
        </div>
      </div>
      <article id="alert-create-endpoints" className="column is-half is-offset-one-quarter message is-danger is-hidden">
        <div className="message-header">
          <p>Atenção!</p>
          <button className="delete" aria-label="delete" onClick={ () => toggleIsHidden('#alert-create-endpoints') }></button>
        </div>
        <div className="message-body">
          Não é possível gerar ramal com os campos abaixo não preenchidos.
          <br />
          Por favor, verifique os dados e clique novamente no botão <strong>Criar Ramais</strong> 
        </div>
      </article>
      <form onSubmit={ (e) =>  e.preventDefault() }>
        <div className="columns mx-2">
          <div className="column is-2 is-offset-5 field">
            <div className="control has-text-centered">
              <label className="radio">
                <input type="radio" name="type" value="SIP" onChange={(e) => setType(e.target.value)} /> <strong>SIP</strong>
              </label>
              <label className="radio ml-5">
                <input type="radio" name="type" value="WEB" onChange={(e) => setType(e.target.value)} /> <strong>WEB</strong>
              </label>
            </div>
          </div>
        </div>
        <div className="columns mx-2">
          <div className="column is-2 is-offset-3 field">
            <label className="label">Ramal Inicial
              <div className="control">
              <input className="input" id="initial" type="number" onChange={(e) => setFirst(e.target.value)} />
              <p className='has-text-danger is-size-7'>Apenas Números!</p>
            </div>
            </label>
          </div>
          <div className="field column is-2">
            <label className="label">Quantidade
              <div className="control">
              <input className="input" id="qtt" type="number" onChange={(e) => setQtt(e.target.value)} />
              <p className='has-text-danger is-size-7'>Apenas Números!</p>
            </div>
            </label>
          </div>
          <div className="field column is-2">
            <label className="label">Senha
              <div className="control">
              <input className="input" ref={ passwordRef } type="text" onChange={(e) => setPassword(e.target.value)} onBlur={(e) => handleChangeCharacters()} />
              <p className='has-text-danger is-size-7'>Senha muito curta (≥ 6)!</p>
              <p className='has-text-danger is-size-7'>Existem caracters inválidos!</p>
            </div>
            </label>
          </div>
        </div>
        <div className="columns mx-2">
          <div className="column is-2 is-offset-3 field">
          <label className="label">Protocolo
              <div className="control">
                <div className="select is-fullwidth">
                  <select className="select" onChange={(e) => setTransport(e.target.value)} >
                    <option value="">Selecione</option>
                    <option value="udp_transport">UDP</option>
                    <option value="tcp_transport">TCP</option>
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className="column is-2 field">
            <label className="label">DTMF
              <div className="control">
                <div className="select is-fullwidth">
                  <select className="select" onChange={(e) => setDtmf(e.target.value)} >
                    <option value="">Selecione</option>
                    <option value="rfc2833">RFC-2833</option>
                    <option value="info">INFO</option>
                    <option value="shortinfo">SHORTINFO</option>
                    <option value="inband">IN-BAND</option>
                    <option value="auto">AUTO</option>
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className="column is-2 field">
            <label className="label">Previlégios
              <div className="control">
                <div className="select is-fullwidth">
                  <select className="select" onChange={(e) => setContext(e.target.value)} >
                    <option value="">Selecione</option>
                    <option value="interno">Interno</option>
                    <option value="local-fixo">Local Fixo</option>
                    <option value="local-celular">Local Celular</option>
                    <option value="ddd-fixo">DDD Fixo</option>
                    <option value="ddd-celular">DDD Celular</option>
                  </select>
                </div>
              </div>
            </label>
          </div>
        </div>
        <div className="columns mx-2">
          <div className="column is-1 is-offset-3 field">
            <label className="label">Linguagem
              <div className="control">
                <div className="select is-fullwidth">
                  <select className="select" onChange={(e) => setlanguage(e.target.value)} >
                    <option value="">Sel...</option>
                    <option value="en">Inglês</option>
                    <option value="pt_BR">Português</option>
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className="column is-2 field">
            <label className="label">Codec
              <div className="control">
                <div className="select is-fullwidth">
                  <select className="select" onChange={(e) => setCodec(e.target.value)} >
                    <option value="">Selecione</option>
                    <option value="alaw">G.711a (ALAW)</option>
                    <option value="ulaw">G.711b (ULAW)</option>
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className="column is-1 field">
            <label className="label">NAT
              <div className="control">
                <div className="select is-fullwidth">
                  <select className="select" onChange={(e) => setNat(e.target.value)} >
                    <option value="">Sel...</option>
                    <option value="no">Não</option>
                    <option value="yes">Sim</option>
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className="column is-2 field">
            <label className="label">Ocupado em:
              <div className="control">
                <div className="select is-fullwidth">
                  <select className="select" onChange={(e) => setState(e.target.value)} >
                    <option value="">Selecione</option>
                    { occ.map((elem) => <option key={ elem } value={ elem }> { elem } </option>) }
                  </select>
                </div>
              </div>
            </label>
          </div>
        </div>
        <div className="columns mx-2">
          <div className="column is-3 is-offset-3 field">
            <label className="label">Grupo de Chamada
              <div className="control">
              <input className="input" id="call-group" type="text" onChange={(e) => setCallGroup(e.target.value)} />
              <p className='has-text-danger is-size-7'>Existem caracters inválidos!</p>
            </div>
            </label>
          </div>
          <div className="field column is-3">
            <label className="label">Grupo de Captura
              <div className="control">
              <input className="input" id="pickup-group" type="text" onChange={(e) => setPickupGroup(e.target.value)} />
              <p className='has-text-danger is-size-7'>Existem caracters inválidos!</p>
            </div>
            </label>
          </div>
        </div>
      </form>
      <div className="columns mt-3">
        <div className="field column mt-3 is-half is-2 is-offset-5 has-text-centered">
          <div className="control">
            <button className="button is-info is-fullwidth mt-3" type="submit" onClick={ () => sendDataEndpointsGenerate() }>
              <span className="icon">
                <FontAwesomeIcon icon={ faPhoneSquare } fixedWidth />
              </span>
              <span>
                CRIAR RAMAIS
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="field column is-half is-offset-one-quarter has-text-centered">
          <hr className="dropdown-divider"/>
        </div>
      </div>
    </div>
  );
}

export default EndpointsCreate;

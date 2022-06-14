import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import PbxContext from '../../../context/PbxContext';
import { accessLocalStorage, exportCreateEndpoints } from '../../../services';

import Loading from '../../../components/Loading/LoadingModule';

import '../../../libs/bulma.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSquare } from '@fortawesome/free-solid-svg-icons';

function EndpointsCreate() {
  const getItensStateGlobal = useContext(PbxContext);
  const { itemsEndpoints, toggleIsHidden, toggleIsChangeFormElements, validCharactersPassword, validCharactersTextAndNumbers } = getItensStateGlobal;

  let url = window.location.href;
  url = url.split('/')[2];

  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState({});

  const validateUserLogged = useCallback(async () => {
    const dataUser = await accessLocalStorage.getUserLocalStorage();
    const { user: { role } } = dataUser;
    if (!dataUser) return history.push('/');
    if (dataUser && role !== 'root') return history.push('/home');
    return setLoading(false);
  }, []);

  const valuesAnalyze = (name, value) => {
    if(name === 'first' || name === 'qtt' || name === 'state') {
      const checkValueIsNumber = isNaN(value) ? false : true;
      if(!checkValueIsNumber) return toggleIsChangeFormElements(`${name}-invalid-data`, 'has-text-danger is-size-7 is-active')
      return toggleIsChangeFormElements(`${name}-invalid-data`, 'has-text-danger is-size-7 is-hidden');
    };

    if(name === 'password') {
      const checkValueIsPassword = validCharactersPassword.test(value);
      if(!checkValueIsPassword) {
        return toggleIsChangeFormElements(`${name}-invalid-data`, 'has-text-danger is-size-7 is-active');
      };
      return toggleIsChangeFormElements(`${name}-invalid-data`, 'has-text-danger is-size-7 is-hidden');
    }

    if(name === 'callGroup'|| name === 'pickupGroup') {
      const checkValueIsPassword = validCharactersTextAndNumbers.test(value);
      if(!checkValueIsPassword) {
        return toggleIsChangeFormElements(`${name}-invalid-data`, 'has-text-danger is-size-7 is-active');
      };
      return toggleIsChangeFormElements(`${name}-invalid-data`, 'has-text-danger is-size-7 is-hidden');
    }
    return true;  
  };

  const handleChangeValues = (item) => {
    const { name, value } = item;
    const validateData = valuesAnalyze(name, value);
    if(validateData) {
      const auxValues = { ...values };
      auxValues[name] = value;
      setValues(auxValues);
    }
  };

  const sendDataEndpointsGenerate = async () => {
    const isItemsRequired = itemsEndpoints.split(',');
    const filteredProperties = isItemsRequired.filter((item) => !values.hasOwnProperty(item));
    if(filteredProperties.length > 0) {
      toggleIsHidden('#alert-create-endpoints');
      const changeVisibilityInputs = filteredProperties.map((name) => {
        const getInput = document.querySelector(`[name="${name}"]`);
        const memberClassList = getInput.classList.value;
        toggleIsChangeFormElements(name, `${memberClassList} is-danger`);
      });
      return;
    };
    
    setLoading(true);
    const getElementsForVerify = Object.keys(values);
    const isAllValueExists = getElementsForVerify.some((item) => Number(values[item]) === 0);
    if(isAllValueExists) return toggleIsChangeFormElements('alert-create-endpoints', 'column is-half is-offset-one-quarter message is-danger is-active');
    toggleIsChangeFormElements('alert-create-endpoints', 'is-hidden');
    const fetchEndpoints = await exportCreateEndpoints(values);
    const result = Object.keys(fetchEndpoints).length > 0 ? true : false;
    if(result) {
      setLoading(false);
      toggleIsChangeFormElements('create-form', 'is-hidden');
      toggleIsChangeFormElements('button-send-form', 'is-hidden');
      toggleIsChangeFormElements('success-create-endpoints', 'column is-half is-offset-one-quarter message is-info is-active');
      setTimeout(() => {
        return history.push('/config/ramal/lista');
      }, 3000);
    };
    setLoading(false);
    return toggleIsChangeFormElements('error-create-endpoints', 'column is-half is-offset-one-quarter message is-danger is-active');
  };

  useEffect(() => {
    validateUserLogged();
  }, [validateUserLogged]);

  return (
    <div>
      {
        loading ?
          <Loading />
        :
        <div>
          <div className="columns">
            <div className="column is-half is-offset-one-quarter has-text-centered">
              <strong className="is-size-3">ADICIONAR RAMAIS</strong>
              <hr className="dropdown-divider"/>
            </div>
          </div>
          <article id="alert-create-endpoints" name="alert-create-endpoints" className="column is-half is-offset-one-quarter message is-danger is-hidden">
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
          <article id="error-create-endpoints" name="error-create-endpoints" className="column is-half is-offset-one-quarter message is-danger is-hidden">
            <div className="message-header">
              <p>Erro!</p>
              <button className="delete" aria-label="delete" onClick={ () => toggleIsHidden('#error-create-endpoints') }></button>
            </div>
            <div className="message-body">
              Não foi possível criar os ramais!
              <br />
              Verifique se os ramais já existem!
            </div>
          </article>
          <article id="success-create-endpoints" name="success-create-endpoints" className="column is-half is-offset-one-quarter message is-info is-hidden">
            <div className="message-header">
              <p>Erro!</p>
              <button className="delete" aria-label="delete" onClick={ () => toggleIsHidden('#success-create-endpoints') }></button>
            </div>
            <div className="message-body">
              Ramais criados com <strong>sucesso</strong>!
            </div>
          </article>
          <form name="create-form" id="create-form" onSubmit={ (e) =>  e.preventDefault() }>
            <div className="columns mx-2">
              <div className="column is-2 is-offset-5 field">
                <div className="control has-text-centered">
                  <p><strong>Tipo de Ramal</strong></p>
                  <label className="radio">
                    <input type="radio" className='radio' name="type" value="SIP" onChange={(e) => handleChangeValues(e.target)} /> <strong>SIP</strong>
                  </label>
                  <label className="radio ml-5">
                    <input type="radio" className='radio' name="type" value="WEB" onChange={(e) => handleChangeValues(e.target)} /> <strong>WEB</strong>
                  </label>
                  <p name="type-invalid-data" className='has-text-danger is-size-7 is-hidden'>Selecione o tipo de ramal!</p>
                </div>
              </div>
            </div>
            <div className="columns mx-2">
              <div className="column is-2 is-offset-3 field">
                <label className="label">Ramal Inicial
                  <div className="control">
                  <input className="input" name="first" type="text" onChange={(e) => handleChangeValues(e.target)} />
                  <p name="first-invalid-data" className='has-text-danger is-size-7 is-hidden'>Caracteres inválidos!</p>
                </div>
                </label>
              </div>
              <div className="field column is-2">
                <label className="label">Quantidade
                  <div className="control">
                  <input className="input" name="qtt" type="text" onChange={(e) => handleChangeValues(e.target)} />
                  <p name="qtt-invalid-data" className='has-text-danger is-size-7 is-hidden'>Caracteres inválidos!</p>
                </div>
                </label>
              </div>
              <div className="field column is-2">
                <label className="label">Senha
                  <div className="control">
                  <input className="input" name="password" type="text" onBlur={(e) => handleChangeValues(e.target)} />
                  <p name="password-invalid-data" className='has-text-danger is-size-7 is-hidden'>Verifique o tamanho e se existem caracteres inválidos!</p>
                </div>
                </label>
              </div>
            </div>
            <div className="columns mx-2">
              <div className="column is-2 is-offset-3 field">
              <label className="label">Protocolo
                  <div className="control">
                    <div name="transport" className="select is-fullwidth">
                      <select className="select" name="transport" onChange={(e) => handleChangeValues(e.target)} >
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
                    <div name="dtmf" className="select is-fullwidth">
                      <select className="select" name="dtmf" onChange={(e) => handleChangeValues(e.target)} >
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
                    <div name="context" className="select is-fullwidth">
                      <select className="select" name="context" onChange={(e) => handleChangeValues(e.target)} >
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
                    <div name="language" className="select is-fullwidth">
                      <select className="select" name="language" onChange={(e) => handleChangeValues(e.target)} >
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
                    <div name="codec" className="select is-fullwidth">
                      <select className="select" name="codec" onChange={(e) => handleChangeValues(e.target)} >
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
                    <div name="nat" className="select is-fullwidth">
                      <select className="select" name="nat" onChange={(e) => handleChangeValues(e.target)} >
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
                  <input className="input" name="state" type="text" onChange={(e) => handleChangeValues(e.target)} />
                  <p name="state-invalid-data" className='has-text-danger is-size-7 is-hidden'>Caracteres inválidos!</p>
                  </div>
                </label>
              </div>
            </div>
            <div className="columns mx-2">
              <div className="column is-3 is-offset-3 field">
                <label className="label">Grupo de Chamada
                  <div className="control">
                  <input className="input" name="callGroup" type="text" onChange={(e) => handleChangeValues(e.target)} />
                  <p name="callGroup-invalid-data" className='has-text-danger is-size-7 is-hidden'>Caracteres inválidos!</p>
                </div>
                </label>
              </div>
              <div className="field column is-3">
                <label className="label">Grupo de Captura
                  <div className="control">
                  <input className="input" name="pickupGroup" type="text" onChange={(e) => handleChangeValues(e.target)} />
                  <p name="pickupGroup-invalid-data" className='has-text-danger is-size-7 is-hidden'>Caracteres inválidos!</p>
                </div>
                </label>
              </div>
            </div>
          </form>
          <div id="button-send-form" name="button-send-form" className="columns mt-3">
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
      }
    </div>
  );
}

export default EndpointsCreate;

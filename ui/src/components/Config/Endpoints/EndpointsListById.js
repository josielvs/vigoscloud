import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { accessLocalStorage, exportSelectEndpointsById, exportUpdateEndpoints } from '../../../services';

import PbxContext from '../../../context/PbxContext';
import '../../../libs/bulma.min.css';

import Loading from '../../../components/Loading/LoadingModule';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

function EndpointsListById() {
  const getItensStateGlobal = useContext(PbxContext);
  const { toggleIsChangeFormElements, toggleIsHidden, itemsSelectedToEdit, validCharactersPassword, validCharactersTextAndNumbers } = getItensStateGlobal;

  let url = window.location.href;
  url = url.split('/')[2];

  const [loading, setLoading] = useState(true);
  const [phones, setPhones] = useState([]);
  const [endpointsSelected, setEndpointsSelected] = useState([]);
  const [values, setValues] = useState({});
  const [initialValues, setInitialValues] = useState({});

  const history = useHistory();

  const handleChangeValues = (item) => {
    const { name, value } = item;
    const validateData = valuesAnalyze(name, value);
    if(validateData) {
      const auxValues = { ...values };
      auxValues[name] = value;
      setValues(auxValues);
    }
  };

  const validateUserLogged = useCallback(async () => {
    const dataUser = await accessLocalStorage.getUserLocalStorage();
    const { user: { role } } = dataUser;
    if (!dataUser) return history.push('/');
    if (dataUser && role !== 'root') return history.push('/home');

    const endpointsList = await exportSelectEndpointsById(itemsSelectedToEdit);
    if(endpointsList <= 0) return history.push('/config/ramal/lista');
    const elements = endpointsList.map((element, index) => {
      const endpointUpdate = element.split(',');
      const result = {
        endpoint: endpointUpdate[0],
        password: endpointUpdate[1],
        transport: endpointUpdate[2],
        context: endpointUpdate[3],
        language: endpointUpdate[4],
        codec: endpointUpdate[5],
        dtmf: endpointUpdate[6],
        state: endpointUpdate[7],
        callGroup: endpointUpdate[8],
        pickupGroup: endpointUpdate[9],
        nat: endpointUpdate[10],
      };
      return result;
    });
    setPhones(elements);
    setLoading(false)
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
      const checkValueIsValid = validCharactersTextAndNumbers.test(value);
      if(!checkValueIsValid || value === '') {
        return toggleIsChangeFormElements(`${name}-invalid-data`, 'has-text-danger is-size-7 is-active');
      };
      return toggleIsChangeFormElements(`${name}-invalid-data`, 'has-text-danger is-size-7 is-hidden');
    }
    return true;
  };

  const sendDataEndpointsUpdate = async () => {
    const objectForUpdate = { elements: itemsSelectedToEdit, ...values };
    const fetchItensUpdate = await exportUpdateEndpoints(objectForUpdate);
    console.log(fetchItensUpdate);
  };

  useEffect(() => {
    validateUserLogged()
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
              <strong className="is-size-3">LISTA DE RAMAIS</strong>
              <hr className="dropdown-divider"/>
            </div>
          </div>
          <article id="alert-endpoints-not-delete" name="alert-endpoints-not-delete" className="column is-half is-offset-one-quarter message is-danger is-hidden">
            <div className="message-header">
              <p>Atenção!</p>
              <button className="delete" aria-label="delete" onClick={ () => toggleIsHidden('#alert-endpoints-not-delete') }></button>
            </div>
            <div className="message-body">
              Não foi possível deletar os ramais selecionados.
            </div>
          </article>
          <article id="alert-endpoints-not-selected" name="alert-endpoints-not-selected" className="column is-half is-offset-one-quarter message is-danger is-hidden">
            <div className="message-header">
              <p>Atenção!</p>
              <button className="delete" aria-label="delete" onClick={ () => toggleIsHidden('#alert-endpoints-not-selected') }></button>
            </div>
            <div className="message-body">
              Nenhum ramal selecionado!
            </div>
          </article>
          <article id="alert-create-endpoints" name="alert-create-endpoints" className="column is-half is-offset-one-quarter message is-warning is-hidden">
            <div className="message-header">
              <p>Atenção!</p>
              <button className="delete" aria-label="delete" onClick={ () => toggleIsHidden('#alert-create-endpoints') }></button>
            </div>
            <div className="message-body">
              Ramais deletados com sucesso!
            </div>
          </article>
          <div className="columns">
            <div className="column is-half is-offset-one-quarter has-text-centered">
              {
                phones.map((item) => <span className="tag is-medium is-primary mx-2 py-3" key={ item.endpoint }>{ item.endpoint }</span>)
              }
            </div>
          </div>
          <form name="create-form" id="create-form" onSubmit={ (e) =>  e.preventDefault() }>
            <div className="columns mx-2">
              <div className="field column is-offset-3 is-2">
                <label className="label">Senha
                  <div className="control">
                  <input className="input" name="password" type="text" onBlur={(e) => handleChangeValues(e.target)} />
                  <p name="password-invalid-data" className='has-text-danger is-size-7 is-hidden'>Verifique o tamanho e se existem caracteres inválidos!</p>
                </div>
                </label>
              </div>
              <div className="column is-1 field">
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
              <div className="column is-1 field">
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
          <div className="columns">
            <div className="column is-half is-offset-one-quarter has-text-centered">
                <button className="button is-info is-half mx-3 px-6" type="submit" onClick={ () => sendDataEndpointsUpdate() }>
                      <span className="icon">
                        <FontAwesomeIcon icon={ faSave } fixedWidth />
                      </span>
                      <span>
                        Salvar
                      </span>
                </button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default EndpointsListById;

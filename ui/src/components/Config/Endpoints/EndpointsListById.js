import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import '../../../libs/bulma.min.css';
import PbxContext from '../../../context/PbxContext';
import { accessLocalStorage, exportSelectEndpointsById, valuesAnalyze, changeViewForms, exportUpdateEndpoints } from '../../../services';
import Loading from '../../../components/Loading/LoadingModule';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

function EndpointsListById() {
  const getItensStateGlobal = useContext(PbxContext);
  const { toggleIsHidden, itemsSelectedToEdit } = getItensStateGlobal;

  let url = window.location.href;
  url = url.split('/')[2];

  const [loading, setLoading] = useState(true);
  const [phones, setPhones] = useState([]);
  const [values, setValues] = useState({});
  const [validate, setValidate] = useState({});

  const { changeBorderImputToRedOrNormal, changeVisibityMessages} = changeViewForms;

  const history = useHistory();

  const fetchEndpoints = async () => {
    const endpointsList = await exportSelectEndpointsById(itemsSelectedToEdit);
    if(endpointsList <= 0) return history.push('/config/ramal/lista');
    if(endpointsList === undefined) setLoading(true);
    const elements = endpointsList.map((element) => {
      const endpointCreate = element.split(',');
      const result = {
        endpoint: endpointCreate[0],
        password: endpointCreate[1],
        transport: endpointCreate[2],
        context: endpointCreate[3],
        language: endpointCreate[4],
        codec: endpointCreate[5],
        dtmf: endpointCreate[6],
        state: endpointCreate[7],
        callGroup: endpointCreate[8],
        pickupGroup: endpointCreate[9],
        nat: endpointCreate[10],
      };
      return result;
    });
    setPhones(elements);
    setLoading(false);
    return true;
  };

  const validateUserLogged = useCallback(async () => {
    const dataUser = await accessLocalStorage.getUserLocalStorage();
    const { user: { role } } = dataUser;
    if (!dataUser) return history.push('/');
    if (dataUser && role !== 'root') return history.push('/home');

    const elements = await fetchEndpoints();
    return;
  }, []);

  const changeScreen = (check, name) => {
    changeBorderImputToRedOrNormal(check, name);
    changeVisibityMessages(check, `${name}-invalid-data`);
  };

  const handleChangeDataAnalyze = (name, value) => {
    const { checkNumber, checkPassword, isTripleChar } = valuesAnalyze;

    if(name === 'first' || name === 'qtt' || name === 'state') {
      const checkValueIsNumber = checkNumber(value);
      changeScreen(checkValueIsNumber, name);
      return checkValueIsNumber;
    };

    if(name === 'password') {
      const passwordIsValid = checkPassword(value);
      changeScreen(passwordIsValid, name);
      return passwordIsValid;
    }

    if(name === 'callGroup'|| name === 'pickupGroup') {
      const checkValueIsCharacters = isTripleChar(value);
      changeScreen(checkValueIsCharacters, name);
      return checkValueIsCharacters;
    }
  };

  const handleChangeValues = (item) => {
    const { name, value } = item;

    const itemStatus = handleChangeDataAnalyze(name, value);
    setValidate((prevState) => prevState, validate[name] = itemStatus === undefined  ? true : itemStatus);
    setValues((prevState) => prevState, values[name] = value )
    if(Object.keys(validate).length >= 13) Object.values(validate).includes(false) ? setDisable(true) : setDisable(false);
    return;
  };

  const sendDataEndpointsUpdate = async () => {
    const objectForUpdate = { elements: itemsSelectedToEdit, ...values };
    const fetchItensUpdate = await exportUpdateEndpoints(objectForUpdate);
    history.push('/config/ramal/lista');
    return;
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
          <div className="table-container is-flex-wrap-wrap has-text-centered">
            <table id="tableCalls" className="table is-hoverable is-striped is-half column is-offset-3">  
                <thead>
                    <tr className='is-size-7 has-text-centered'>
                    <th className='th-interactive is-clickable' scope="col">Ramal</th>
                    <th className='th-interactive is-clickable' scope="col">Senha</th>
                    <th className='th-interactive is-clickable' scope="col">Protocolo</th>
                    <th className='th-interactive is-clickable' scope="col">Previlégios</th>
                    <th scope="col">DTMF</th>
                    <th className='th-interactive is-clickable' scope="col">Linguagem</th>
                    <th className='th-interactive is-clickable' scope="col">Codec</th>
                    <th className='th-interactive is-clickable' scope="col">NAT</th>
                    <th scope="col" >Ocupado</th>
                    <th className='th-interactive is-clickable' scope="col">Grupo Atendedor</th>
                    <th className='th-interactive is-clickable' scope="col">Grupo de Captura</th>
                    </tr>
                </thead>
                {
                  phones.map((phone) => {
                    const { endpoint, password, transport, context, language, codec, dtmf, state, callGroup, pickupGroup, nat } = phone;
                    return (<tbody key={ endpoint }>
                      <tr className='is-size-7 has-text-centered'>
                        <td>{endpoint}</td>
                        <td>{password}</td>
                        <td>{transport}</td>
                        <td>{context}</td>
                        <td>{dtmf}</td>
                        <td>{language}</td>
                        <td>{codec}</td>
                        <td>{nat}</td>
                        <td>{state}</td>
                        <td>{callGroup}</td>
                        <td>{pickupGroup}</td>
                      </tr>
                    </tbody>)
                  })
                }
            </table>
          </div>
          <hr className="mb-6 px-3"/>
          {/* <div className="columns">
            <div className="column is-half is-offset-one-quarter has-text-centered">
              {
                phones.map((item) => <span className="tag is-medium is-primary mx-2 py-3" key={ item.endpoint }>{ item.endpoint }</span>)
              }
            </div>
          </div> */}
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

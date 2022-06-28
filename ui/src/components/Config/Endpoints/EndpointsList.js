import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { accessLocalStorage, exportSelectAllEndpoints, exportDeleteEndpoints } from '../../../services';

import PbxContext from '../../../context/PbxContext';
import '../../../libs/bulma.min.css';

import Loading from '../../../components/Loading/LoadingModule';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

function EndpointsList() {
  const getItensStateGlobal = useContext(PbxContext);
  const { toggleIsChangeFormElements, toggleIsHidden, setItemsSelectedToEdit } = getItensStateGlobal;

  let url = window.location.href;
  url = url.split('/')[2];

  const [loading, setLoading] = useState(true);
  const [phones, setPhones] = useState([]);
  const [endpointsSelected, setEndpointsSelected] = useState([]);

  const history = useHistory();

  const validateUserLogged = useCallback(async () => {
    const dataUser = await accessLocalStorage.getUserLocalStorage();
    const { user: { role } } = dataUser;
    if (!dataUser) return history.push('/');
    if (dataUser && role !== 'root') return history.push('/home');

    const endpointsList = await exportSelectAllEndpoints();
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
  }, [phones]);

  const handleChangeSelectedEndpoints = (element) => {
    const existsEndpoints =  endpointsSelected.map((element) => element.toString());
    const elementsForSend = [...existsEndpoints, element.toString()]
    setEndpointsSelected(elementsForSend);
    return;
  };

  const handleClickDelete = async () => {
    const sendDeleteEndpoints = await exportDeleteEndpoints(endpointsSelected);
    if(sendDeleteEndpoints.length === undefined) return toggleIsChangeFormElements('alert-endpoints-not-delete', 'column is-half is-offset-one-quarter message is-danger is-active');
    if(endpointsSelected.length <= 0) return toggleIsChangeFormElements('alert-endpoints-not-selected', 'column is-half is-offset-one-quarter message is-danger is-active');
    return;
  };

  const handleClickUpdate = async () => {
    if(endpointsSelected.length <= 0) return toggleIsChangeFormElements('alert-endpoints-not-selected', 'column is-half is-offset-one-quarter message is-danger is-active');
    setItemsSelectedToEdit(endpointsSelected);
    return history.push('/config/ramal/lista-id');
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
          <div className="table-container is-flex-wrap-wrap">
            <table id="tableCalls" className="table is-hoverable is-striped is-fullwidth">  
                <thead>
                    <tr className='is-size-7 has-text-centered'>
                    <th className='th-interactive is-clickable' scope="col"></th>
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
                        <td><input type="checkbox" value={endpoint} onClick={ (e) => handleChangeSelectedEndpoints(e.target.value)}/></td>
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
          <div className="columns">
            <div className="column is-half is-offset-one-quarter has-text-centered">
                <button className="button is-info is-half mx-3 px-6" type="submit" onClick={ () => handleClickUpdate() }>
                      <span className="icon">
                        <FontAwesomeIcon icon={ faPen } fixedWidth />
                      </span>
                      <span>
                        Alterar
                      </span>
                </button>
                <button className="button is-danger is-half mx-3 px-6" type="submit" onClick={ () => handleClickDelete() }>
                      <span className="icon">
                        <FontAwesomeIcon icon={ faTrash } fixedWidth />
                      </span>
                      <span>
                        Deletar
                      </span>
                </button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default EndpointsList;

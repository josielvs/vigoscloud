import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { accessLocalStorage, exportSelectAllTrunks } from '../../../services';

import PbxContext from '../../../context/PbxContext';
import '../../../libs/bulma.min.css';

import Loading from '../../Loading/LoadingModule';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faBook, faPhoneSquareAlt } from '@fortawesome/free-solid-svg-icons';

function EndpointsList() {
  const getItensStateGlobal = useContext(PbxContext);
  const { toggleIsChangeFormElements, toggleIsHidden, setItemsSelectedToEdit } = getItensStateGlobal;

  let url = window.location.href;
  url = url.split('/')[2];

  const [loading, setLoading] = useState(true);
  const [phones, setPhones] = useState(() => []);
  const [endpointsSelected, setEndpointsSelected] = useState([]);
  const [disable, setDisable] = useState(true);

  const history = useHistory();

  const fetchEndpoints = async () => {
    const trunksList = await exportSelectAllTrunks();
    // if(trunksList === undefined) setLoading(true);
    const elements = trunksList.map((element) => element.trunksselect);
    setPhones(elements);
    setLoading(false);
    console.log(trunksList)
    return true;
  };

  const validateUserLogged = useCallback(async () => {
    const dataUser = accessLocalStorage.getUserLocalStorage();
    const { user: { role } } = dataUser;
    if (!dataUser) return history.push('/');
    if (dataUser && role !== 'root') return history.push('/home');

    await fetchEndpoints();
    return;
  }, [phones]);

  // const handleChangeSelectedEndpoints = (element) => {
  //   setEndpointsSelected((prevState) => {
  //     const onlineState = prevState.includes(element) ? [...prevState.filter((e) => e !== element)] : [...prevState, element];
  //     onlineState.length > 0 ? setDisable(false) : setDisable(true)
  //     return onlineState;
  //   });
  // };

  // const handleClickDelete = async () => {
  //   const sendDeleteEndpoints = await exportDeleteEndpoints(endpointsSelected);
  //   if(sendDeleteEndpoints.length === undefined) {
  //     toggleIsHidden('#alert-confirm-endpoints-delete');
  //     return toggleIsChangeFormElements('alert-endpoints-not-delete', 'column is-half is-offset-one-quarter message is-danger is-active');
  //   };
  //   toggleIsHidden('#alert-confirm-endpoints-delete');
  //   setDisable(true);
  //   toggleIsHidden('#buttons');
  //   return;
  // };

  // const handleClickUpdate = async () => {
  //   setItemsSelectedToEdit(endpointsSelected);
  //   return history.push('/config/ramal/id');
  // };

  useEffect(() => {
    let cancel = false;
    
    if (cancel) return;
    validateUserLogged();

    return () => {
      cancel = true
    };
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
          <article id="alert-confirm-endpoints-delete" name="alert-confirm-endpoints-delete" className="column is-half is-offset-one-quarter message is-danger is-hidden">
            <div className="message-header">
              <p>Atenção!</p>
              <button className="delete" aria-label="delete" onClick={ () => toggleIsHidden('#alert-confirm-endpoints-delete') }></button>
            </div>
            <div className="message-body">
              Tem certeza que quer deletar os ramais selecionados?
            </div>
            <br />
          <div className="columns">
            <div className="column is-half is-offset-one-quarter has-text-centered">
              <button className="button is-danger is-half mx-3 px-6 is-offset-one-quarter" type="submit" onClick={ () => handleClickDelete() }>
                    <span className="icon">
                      <FontAwesomeIcon icon={ faTrash } fixedWidth />
                    </span>
                    <span>
                      Confirmar
                    </span>
              </button>
              <button className="button is-info is-half mx-3 px-6" type="submit" onClick={ () => toggleIsHidden('#alert-confirm-endpoints-delete') }>
                    <span className="icon">
                      <FontAwesomeIcon icon={ faTrash } fixedWidth />
                    </span>
                    <span>
                      Cancelar
                    </span>
              </button>
            </div>
          </div>
          </article>
          <div className="columns">
          <article class="panel is-info is-4 is-offset-4 column has-text-centered">
            <p class="panel-heading">
              Troncos
            </p>
            {
              phones.map((phone) => {
                return (
                  <a className="panel-block" key={ phone }>
                    <span className="panel-icon">
                      <FontAwesomeIcon icon={faPhoneSquareAlt} fixedWidth aria-hidden="true" className="ml-5"/>
                    </span>
                    <span className="ml-5">{ phone }</span>
                  </a>
                )
              })
            }
          </article>
          </div>
          <div className="columns">
            <div id="buttons" className="column is-half is-offset-one-quarter has-text-centered is-active">
                <button className="button is-info is-half mx-3 px-6" type="submit" onClick={ () => handleClickUpdate() } disabled={ disable }>
                      <span className="icon">
                        <FontAwesomeIcon icon={ faPen } fixedWidth />
                      </span>
                      <span>
                        Alterar
                      </span>
                </button>
                <button
                  className="button is-danger is-half mx-3 px-6"
                  type="submit"
                  onClick={ () => {
                    toggleIsHidden('#alert-confirm-endpoints-delete')
                    toggleIsHidden('#buttons')
                    }}
                  disabled={ disable }
                >
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

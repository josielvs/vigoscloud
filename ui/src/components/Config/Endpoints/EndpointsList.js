import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { accessLocalStorage, exportCreateEndpoints } from '../../../services';

import PbxContext from '../../../context/PbxContext';
import '../../../libs/bulma.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSquare } from '@fortawesome/free-solid-svg-icons';

function EndpointsList() {
  const getItensStateGlobal = useContext(PbxContext);
  const { storageDataReport, setStorageDataReport, setEndpoints, verifySort } = getItensStateGlobal;

  let url = window.location.href;
  url = url.split('/')[2];

  const [loading, setLoading] = useState(true);

  const history = useHistory();

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
    <div className="mt-6">
      Lista de Ramais
    </div>
  );
}

export default EndpointsList;

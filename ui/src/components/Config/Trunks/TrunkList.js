import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { accessLocalStorage, exportSelectAllTrunks } from '../../services';

import Loading from '../../components/Loading/LoadingModule';
// import ChartsRecivedCalls from '../../components/Reports/ChartsRecivedCalls';

import '../../libs/bulma.min.css';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faDownload } from '@fortawesome/free-solid-svg-icons';

function Config() {
  // const getItensStateGlobal = useContext(PbxContext);
  // const { storageDataReport, setStorageDataReport, setEndpoints, verifySort } = getItensStateGlobal;

  let url = window.location.href;
  url = url.split('/')[2];

  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const validateUserLogged = useCallback(async () => {
    const dataUser = await accessLocalStorage.getUserLocalStorage();
    if (!dataUser) return history.push('/');
    setLoading(false)
    const getTrunks = await exportSelectAllTrunks();
    console.log(getTrunks);
  }, []);

  useEffect(() => {
    validateUserLogged()
  }, [validateUserLogged]);

  return (
    <div>
      {
        loading ?
          <Loading />
          :
          <>
            <div>CONFIG</div>
          </>
      }
    </div>
  );
}

export default Config;

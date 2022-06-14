import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import PbxContext from '../../context/PbxContext';
import { accessLocalStorage } from '../../services';
import Loading from '../../components/Loading/LoadingModule';
import EndpointsCreate from '../../components/Config/Endpoints/EndpointsCreate';

import '../../libs/bulma.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

function Config() {
  const getItensStateGlobal = useContext(PbxContext);
  const { componentConfigIsUp, toggleIsHidden } = getItensStateGlobal;

  const [loading, setLoading] = useState(true);

  const [notification, setNotification] = useState(false);

  const history = useHistory();

  const validateUserLogged = useCallback(async () => {
    const dataUser = await accessLocalStorage.getUserLocalStorage();
    if (!dataUser) return history.push('/');

    
    console.log(componentConfigIsUp)

    setLoading(false)
  }, []);

  useEffect(() => {
    validateUserLogged();
  }, [validateUserLogged]);

  return (
    <div>
      {
        loading ?
          <Loading />
          :
          <div className='columns card mt-5 mx-1'>
          </div>
      }
    </div>
  );
}

export default Config;

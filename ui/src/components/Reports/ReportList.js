import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReportTable from './ReportTable';
import NoDataLoad from './NoDataLoad';
import PbxContext from '../../context/PbxContext'
import { accessLocalStorage } from '../../services';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';

const ReportList = ({ callsList }) => {
  const getItensStateGlobal = useContext(PbxContext);
  const { storageDataReport, storageDataReportList } = getItensStateGlobal;

  const [userDbLocal, setUserDbLocal] = useState({});

  const getUserDataLocal = async () => {
    const dataUser = await accessLocalStorage.getUserLocalStorage(); 
    const { user } = dataUser;
    setUserDbLocal(user);
    return;
  };


  useEffect(() => {
    getUserDataLocal();
  }, []);

  return storageDataReport && storageDataReport === [] ? { NoDataLoad } : (
    <div className='mt-5 pt-5 my-3'>
      <div className="table-container is-flex-wrap-wrap">
        <table id="tableCalls" className="table is-hoverable is-striped is-fullwidth">
            <thead>
                <tr className='is-size-7'>
                <th scope="col">Data</th>
                <th scope="col">Origem</th>
                <th scope="col">Origem Secundaria</th>
                {/* <th scope="col">Destino</th> */}
                <th scope="col">Setor</th>
                <th scope="col">Destino</th>
                <th scope="col">Status</th>
                <th scope="col">Tempo Espera</th>
                <th scope="col">Total da Ligação</th>
                <th scope="col">Tipo</th>
                {/* <th scope="col">Id</th>
                <th scope="col">Sequencia</th> */}
                <th scope="col">Gravação</th>
                </tr>
            </thead>
            {
              callsList .map((call, index) => <ReportTable key={ index } call={ call } />)
            }
        </table>
      </div>
    </div>
  )
}

export default ReportList;

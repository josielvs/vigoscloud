import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReportTable from './ReportTable';
import NoDataLoad from './NoDataLoad';
import PbxContext from '../../context/PbxContext'
import { accessLocalStorage, fetchDataReportList } from '../../services';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';

const ReportList = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { storageDataReport, storageDataReportToList } = getItensStateGlobal;

  const [userDbLocal, setUserDbLocal] = useState({});
  const [firstPages, setFirstPages] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage, setPerPage] = useState(30);
  const [page, setPage] = useState(1);
  const [callsReceivedRows, setCallsReceivedRows] = useState(0);

  const getUserDataLocal = async () => {
    const dataUser = await accessLocalStorage.getUserLocalStorage(); 
    const { user } = dataUser;
    setUserDbLocal(user);
    return;
  };

  const controlPagination = () => {
    const controls = {
      next() {
        setPage(page + 1);
        if(page > totalPage) setPage(page - 1);
      },
      prev() {
        setPage(page - 1);
        if(page < 1) setPage(page + 1)
      },
      goTo() {},
    }
  };
  controlPagination()


  const getCallsList = async () => {
    const rows = await fetchDataReportList(storageDataReportToList);
    setCallsReceivedRows(rows);

    const rowsLength = rows.length;
    setTotalPages(Math.ceil(rowsLength / perPage));

    // {
    //   dateStart: startDate,
    //   dateStop: endDate,
    //   hourStart: `${startHour}:00:00`,
    //   hourStop: `${endHour}:59:59`,
    //   sector: sectorLocal,
    //   getEndpoint: endpointLocal,
    //   telNumber: phoneNumberLocal,
    //   getProtocol: protocolLocal,
    //   statusCall: statusCallLocal,
    //   typeRecOrEfet: typeCallsLocal,
    //   limit: 30,
    //   offset: 0,
    // }
  };

  useEffect(() => {
    getUserDataLocal();
    getCallsList();
  }, []);

  return storageDataReport && storageDataReport === [] ? { NoDataLoad } : (
    <div className='mx-5 my-3'>
      <div className="table-container is-flex-wrap-wrap">
        <table id="tableCalls" className="table is-hoverable is-striped is-fullwidth">
            <thead>
                <tr>
                <th scope="col">Data</th>
                <th scope="col">Ligação De</th>
                <th scope="col">Ligação Para</th>
                <th scope="col">Status da Ligação</th>
                <th scope="col">Tipo</th>
                <th scope="col">Total da Ligação</th>
                <th scope="col">Tempo Em Linha</th>
                <th scope="col">Protocolo</th>
                <th scope="col">Gravação</th>
                </tr>
            </thead>
            {
              
            }
        </table>
      </div>
      <div className='columns is-centered'>
        <div className='column is-half'>
          <nav className="pagination is-small is-centered" role="navigation" aria-label="pagination">
            <Link to='' className="pagination-previous"> Anterior </Link>
            <Link to='' className="pagination-next"> Próxima </Link>
            <ul className="pagination-list">
              <li><Link to="" className="pagination-link" aria-label="Goto page 1">1</Link></li>
              <li><span className="pagination-ellipsis">&hellip;</span></li>
              <li><Link to="" className="pagination-link" aria-label="Goto page 45">45</Link></li>
              <li><Link to="" className="pagination-link is-current" aria-label="Page 46" aria-current="page">46</Link></li>
              <li><Link to="" className="pagination-link" aria-label="Goto page 47">47</Link></li>
              <li><span className="pagination-ellipsis">&hellip;</span></li>
              <li><Link to="" className="pagination-link" aria-label="Goto page 86">86</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default ReportList;

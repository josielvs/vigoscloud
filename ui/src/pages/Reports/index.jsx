import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PbxContext from '../../context/PbxContext';
import { fetchEndpoints, accessLocalStorage, fetchDataReport, fetchDataReportList } from '../../services';
import ChartsRecivedCalls from '../../components/Reports/ChartsRecivedCalls';
import ReportList from '../../components/Reports/ReportList';
import ChartsSendCalls from '../../components/Reports/ChartsSendCalls';
import ChartBySector from '../../components/Reports/ChartBySector';
import ChartCallsStatusGlobal from '../../components/Reports/ChartCallsStatusGlobal';
import ChartCallsStatusByTime from '../../components/Reports/ChartCallsStatusByTime';
import ChartCallsStatusIntAndExt from '../../components/Reports/ChartCallsStatusIntAndExt';
import TableReceivedCalls from '../../components/Reports/TableReceivedCalls';
import TableSentCalls from '../../components/Reports/TableSentCalls';
import FilterReportsCalls from '../../components/Reports/FilterReportsCalls';
import Pagination from '../../components/Reports/Pagination';
import Loading from '../../components/Loading/LoadingModule';

import '../../libs/bulma.min.css';

function Reports() {
  const getItensStateGlobal = useContext(PbxContext);
  const { setStorageDataReport, setEndpoints, setStorageDataReportList } = getItensStateGlobal;
  
  const [loading, setLoading] = useState(true);

  const [callsReceived, setCallsReceived] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [callsPerPage, setCallsPerPage] = useState(25);

  const history = useHistory();

  const validateUserLogged = useCallback(async () => {
    const dataUser = await accessLocalStorage.getUserLocalStorage();
    if (!dataUser) return history.push('/');

    var today = new Date();
    const todayFull = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const localFetchDataReport = await fetchDataReport(
      {
        dateStart: todayFull,
        dateStop: todayFull,
        hourStart: '00:00:00',
        hourStop: '23:59:59',
        sector: '',
        getEndpoint: '',
        telNumber: '',
        getProtocol: '',
      });
    setStorageDataReport(localFetchDataReport);

    const localFetchDataReportList = await fetchDataReportList({
        dateStart: todayFull,
        dateStop: todayFull,
        hourStart: '00:00:00',
        hourStop: '23:59:59',
        sector: '',
        getEndpoint: '',
        telNumber: '',
        getProtocol: '',
        statusCall: '',
        typeRecOrEfet: '',
        limit: 5000,
        offset: 0,
      });
      setCallsReceived(localFetchDataReportList);

    const localFetchEndpoints = await fetchEndpoints();
    setEndpoints(localFetchEndpoints);

    if (localFetchDataReport || !Error) setLoading(false);
  }, [setStorageDataReport]);

  const indexOfLastCall = currentPage * callsPerPage;
  const indexofFirstCall = indexOfLastCall - callsPerPage;
  const currentCalls = callsReceived.slice(indexofFirstCall, indexOfLastCall);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const getAllDataDb = (list) => {
    setCallsReceived(list);
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
          <>
          <div className="columns mx-2">
            <ChartsRecivedCalls />
            <ChartsSendCalls />
          </div>
          <hr className="m-0 p-0"/>
          <div className="columns mx-2">
            <ChartCallsStatusGlobal />
            <ChartBySector />
          </div>
          <hr className="m-0 p-0"/>
          <div className="columns mx-2">
            <ChartCallsStatusByTime />
            <ChartCallsStatusIntAndExt />
          </div>
          <div className="columns mx-2">
            <TableReceivedCalls />
            <TableSentCalls />
          </div>
          <hr className="m-0 p-0"/>
          <hr className="m-0 p-0"/>
          <FilterReportsCalls getAllDataDb={getAllDataDb} page={ setCurrentPage } />
          <ReportList callsList={currentCalls} />
          <Pagination callsPerPage={callsPerPage} totalCalls={callsReceived.length} paginate={paginate} currentPage={currentPage}/>
          </>
      }
    </div>
  );
}

export default Reports;

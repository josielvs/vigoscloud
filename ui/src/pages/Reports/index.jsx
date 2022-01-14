import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PbxContext from '../../context/PbxContext';
import { fetchEndpoints, accessLocalStorage, fetchDataReport } from '../../services';
import ChartsRecivedCalls from '../../components/Reports/ChartsRecivedCalls';
import ReportList from '../../components/Reports/ReportList';
import ChartsSendCalls from '../../components/Reports/ChartsSendCalls';
import ChartBySector from '../../components/Reports/ChartBySector';
import ChartCallsStatusGlobal from '../../components/Reports/ChartCallsStatusGlobal';
import ChartCallsStatusByTime from '../../components/Reports/ChartCallsStatusByTime';
import ChartCallsStatusIntAndExt from '../../components/Reports/ChartCallsStatusIntAndExt';
import TableReceivedCalls from '../../components/Reports/TableReceivedCalls';
import TableSentCalls from '../../components/Reports/TableSentCalls';
// import ChartCallsStatusBySectorAndTime from '../../components/Reports/ChartCallsStatusBySectorAndTime';
import FilterReportsCalls from '../../components/Reports/FilterReportsCalls';
import Loading from '../../components/Loading/LoadingModule';

import '../../libs/bulma.min.css';

function Reports() {
  const [loading, setLoading] = useState(true);
  const getItensStateGlobal = useContext(PbxContext);
  const { setStorageDataReport, setEndpoints } = getItensStateGlobal;

  const history = useHistory();

  const validateUserLogged = async () => {
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
    setStorageDataReport(localFetchDataReport)

    const localFetchEndpoints = await fetchEndpoints();
    setEndpoints(localFetchEndpoints);

    if (localFetchDataReport || !Error) setLoading(false);
  };

  useEffect(() => {
    validateUserLogged()
  }, [])

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
            <ChartCallsStatusIntAndExt />
          </div>
          <hr className="m-0 p-0"/>
          <div className="columns mx-2">
            <ChartCallsStatusGlobal />
            <ChartBySector />
            <ChartCallsStatusByTime />
          </div>
          <hr className="m-0 p-0"/>
          <div className="columns mx-2">
              <TableReceivedCalls />
              <TableSentCalls />
          </div>
          <hr className="m-0 p-0"/>
          {/* <FilterReportsCalls />
          <ReportList /> */}
          </>
      }
    </div>
  );
}

export default Reports;

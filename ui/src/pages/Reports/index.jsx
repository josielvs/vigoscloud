import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PbxContext from '../../context/PbxContext';
import { fetchEndpoints, accessLocalStorage, fetchDataReport, fetchDataReportList, fetchRowsChartSectors } from '../../services';
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
  const { setStorageDataReport, setEndpoints, verifySort } = getItensStateGlobal;

  var today = new Date();
  const todayFull = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [loading, setLoading] = useState(true);

  const [notification, setNotification] = useState(false);
  const [startDate, setStartDate] = useState(todayFull);
  const [endDate, setEndDate] = useState(todayFull);
  const [startHour, setStartHour] = useState(0);
  const [endHour, setEndHour] = useState(23);
  const [sectorLocal, setSectorLocal] = useState('');
  const [endpointLocal, setEndpointLocal] = useState('');
  const [sectorDbLocal, setSectorDbLocal] = useState([]);
  const [statusCallLocal, setStatusCallLocal] = useState('');
  const [protocolLocal, setProtocolLocal] = useState('');
  const [phoneNumberLocal, setPhoneNumberLocal] = useState('');
  const [typeCallsLocal, setTypeCallsLocal] = useState('');

  const [callsReceived, setCallsReceived] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [callsPerPage, setCallsPerPage] = useState(25);
  const [sortElements, setSortElements] = useState({ key: '', direction: 'direction'});

  const history = useHistory();

  const getDataReportDb = async () => {
    const data = await fetchDataReport(
      {
        dateStart: startDate,
        dateStop: endDate,
        hourStart: `${startHour}:00:00`,
        hourStop: `${endHour}:59:59`,
        sector: sectorLocal,
        getEndpoint: endpointLocal,
        telNumber: phoneNumberLocal,
        getProtocol: protocolLocal,
      });
    return data; 
  };

  const getReportRowsFiltred = async () => {
    const rows =  await fetchDataReportList({
      dateStart: startDate,
      dateStop: endDate,
      hourStart: `${startHour}:00:00`,
      hourStop: `${endHour}:59:59`,
      sector: sectorLocal,
      getEndpoint: endpointLocal,
      telNumber: phoneNumberLocal,
      getProtocol: protocolLocal,
      statusCall: statusCallLocal,
      typeRecOrEfet: typeCallsLocal,
      limit: 5000,
      offset: 0,
    });
  return rows;
  };

  const validateUserLogged = useCallback(async () => {
    const dataUser = await accessLocalStorage.getUserLocalStorage();
    if (!dataUser) return history.push('/');

    const localFetchDataReport = await getDataReportDb();
    setStorageDataReport(localFetchDataReport);

    const getRows = await getReportRowsFiltred();
    setCallsReceived(getRows);

    const localFetchEndpoints = await fetchEndpoints();
    setEndpoints(localFetchEndpoints);

    const verifyDataReports = localFetchDataReport.hasOwnProperty('volumeEndpointsReceivedAnswered');
    const verifyEndpoints = localFetchEndpoints[0];

    if(verifyDataReports && verifyEndpoints) setLoading(false);
  }, [setStorageDataReport]);

  const fecthDataFilterCurrent = async () => {
    if (!startDate || !endDate) return getStatusNotification(true);
    const localFetchDataReport = await getDataReportDb();
    setStorageDataReport(localFetchDataReport);

    const getRows = await getReportRowsFiltred();
    setCallsReceived(getRows);
  };

  const getReportRowsFiltredChartSectors = async (sector, status) => {
    const rows =  await fetchRowsChartSectors({
      dateStart: startDate,
      dateStop: endDate,
      hourStart: `${startHour}:00:00`,
      hourStop: `${endHour}:59:59`,
      sector: sector,
      getEndpoint: endpointLocal,
      statusCall: status,
      limit: 10000,
      offset: 0,
    });
    setCallsReceived(rows);
    return rows;
  };

  const indexOfLastCall = currentPage * callsPerPage;
  const indexofFirstCall = indexOfLastCall - callsPerPage;
  const currentCalls = callsReceived.length > 0 ? callsReceived.slice(indexofFirstCall, indexOfLastCall) : [];
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const getAllDataDb = (list) => setCallsReceived(list);

  // const sortedCalls = useCallback((sortedField) => {
  //   if (sortedField !== null) {
  //     const sortedCallsList = callsReceived.sort((a, b) => {
  //       if (a[sortedField] < b[sortedField]) {
  //         return -1;
  //       }
  //       if (a[sortedField] > b[sortedField]) {
  //         return 1;
  //       }
  //       return 0;
  //     });
  //     console.log(sortedCallsList);
  //     setSortElementName(sortedField);
  //     setCallsReceived(sortedCallsList);
  //   }
  //   return sortedField
  // }, [callsReceived]);

  useMemo(() => {
    let sortableItems = [...callsReceived];
    if (sortElements !== null) {
      sortableItems.sort((a, b) => {
        if(sortElements.key === 'duracao' && sortElements.direction === 'ascending') return a[sortElements.key] - b[sortElements.key];
        if(sortElements.key === 'duracao' && sortElements.direction === 'descending') return b[sortElements.key] - a[sortElements.key];
        
        if (a[sortElements.key] < b[sortElements.key]) {
          return sortElements.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortElements.key] > b[sortElements.key]) {
          return sortElements.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    setCallsReceived(sortableItems);
    return;
  }, [sortElements]);

  const sortedCalls = (key) => {
    let direction = 'ascending';
    if (sortElements && sortElements.key === key && sortElements.direction === 'ascending') {
      direction = 'descending';
    }
    setSortElements({ key, direction });
    return;
  }


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
              <ChartBySector getRows={ getReportRowsFiltredChartSectors }/>
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
            <FilterReportsCalls
              getAllDataDb={ getAllDataDb }
              page={ setCurrentPage }
              startDate={ startDate }
              endDate={ endDate }
              setLoading={ setLoading }
              setStartDate={ setStartDate }
              setEndDate={ setEndDate }
              sendDataToFilter={ fecthDataFilterCurrent }
              setStartHour={ setStartHour }
              setEndHour={ setEndHour }
              setSectorLocal={ setSectorLocal }
              setEndpointLocal={ setEndpointLocal }
              setSectorDbLocal={ setSectorDbLocal }
              setStatusCallLocal={ setStatusCallLocal }
              setProtocolLocal={ setProtocolLocal }
              setPhoneNumberLocal={ setPhoneNumberLocal }
              setTypeCallsLocal={ setTypeCallsLocal }
            />
            <ReportList callsList={ currentCalls } sortedCalls={ sortedCalls } verifySort={ verifySort } />
            <Pagination callsPerPage={ callsPerPage } totalCalls={ callsReceived.length } paginate={ paginate } currentPage={ currentPage } />
          </>
      }
    </div>
  );
}

export default Reports;

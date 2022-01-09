import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PbxContext from '../../context/PbxContext';
import { fetchCallsDataBase, accessLocalStorage } from '../../services';
import Charts from '../../components/Reports/Charts';
import ReportList from '../../components/Reports/ReportList';
import ChartsSendCalls from '../../components/Reports/ChartsSendCalls';
import ChartBySector from '../../components/Reports/ChartBySector';
import ChartCallsStatusGlobal from '../../components/Reports/ChartCallsStatusGlobal';
import ChartCallsStatusByTime from '../../components/Reports/ChartCallsStatusByTime';
import ChartCallsStatusPie from '../../components/Reports/ChartCallsStatusPie';
import TableReceivedCalls from '../../components/Reports/TableReceivedCalls';
import TableSentCalls from '../../components/Reports/TableSentCalls';
// import ChartCallsStatusBySectorAndTime from '../../components/Reports/ChartCallsStatusBySectorAndTime';
import FilterReportsCalls from '../../components/Reports/FilterReportsCalls';
import Loading from '../../components/Loading/LoadingModule';

import '../../libs/bulma.min.css';

function Reports() {
  const [loading, setLoading] = useState(true);
  const getItensStateGlobal = useContext(PbxContext);
  const { setCallsDb, dayDb, addStatusCalls, formatClidCalls } = getItensStateGlobal;

  const history = useHistory();

  const getCallsDataBase = useCallback( async () => {
    let callsApiResult = await fetchCallsDataBase(dayDb);
    
    if (!callsApiResult) callsApiResult = [];

    const addKeyProtocolNumber = (objectArray, properties) => {
      return objectArray.reduce((acc, obj) => {
        let key = obj[properties];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
    };
  
    const mergeAllCallsAnsweredAndNot = () => {
      const callsObjKeyProtocol = addKeyProtocolNumber(callsApiResult, 'callprotocol');
  
      const result = Object.values(callsObjKeyProtocol).reduce((acc, call) => {
        const key = call.callprotocol;
        const checkAnweredCall = call.find((call) => call.disposition === 'ANSWERED');
        return checkAnweredCall ? acc.concat(checkAnweredCall) : acc.concat(call);
      }, [])

      return result;
    };

    const addPropStatusCall = addStatusCalls(callsApiResult);
    const formatClidCallsUnit = formatClidCalls(addPropStatusCall);
    
    if (callsApiResult || !Error) setLoading(false);

    const checkAttendsCalls = mergeAllCallsAnsweredAndNot(formatClidCallsUnit);
    
    return setCallsDb(checkAttendsCalls);
  }, [dayDb, setCallsDb]);

  const validateUserLogged = async () => {
    const dataUser = await accessLocalStorage.getUserLocalStorage();
    if (!dataUser) return history.push('/');
    await getCallsDataBase();
  }
  
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
            <div className="columns mx-2 mt-2 mb-0">
              {/* <div className="column is-three-fifths is-offset-one-fifth">
                <div className="control">
                  <h1 className="is-size-3 has-text-centered has-text-weight-bold">Relatórios</h1>
                </div>
              </div> */}
            </div>
            {/* <hr className="m-0 p-0"/> */}
          <div className="columns mx-2">
            <Charts />
            <ChartsSendCalls />
            <ChartCallsStatusPie />
          </div>
          <hr className="m-0 p-0"/>
          <div className="columns mx-2">
            <ChartBySector />
            <ChartCallsStatusByTime />
            <ChartCallsStatusGlobal />
          </div>
          <hr className="m-0 p-0"/>
          <div className="columns mx-2">
              <TableReceivedCalls />
              <TableSentCalls />
          </div>
          <hr className="m-0 p-0"/>
          <FilterReportsCalls />
          <ReportList />
          </>
      }
    </div>
  );
}

export default Reports;

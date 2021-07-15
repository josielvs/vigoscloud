import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PbxContext from '../../context/PbxContext';
import { fetchCallsDataBase, accessLocalStorage } from '../../services';
import Charts from '../../components/Reports/Charts';
import ReportList from '../../components/Reports/ReportList';
import ChartsSendCalls from '../../components/Reports/ChartsSendCalls';
import FilterReports from '../../components/Reports/FilterReports';
import FilterReportsCalls from '../../components/Reports/FilterReportsCalls';
import Loading from '../../img/loading.gif';

function Reports() {
  const [loading, setLoading] = useState(true);
  const getItensStateGlobal = useContext(PbxContext);
  const { filterReportList, setCallsDb, setDataDbImutate, checkFilter, setCheckFilter, dayDb } = getItensStateGlobal;

  const history = useHistory();

  const checkTypeOfCall = (calls) => {
    const analiseCall = calls.filter(call => call.callprotocol).map((call) => {
      if(Number(call.billsec) === 0) {
        call['statuscall'] = 'Não Atendida';
      } else {
        call['statuscall'] = 'Atendida';
      }
      return call;
    });
    return analiseCall;
  };

  const reporttFilters = (calls) => {
    const filterCalls = calls.filter((call) => {
      const { column, dataOfColum } = filterReportList;
      return call[column] && call[column].includes(dataOfColum);
    });
    return filterCalls;
  };

  const getCallsDataBase = useCallback( async () => {
    let callsApiResult = await fetchCallsDataBase(dayDb);
    // let callsTodayResult = await fetchCallsDataBase({ day: 0 });

    if (callsApiResult) setLoading(false);
    
    if (!callsApiResult) callsApiResult = [];
    const callsMutationResult = checkTypeOfCall(callsApiResult);

    const filterReports = reporttFilters(callsMutationResult);

    if(filterReports.length !== 0) setCheckFilter(true);
    console.log(checkFilter);
    setDataDbImutate(callsApiResult);
    
    if(!checkFilter) setCallsDb(callsMutationResult);
  }, [checkFilter, dayDb, filterReportList, setCallsDb, setDataDbImutate, setCheckFilter]);

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
          <img className="loading mt-6 pt-6" src={ Loading } alt="Vigos" />
          :
          <>
          <h1>Relatórios</h1>
          <hr className="m-0 p-0"/>
          <div className="charts-screem">
            <Charts />
            <ChartsSendCalls />
          </div>
          <hr />
          {/* <FilterReports /> */}
          <FilterReportsCalls />
          <ReportList />
          </>
      }
    </div>
  );
}

export default Reports;

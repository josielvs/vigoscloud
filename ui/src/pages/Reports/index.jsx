import React, { useCallback, useContext, useEffect, useState } from 'react';
import PbxContext from '../../context/PbxContext';
import { fetchCallsDataBase, fetchRecCall } from '../../services';
import Charts from '../../components/Reports/Charts';
import ReportList from '../../components/Reports/ReportList';
import ChartsSendCalls from '../../components/Reports/ChartsSendCalls';
import FilterReports from '../../components/Reports/FilterReports';
import Loading from '../../img/loading.gif';

function Reports() {
  const [loading, setLoading] = useState(true);
  const getItensStateGlobal = useContext(PbxContext);
  const { filterReportList, setCallsDb, setDataDbImutate, checkFilter, setFilterCheck, dayDb } = getItensStateGlobal;

  const getCallsDataBase = useCallback( async () => {
    let callsApiResult = await fetchCallsDataBase(dayDb);

    if (callsApiResult) setLoading(false);
    
    if (!callsApiResult) callsApiResult = [];
    const callsMutationResult = callsApiResult.filter(call => call.callprotocol).map((call) => {
      if(Number(call.billsec) === 0) {
        call['statuscall'] = 'Não Atendida';
      } else {
        call['statuscall'] = 'Atendida';
      }
      return call;
    });

    const filterReports = callsMutationResult.filter((call) => {
      const { column, dataOfColum } = filterReportList;
      return call[column] && call[column].includes(dataOfColum);
    });

    if(filterReports.length !== 0) setFilterCheck(true);
    setDataDbImutate(callsApiResult);
    
    if(!checkFilter) setCallsDb(callsMutationResult);
  }, [checkFilter, dayDb, filterReportList, setCallsDb, setDataDbImutate, setFilterCheck]);
  
  useEffect(() => {
    getCallsDataBase()
  }, [getCallsDataBase])

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
          <FilterReports />
          <ReportList />
          </>
      }
    </div>
  );
}

export default Reports;

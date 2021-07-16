import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PbxContext from '../../context/PbxContext';
import { fetchCallsDataBase, accessLocalStorage } from '../../services';
import Charts from '../../components/Reports/Charts';
import ReportList from '../../components/Reports/ReportList';
import ChartsSendCalls from '../../components/Reports/ChartsSendCalls';
import FilterReportsCalls from '../../components/Reports/FilterReportsCalls';
import Loading from '../../components/Loading/LoadingModule';

import '../../libs/bulma.min.css';

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
          <Loading />
          :
          <>
            <div className="columns mx-2 mt-2 mb-0">
              <div className="column is-three-fifths is-offset-one-fifth">
                <div className="control">
                  <h1 className="is-size-3 has-text-centered has-text-weight-bold">Relatórios</h1>
                </div>
              </div>
            </div>
            <hr className="m-0 p-0"/>
          {/* <div className="charts-screem"> */}
          <div className="columns mx-2">
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

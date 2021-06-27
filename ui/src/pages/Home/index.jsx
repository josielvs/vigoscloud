import React, { useCallback, useContext, useEffect, useState } from 'react';
import PbxContext from '../../context/PbxContext';
import EventsGet from '../../components/Events/EventsGet';
import { fetchCallsDataBase, fetchEndpoints } from '../../services';
import EndpointsList from '../../components/Endpoints/EndpointsList';
import Loading from '../../img/loading.gif';

function Home() {
  const [loading, setLoading] = useState(true);
  const getItensStateGlobal = useContext(PbxContext);
  const { setEndpoints, ipEndpoints, setCallsOfDay } = getItensStateGlobal;

  const getApiEndpoints = useCallback(async () => {
    const endpointsReceived = await fetchEndpoints();
    if (endpointsReceived) {
      setLoading(false);
      setEndpoints(endpointsReceived);
      return ipEndpoints;
    }
  }, [setEndpoints, ipEndpoints]);

  const getApiCallOnDay = useCallback(async () => {
    let callOfDayReceived = await fetchCallsDataBase({ day: 0 });
    if(callOfDayReceived !== []) callOfDayReceived = [];

    const callResponsed = callOfDayReceived.filter(call => Number(call.billsec) > 0);
    setCallsOfDay(callResponsed);

    return callResponsed;
  }, [setCallsOfDay]);
  
  useEffect(() => {
    getApiEndpoints();
    getApiCallOnDay()
  }, [getApiEndpoints, getApiCallOnDay])

  return (
    <div >
      {
        loading ? <img className="loading mt-6 pt-6" src={ Loading } alt="Vigos" />
        :
        <div className="App">
          <EndpointsList />
          <EventsGet />
          {/* <CallsResponseds /> */}
        </div>
      }
    </div>
  );
}

export default Home;
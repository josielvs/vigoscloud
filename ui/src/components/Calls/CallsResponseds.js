import React, { useCallback, useContext, useEffect, useState } from 'react';
import PbxContext from '../../context/PbxContext';
import ResponsedsTable from '../../components/Calls/ResponsedsTable';

function CallsResponseds() {
  const [countCalls, setCountCalls] = useState([]);
  const getItensStateGlobal = useContext(PbxContext);
  const { callsOfDay } = getItensStateGlobal;

  const getCallOfDay = useCallback(() => {
  let callCountForEdpoints = callsOfDay.map(call => {
    let modifyChannel = call.dstchannel;

    if (modifyChannel.includes('/')) {
      const returNewChannel = modifyChannel.split('/')[1].split('-')[0];
      call['dstchannel'] = returNewChannel;
    }

    return call;
  }).reduce((prev, cur) => {
      if (cur.typecall === 'Recebida') {
        prev[cur.dstchannel] = (prev[cur.dstchannel] || 0) + 1;
        return prev;
      } else {
        prev[cur.src] = (prev[cur.src] || 0) + 1;
        return prev; 
      }
    }, {});
  
  setCountCalls(callCountForEdpoints);

  
  }, [callsOfDay]);

  useEffect(() => {
    getCallOfDay();
  }, [getCallOfDay])

  return (
    <section className="section calls-information">
      <h2>Chamadas do dia</h2>
      <div className="table-container">
        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th><abbr title="Played">Ramal</abbr></th>
            <th><abbr title="Won">Tipo de Chamada</abbr></th>
            <th><abbr title="Drawn">Falando com</abbr></th>
            <th><abbr title="Lost">Última chamada</abbr></th>
            <th><abbr title="Lost">Atendimentos no dia</abbr></th>
          </tr>
        </thead>
        {
          callsOfDay.map((call) => {
            const { dstchannel, src, typecall, billsec, dst } = call;
            function secConvert(time){
              const hours = Math.floor( time / 3600 );
              const minutes = Math.floor( (time % 3600) / 60 );
              const seconds = time % 60;
              
              const doubleDigitsMinutes = minutes < 10 ? `0${minutes}` : minutes;      
              const doubleDigitsSeconds = seconds < 10 ? `0${seconds}` : seconds;
              const doubleDigitsHours = hours < 10 ? `0${hours}` : hours;
              
              return `${doubleDigitsHours}:${doubleDigitsMinutes}:${doubleDigitsSeconds}`;
            }

            const callBillsec = secConvert(billsec);

            let endpointCalls;
            if(dstchannel.length > 4) {
              endpointCalls = countCalls[src];
            } else {
              endpointCalls = countCalls[dstchannel];
            }

          let callEntrance;
            if(typecall === 'Recebida'){
              callEntrance = {
                numberConnected: src,
                endpoint: dstchannel,
                typeCall: typecall,
                dayCalls: 0,
                time: callBillsec,
                countCalls: endpointCalls,
              };
            } else {
              callEntrance = {
                numberConnected: dst,
                endpoint: src,
                typeCall: typecall,
                dayCalls: 0,
                time: callBillsec,
                countCalls: endpointCalls,
              };
            }
            return callEntrance;
          })
          .filter((cur,index,array) => array.findIndex(t => (t.endpoint === cur.endpoint)) === index && !cur.numberConnected.includes('*'))
          .map((call, index) => <ResponsedsTable key={ index } call={ call } />)
        }
        </table>
      </div>
    </section>
  );
}

export default CallsResponseds;

// .filter((elem) => console.log(!elem.numberConnected.includes('*')))

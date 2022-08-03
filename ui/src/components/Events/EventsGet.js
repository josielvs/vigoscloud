import React, { useCallback, useContext, useEffect, useState } from 'react';
import PbxContext from '../../context/PbxContext';
import CallsTableTransition from './CallsTableTransition';
import CallsTableAnswers from './CallsTableAnswers';
import accessLocalStorage from '../../services/accessLocalStorage';

import '../../libs/bulma.min.css';

const EventsGet = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { setIpEndpoints, setRealTimeCall, setClickToCallChannel } = getItensStateGlobal;

  const [getItemsCallsAnswers, setGetItemsCallsAnswers] = useState([]);

  const {
    REACT_APP_API_USER_AST,
    REACT_APP_API_PASS_AST
  } = process.env;
  
  const fetchEvents = useCallback(async () => {
    const dateBrGenerate = (dateAndTime) => {
      const date = new Date(dateAndTime);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
    
      const dateBr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    
      const dateBrFull = `${dateBr} ${time}`;
    
      return dateBrFull;
    };

    const { ipRequest } = await accessLocalStorage.getUserLocalStorage();
    const ip = ipRequest.replace(/http/i, 'ws');

    const dbLocal = localStorage;
    const pbxEvents = new WebSocket(`${ip}ari/events?api_key=${REACT_APP_API_USER_AST}:${REACT_APP_API_PASS_AST}&app=pbxLogs&subscribeAll=true`);
    pbxEvents.onerror = await function error(error){ console.log(error); };

    const setIdCallsRealTimeLS = (call) => {
      let lsCallsRealTime = JSON.parse(localStorage.getItem('realTimeCalls'));
      if(!lsCallsRealTime) lsCallsRealTime = [];
      lsCallsRealTime = [...lsCallsRealTime, call]
      localStorage.setItem('realTimeCalls', JSON.stringify(lsCallsRealTime));
      setGetItemsCallsAnswers(lsCallsRealTime);
      return lsCallsRealTime;
    };

    pbxEvents.onmessage = (event) => {
      const obj = JSON.parse(event.data);

      if(obj.type === 'BridgeAttendedTransfer') {
        const { transferer_first_leg: { dialplan: { context } } } = obj;
        const { transferer_second_leg: { creationtime } } = obj;
    
        const dateBrTransformed = dateBrGenerate(creationtime);
    
        const print = context !== 'dial-send'?
            `${dateBrTransformed}, ${obj.transferee.caller.number}, ${obj.transferer_second_leg.connected.number}`
          :
            `${dateBrTransformed}, ${obj.transferer_second_leg.dialplan.app_data.split('/')[1].split('@')[0]}, ${obj.transferer_second_leg.connected.number}`;
            
        // console.log('PRINT: ', print)
      }

      if(obj.type === 'BridgeBlindTransfer') {
        // console.log(obj);
        const { channel: { dialplan: { context }, creationtime } } = obj;

        const dateBrTransformed = dateBrGenerate(creationtime);
    
        const print = context !== 'dial-send'?
            `${dateBrTransformed}, ${obj.channel.connected.number}, ${obj.exten}`
          :
            `${dateBrTransformed}, ${obj.channel.dialplan.app_data.split('/')[1].split('@')[0]}, ${obj.exten}`;
            
        // console.log('PRINT: ', print)
      }

      if(obj.type === 'ContactStatusChange') {
        let ipEndpoint = obj.contact_info.uri.split('@')[1];
        ipEndpoint = ipEndpoint.split(':')[0];
        const nameEndpoint = obj.endpoint.resource;
        const stateEndpoint = obj.endpoint.state;
        const sendDbEndpoint = {
          endpoint: obj.endpoint.resource,
          state: obj.endpoint.state,
          ip: ipEndpoint,
        };
        if(stateEndpoint !== 'offline') dbLocal.setItem(nameEndpoint, JSON.stringify(sendDbEndpoint));
        if(stateEndpoint === 'offline') dbLocal.removeItem(nameEndpoint);
        setIpEndpoints(sendDbEndpoint)
      };

      if (obj.type === 'ChannelDialplan' && obj.dialplan_app === 'AppDial2') setClickToCallChannel(obj.channel.id);

      if(obj.type === 'ChannelCreated') {
        const { channel: { caller: { number }, state } } = obj
        setIpEndpoints({
          endpoint: number,
          state: state,
        });
      };

      if(obj.type === 'Dial' && obj.caller) {
        const { caller: { dialplan: { context } } } = obj;
        if(context === 'dial-entrance') {
          const { caller: { caller: { number } }, peer: { caller: { name } }, dialstatus } = obj;
          const endpoint = obj.peer.caller.number;
          const callEntrance = {
            numberConnected: number,
            endpointName: name,
            endpoint,
            typeCall: 'Chamada de Entrada',
            dayCalls: 0,
            status: dialstatus,
          };
          if(obj.dialstatus === 'ANSWER') {
            callEntrance.channelId = obj.peer.id;
            setIdCallsRealTimeLS(callEntrance);
            setRealTimeCall({});
          }
          if(callEntrance.status !== 'ANSWER') setRealTimeCall(callEntrance);
        } else if(context === 'dial-send') {
          const {
            caller: { caller: { name } },
            caller: { caller: { number } },
            caller: { dialplan: { app_data } },
            dialstatus,
          } = obj;
          let sendCallNumber;
          if(app_data.includes('@')) {
            sendCallNumber = app_data.split('/')[1].split('@')[0];
          } else {
            sendCallNumber = app_data.split('/')[1].split(',')[0];
          }
          const callSended = {
            numberConnected: sendCallNumber,
            endpointName: name,
            endpoint: number,
            typeCall: 'Chamada de Saída',
            dayCalls: 0,
            status: dialstatus,
          };
          if(obj.dialstatus === 'ANSWER') {
            callSended.channelId = obj.caller.id;
            setIdCallsRealTimeLS(callSended);
            setRealTimeCall({});
          }
          if(callSended.status !== 'ANSWER') setRealTimeCall(callSended);
        }
      }

      if(obj.type === 'ChannelDestroyed') {
        const { channel: { caller: { number }, state } } = obj

        let endpointNameDestroyed = obj.channel.dialplan.app_data.split('/')[1];

        if(endpointNameDestroyed === undefined) endpointNameDestroyed = 'siptrunk';

        let myCallActivesOnLs = JSON.parse(localStorage.getItem('realTimeCalls'));

        if(!myCallActivesOnLs) myCallActivesOnLs = [];
        
        const filterToRemoveItem = myCallActivesOnLs.filter((call) => call.channelId !== obj.channel.id);
        localStorage.setItem('realTimeCalls', JSON.stringify(filterToRemoveItem));
        setGetItemsCallsAnswers(filterToRemoveItem);
        setRealTimeCall({});
        setIpEndpoints({
          endpoint: number,
          state: state,
        });
      }
    }
  }, [
      setGetItemsCallsAnswers,
      setIpEndpoints,
      setRealTimeCall,
      setClickToCallChannel,
    ])
  
  useEffect(() => {
    fetchEvents();
    setGetItemsCallsAnswers(JSON.parse(localStorage.getItem('realTimeCalls')))
  }, [fetchEvents])

  return (
      <section className="card section calls-information my-6 py-2">
        <h2 className="is-size-4 has-text-centered has-text-weight-bold">Chamadas em Tempo Real</h2>
        <div className="table-container">
            <table id="tableCalls" className="table is-hoverable is-striped is-fullwidth">
                <thead>
                    <tr>
                    <th scope="col">Selecione</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Ramal</th>
                    <th scope="col">Tipo de chamada</th>
                    <th scope="col">Status</th>
                    <th scope="col">Falando com</th>
                    </tr>
                </thead>
                {
                  getItemsCallsAnswers ? getItemsCallsAnswers.map((call, index) => <CallsTableAnswers key={call.channelId} call={call} />) : null
                }
                <CallsTableTransition />
            </table>
        </div>
      </section>
    )
}

export default EventsGet;

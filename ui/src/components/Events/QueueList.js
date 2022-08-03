import React, { useCallback, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

import '../../libs/bulma.min.css';

import { exportSelectAllQueues } from '../../services';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSquare } from '@fortawesome/free-solid-svg-icons';
import QueueAgents from '../Queues/QueueAgents';
import QueueIdentfyOnHold from '../Queues/QueueIdentfyOnHold'
import QueueIdentfyAnswered from '../Queues/QueueIdentfyAnswered';

const socket = io('http://192.168.88.2:3002');

function QueueList(queue) {
  const { queueName } = queue;
  
  let url = window.location.href;
  url = url.split('/')[2];

  const [ queueData, setQueueData ] = useState({
    answered: 0,
    abandon: 0,
    agents: [{name: '', location: '', status: 0, paused: 0}], 
    onHoldCalls: [],
  });
  const [ agents, setAgents ] = useState({});
  const [ queuesParams, setQueuesParams ] = useState({});
  const [ onHoldCalls, setOnHoldCalls ] = useState({});
  const [ activeAnsweredCalls, setActiveAnsweredCalls ] = useState({});

  const getInitialQueueStats = async () => {
    try {
      const responseStats = await axios.get('http://192.168.88.2:3002/queue-stats');
      return responseStats;
    } catch (error) {
      return error;
    }
  };

  /*
    {"event":"QueueMember","queue":"atendimento","name":"PJSIP/7006","location":"PJSIP/7006","stateinterface":"PJSIP/7006","membership":"static","penalty":"0","callstaken":"2","lastcall":"1659110793","lastpause":"0","logintime":"1658580535","incall":"0","status":"5","paused":"0","pausedreason":"","wrapuptime":"0","actionid":"1659142668208"}
    {"event": "QueueParams","queue": "atendimento","max": "20","strategy": "ringall","calls": "0","holdtime": "6","talktime": "237","completed": "1","abandoned": "0","servicelevel": "0","servicelevelperf": "0.0","servicelevelperf2": "0.0","weight": "0","actionid": "1659375497623"}
    {
      "event": "QueueCallerJoin",
      "privilege": "agent,all",
      "timestamp": "1659379753.199129",
      "systemname": "VigosCloud",
      "channel": "PJSIP/DirectCall-0000001b",
      "channelstate": "4",
      "channelstatedesc": "Ring",
      "calleridnum": "5511987389009",
      "calleridname": "5511987389009",
      "connectedlinenum": "<unknown>",
      "connectedlinename": "<unknown>",
      "language": "pt_BR",
      "accountcode": "",
      "context": "dial-entrance",
      "exten": "s",
      "priority": "8",
      "uniqueid": "VigosCloud-1659379753.50",
      "linkedid": "VigosCloud-1659379753.50",
      "queue": "atendimento",
      "position": "1",
      "count": "1"
    }
  */

  useEffect(() => {
    getInitialQueueStats();
    
    socket.on(queueName, (data) => {
      if(data.event == "QueueParams"){
        setQueuesParams((prevState) => prevState, queuesParams[data.queue] = { queue: data.queue, completed: data.completed, abandoned: data.abandoned, total: parseInt(data.completed) + parseInt(data.abandoned) })
      }

      if(data.event == "QueueMember"){
        setAgents((prevState) => prevState, agents[data.location.split('/')[1]] = { name: data.name, location: data.location.split('/')[1], status: data.status, paused: data.paused });
      }

      if(data.event == "QueueMemberStatus"){
        setAgents((prevState) => prevState, agents[data.interface.split('/')[1]] = { name: data.membername, location: data.interface.split('/')[1], status: data.status, paused: data.paused, timestamp: data.timestamp });
        if (data.status === '1' && activeAnsweredCalls[data.queue].name === data.interface) setActiveAnsweredCalls((prevState) => {
          delete prevState[data.queue].name
          delete prevState[data.queue].endpoint
          delete prevState[data.queue].phone
          Object.keys(prevState[data.queue]).length === 0 ? delete prevState[data.queue] : prevState;
          return prevState;
        });
      }

      if(data.event == "QueueCallerJoin"){
        setOnHoldCalls((prevState) => prevState, onHoldCalls[data.queue]= { name: data.queue, clid: data.calleridnum, uniqueid: data.uniqueid });
      }

      if(data.event == "QueueCallerLeave"){
        let tmpOnHoldCalls = {};

        [onHoldCalls[data.queue]].forEach((call) => {
          if(call.uniqueid !== data.uniqueid){
            tmpOnHoldCalls[data.queue] = { clid: call.clid, uniqueid: call.uniqueid };
          }
        })
        setOnHoldCalls(tmpOnHoldCalls);
      }
      /*
        ### Emitindo no canal tests a mensagem: 
        {"event":"QueueCallerLeave","privilege":"agent,all","timestamp":"1659388827.456544","systemname":"VigosCloud","channel":"PJSIP/DirectCall-00000048","channelstate":"4","channelstatedesc":"Ring","calleridnum":"5511987389009","calleridname":"5511987389009","connectedlinenum":"7000","connectedlinename":"7000","language":"pt_BR","accountcode":"","context":"dial-entrance","exten":"s","priority":"8","uniqueid":"VigosCloud-1659388817.141","linkedid":"VigosCloud-1659388817.141","queue":"tests","position":"1","count":"0"} 
      */
      if(data.event == "QueueCallerAbandon"){
        setQueuesParams((prevState) => prevState, queuesParams[data.queue].abandoned = parseInt(queuesParams[data.queue].abandoned) + 1);
        setQueuesParams((prevState) => prevState, queuesParams[data.queue].total = parseInt(queuesParams[data.queue].total) + 1);
      }

      /*
       {"event":"AgentConnect","privilege":"agent,all","timestamp":"1659480776.221115","systemname":"VigosCloud","channel":"PJSIP/DirectCall-00000008","channelstate":"4","channelstatedesc":"Ring","calleridnum":"5511987389009","calleridname":"5511987389009","connectedlinenum":"7000","connectedlinename":"7000","language":"pt_BR","accountcode":"","context":"dial-entrance","exten":"s","priority":"7","uniqueid":"VigosCloud-1659480768.15","linkedid":"VigosCloud-1659480768.15","destchannel":"PJSIP/7000-00000009","destchannelstate":"6","destchannelstatedesc":"Up","destcalleridnum":"7000","destcalleridname":"7000","destconnectedlinenum":"5511987389009","destconnectedlinename":"5511987389009","destlanguage":"pt_BR","destaccountcode":"","destcontext":"ddd-celular","destexten":"s","destpriority":"1","destuniqueid":"VigosCloud-1659480768.16","destlinkedid":"VigosCloud-1659480768.15","queue":"tests","interface":"PJSIP/7000","membername":"PJSIP/7000","holdtime":"8","ringtime":"8"} 
      */
      if(data.event == "AgentConnect"){
        setQueuesParams((prevState) => prevState, queuesParams[data.queue].completed = parseInt(queuesParams[data.queue].completed) + 1);
        setQueuesParams((prevState) => prevState, queuesParams[data.queue].total = parseInt(queuesParams[data.queue].total) + 1);
        setActiveAnsweredCalls((prevState) => prevState, activeAnsweredCalls[data.queue] = { name: data.interface, endpoint: data.membername, phone: data.calleridnum });
      }


      if(data.event == "QueueEntry"){
        console.log(data);
      }
    });
  }, [socket]);

  return (
    <div className="card column mx-1">
      <div className="card-title">
        <div className="media has-background-grey-lighter has-text-justified">
          <div className="media-left ml-2 pt-1">
            <h1 className="has-text-justified"><strong>Fila: </strong></h1>
          </div>
          <div className="media-content">
            <p className="title is-4">{ queueName }</p>
            <p className="subtitle is-6"></p>
          </div>
        </div>

        <div className="columns is-multiline">
          <div className="column is-one-third">
            <h1 className="has-background-link-light has-text-centered"><strong>Estatísticas </strong></h1>
            <div className="ml-2 mt-2">
              <strong>{ typeof onHoldCalls[queueName] !== 'undefined' ? Object.keys(onHoldCalls[queueName]).length - 2 : '0' }</strong> - Ch. em espera
            </div>
            <div className="ml-2">
              <strong>{ typeof queuesParams[queueName] !== 'undefined' ? queuesParams[queueName].completed : '0' }</strong> - Atendidas
            </div>
            <div className="ml-2">
              <strong>{ typeof queuesParams[queueName] !== 'undefined' ? queuesParams[queueName].abandoned : '0' }</strong> - Abandonadas
            </div>
            <div className="ml-2">
              <strong>{ typeof queuesParams[queueName] !== 'undefined' ? queuesParams[queueName].total : '0' }</strong> - Total
            </div>
          </div>
          <div className="column is-3">
            <h1 className="has-background-link-light has-text-centered"><strong>Espera</strong></h1>
            <table id="global" className="table is-hoverable is-striped is-fullwidth mt-1">
              <thead>
                <tr>
                  <th className="is-size-7 has-text-centered" scope="col">Tel.</th>
                  <th className="is-size-7 has-text-centered" scope="col">Tempo</th>
                </tr>
              </thead>
              <tbody>
                {
                  typeof onHoldCalls[queueName] !== 'undefined' ? [onHoldCalls[queueName]].map((item) => <QueueIdentfyOnHold key={ item.uniqueid } onHoldCall={ item }/>) : <tr><td></td></tr>
                }
              </tbody>
            </table>
          </div>
          <div className="column is-5">
            <h1 className="has-background-link-light has-text-centered"><strong>Em atendimento</strong></h1>
            <table id="global" className="table is-hoverable is-striped is-fullwidth mt-1">
              <thead>
                <tr>
                  <th className="is-size-7 has-text-centered" scope="col">Tel.</th>
                  <th className="is-size-7 has-text-centered" scope="col">Atend.</th>
                  <th className="is-size-7 has-text-centered" scope="col">Tempo</th>
                </tr>
              </thead>
              <tbody>
                {
                  typeof activeAnsweredCalls[queueName] !== 'undefined' ? [activeAnsweredCalls[queueName]].map((item) => <QueueIdentfyAnswered key={ item.endpoint } answeredCall={ item }/>) : <tr><td></td></tr>
                }
              </tbody>
            </table>
          </div>
          <div className="column">
            <h1 className="is-size-6 has-background-link-light has-text-centered"><strong>Atendentes</strong></h1>
            <table id="global" className="table is-hoverable is-striped is-fullwidth mt-1">
              <thead>
                  <tr>
                  <th className="is-size-7 has-text-centered" scope="col">Agente:</th>
                  <th className="is-size-7 has-text-centered" scope="col">Ramal:</th>
                  <th className="is-size-7 has-text-centered" scope="col">Pausa:</th>
                  <th className="is-size-7 has-text-centered" scope="col">Status:</th>
                  </tr>
              </thead>
              <tbody>
                {
                  Object.keys(agents).length > 0 ? Object.keys(agents).map((agent, index) => <QueueAgents key={ index } agent={ agents[agent] } />) : <tr><td></td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueueList;

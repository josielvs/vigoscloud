import React, { useCallback, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

import '../../libs/bulma.min.css';

import { exportSelectAllQueues } from '../../services';
import QueueList from '../../components/Events/QueueList';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSquare } from '@fortawesome/free-solid-svg-icons';
import QueueAgents from '../../components/Queues/QueueAgents';

function QueueEvents() {
  let url = window.location.href;
  url = url.split('/')[2];
  const [ queues, setQueues] = useState([])

  const getInitialQueues = async () => {
    try {
      const responseQuaues = await exportSelectAllQueues();
      const rResponse = responseQuaues.map((q) => q.queuesselect);
      setQueues(rResponse)
      return;
    } catch (error) {
      return error;
    }
  };

  /*
    {"event":"QueueMember","queue":"atendimento","name":"PJSIP/7006","location":"PJSIP/7006","stateinterface":"PJSIP/7006","membership":"static","penalty":"0","callstaken":"2","lastcall":"1659110793","lastpause":"0","logintime":"1658580535","incall":"0","status":"5","paused":"0","pausedreason":"","wrapuptime":"0","actionid":"1659142668208"}
  */

  useEffect(() => {
    getInitialQueues();
  }, [queues]);

  return (
    <div className="card section">
      <div className="columns">
        <div className="column is-half is-offset-one-quarter has-text-centered">
          <strong className="is-size-3">Filas</strong>
        </div>
      </div>
      <div className="columns">
          { queues.map((queue) => <QueueList key={ queue } queueName={ queue } />) }
      </div>
    </div>
  );
}

export default QueueEvents;

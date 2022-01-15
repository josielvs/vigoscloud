import React, { useState } from 'react';
import PropTypes from 'prop-types';

import PbxContext from './PbxContext';

function Provider({ children }) {
  const [user, setUser] = useState('');
  const [endpoints, setEndpoints] = useState([]);
  const [ipEndpoints, setIpEndpoints] = useState({});
  const [path, setPath] = useState('');
  const [storageDataReport, setStorageDataReport] = useState({});
  const [storageDataReportToList, setStorageDataReportToList] = useState([]);
  const [realTimeCall, setRealTimeCall] = useState({
    numberConnected: '',
    endpointName: '',
    endpoint: '',
    typeCall: '',
    dayCalls: 0,
    status: '',
  });
  const [callsAnalist, setCallsAnalist] = useState([]);
  const [callsOfDay, setCallsOfDay] = useState([]);
  const [dayDb, setDayDb] = useState({ day: 0 });
  const [channelInState, setChannelInState] = useState({});
  const [clickToCallChannel, setClickToCallChannel] =useState('');

  const toggleIsHidden = (id) => {
    const showMenu = document.querySelector(id);
    showMenu.classList.toggle('is-active');
    showMenu.classList.toggle('is-hidden');
  };

  const addStatusCalls = (calls) => {
    return calls.map((call) => Number(call.billsec) !== 0 ? Object.assign(call, { statuscall : 'Atendida' }) : Object.assign(call, { statuscall : 'Não Atendida' }));
  };

  const formatClidCalls = (calls) => {
    return calls.map((call) => Object.assign(call, { clid : call.clid.split('<')[1].replace(/>/g, '') }));
  };

  const verifySort = (a, b) => {
    if(a > b) return 1;
    if (a < b) return -1;
    return 0;
  };

  const contextValues = {
    user,
    setUser,
    path,
    setPath,
    endpoints,
    setEndpoints,
    ipEndpoints,
    setIpEndpoints,
    realTimeCall,
    setRealTimeCall,
    callsAnalist,
    setCallsAnalist,
    channelInState,
    setChannelInState,
    clickToCallChannel,
    setClickToCallChannel,
    toggleIsHidden,
    addStatusCalls,
    callsOfDay,
    setCallsOfDay,
    storageDataReport,
    setStorageDataReport,
    verifySort,
    storageDataReportToList,
    setStorageDataReportToList
  };
  
  return (
    <PbxContext.Provider
      value={ contextValues }
    >
      {children}
    </PbxContext.Provider>
  );
}

Provider.propTypes = { children: PropTypes.element.isRequired };

export default Provider;

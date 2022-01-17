import React, { useState } from 'react';
import PropTypes from 'prop-types';

import PbxContext from './PbxContext';

function Provider({ children }) {
  const [user, setUser] = useState('');
  const [endpoints, setEndpoints] = useState([]);
  const [ipEndpoints, setIpEndpoints] = useState({});
  const [path, setPath] = useState('');
  const [storageDataReport, setStorageDataReport] = useState({});
  const [storageDataReportList, setStorageDataReportList] = useState([]);
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
    callsOfDay,
    setCallsOfDay,
    storageDataReport,
    setStorageDataReport,
    verifySort,
    storageDataReportList,
    setStorageDataReportList
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

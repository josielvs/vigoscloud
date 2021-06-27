import React, { useState } from 'react';
import PropTypes from 'prop-types';

import PbxContext from './PbxContext';

function Provider({ children }) {
  const [user, setUser] = useState('');
  const [endpoints, setEndpoints] = useState([]);
  const [ipEndpoints, setIpEndpoints] = useState({});
  const [callsDb, setCallsDb] = useState([]);
  const [dataDbImutate, setDataDbImutate] = useState([]);
  const [filterReportList, setFilterReportList] = useState({
    // startDateStateGlobal: '',
    // endDateStateGlobal: '',
    columnGlobalState: '',
    dataOfColumGlobalState: '',
  });
  const [checkFilter, setCheckFilter] = useState(false)
  const [path, setPath] = useState('');
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
  const [dayDb, setDayDb] = useState({ day: 1 });
  const [channelInState, setChannelInState] = useState({});
  const [clickToCallChannel, setClickToCallChannel] =useState('')

  const contextValues = {
    user,
    setUser,
    path,
    setPath,
    endpoints,
    setEndpoints,
    ipEndpoints,
    setIpEndpoints,
    callsDb,
    setCallsDb,
    filterReportList,
    setFilterReportList,
    dataDbImutate,
    setDataDbImutate,
    checkFilter,
    setCheckFilter,
    realTimeCall,
    setRealTimeCall,
    callsAnalist,
    setCallsAnalist,
    callsOfDay,
    setCallsOfDay,
    dayDb,
    setDayDb,
    channelInState,
    setChannelInState,
    clickToCallChannel,
    setClickToCallChannel
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
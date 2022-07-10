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
  const [channelInState, setChannelInState] = useState({});
  const [clickToCallChannel, setClickToCallChannel] = useState('');
  const [majoritaryItemsEndpoints, setMajoritaryItemsEndpoints] = useState(['callGroup', 'codec', 'context', 'dtmf', 'first', 'language', 'nat', 'password', 'pickupGroup', 'qtt', 'state', 'transport', 'type']);
  const [itemsSelectedToEdit, setItemsSelectedToEdit] = useState([]);

  const toggleIsHidden = (id) => {
    const showMenu = document.querySelector(id);
    if(!showMenu) return;
    showMenu.classList.toggle('is-active');
    showMenu.classList.toggle('is-hidden');
  };

  const toggleIsChangeFormElements = (inputName, classState) => {
    const showMenu = document.querySelector(`[name="${inputName}"]`);
    
    if(showMenu) {
      showMenu.classList = `${classState}`;
      return true;
    }
    return false;
  };

  const verifySort = (a, b) => {
    if(a > b) return 1;
    if (a < b) return -1;
    return 0;
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const validCharactersPassword = new RegExp(/^(?=.*[@!#$/\\])[@!#$%^&*()/\\a-zA-Z0-9]{6,30}$/);
  const validCharactersTextAndNumbers = new RegExp(/[,_\-a-zA-Z0-9]$/);

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
    setStorageDataReportList,
    capitalizeFirstLetter,
    validCharactersPassword,
    majoritaryItemsEndpoints,
    setMajoritaryItemsEndpoints,
    toggleIsChangeFormElements,
    validCharactersTextAndNumbers,
    itemsSelectedToEdit,
    setItemsSelectedToEdit,
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

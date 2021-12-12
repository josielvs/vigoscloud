import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import PbxContext from '../../context/PbxContext';
import {  accessLocalStorage, clickToCall, cancelClickToCall, trasferCall, cancelTrasferCall, clickToSpy } from '../../services';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPhoneAlt, faShare, faStopCircle, faPhoneSlash } from '@fortawesome/free-solid-svg-icons';

const EndpointCard = (props) => {
  const getItensStateGlobal = useContext(PbxContext);
  const { channelInState, clickToCallChannel } = getItensStateGlobal;
  const [buttonClick2Call, setButtonClick2Call] = useState(false);
  const [buttonTransferCall, setButtonTransferCall] = useState(false);
  const [channelTransferOn, setChannelTransferOn] = useState('');

  const { endpoint } = props;
  const { resource, state } = endpoint;
  let { channel_ids, myClass } = props.endpoint;
  let fontColorChanged = '';
  const ipDB = localStorage.getItem(endpoint.resource);
  const endpointReceived = JSON.parse(ipDB);
  let iconsClass = '';
  let ipDbReceived = 'IP não localizado';

  if(ipDB !== null) ipDbReceived = endpointReceived.ip;

  if(channel_ids.length < 1 && state === 'online') {
    channel_ids = 'livre';
    iconsClass = 'icons-endpoints';
    myClass = 'has-background-success';
  } else if (channel_ids.length > 0 && state === 'online') {
      channel_ids = 'ocup.';
      iconsClass = 'icons-endpoints';
      myClass = 'has-background-danger-dark';
      fontColorChanged = 'has-text-white';
  } else {
    channel_ids = '---';
    ipDbReceived = '';
    iconsClass = 'is-hidden';
    myClass = 'is-hidden';
  }

  const handleClick = async (dest, name) => {
    if (!name) name = dest;
    const { user } = await accessLocalStorage.getUserLocalStorage();
    const myEndpoint = { 
      name,
      dest,
      "exten": user.endpoint,
    }
    const result = await clickToCall(myEndpoint);
    if (result.status === 200) setButtonClick2Call(true);
  };

  const handleClickStop = async () => {
    const myEndpoint = {
      channel: clickToCallChannel,
    }
    const result = await cancelClickToCall(myEndpoint);
    if (result.status === 200) setButtonClick2Call(false);
  };

  const handleTransfer = async (dest) => {
    const { user: { endpoint } } = await accessLocalStorage.getUserLocalStorage();
    const { channelId, endpointNumber } = channelInState;

    if (endpoint !== endpointNumber) return;

    const myEndpoint = {
      channel: channelId,
      dest,
    }
    const result = await trasferCall(myEndpoint);
    setChannelTransferOn(channelId);
    if (result.status === 200) setButtonTransferCall(true);
  };

  const handleTransferStop = async (dest) => {
    const myEndpoint = {
      channel: channelTransferOn,
      dest,
    }
    const result = await cancelTrasferCall(myEndpoint);
    if (result.status === 200) setButtonTransferCall(false);
  };

  const handleClickSpy = async (dest) => {
    const { user } = await accessLocalStorage.getUserLocalStorage();
    const data = {
      dest,
      "exten": user.endpoint,
    };
    return await clickToSpy(data);
  };

  return (
    <div
      className={ `column is-narrow has-text-centered ${myClass} ${fontColorChanged} mx-1 my-1` }
    >
      <div
        className={ `column is-narrow px-3` }
        id={resource}
      >
        <p className="is-size-6 has-text-weight-bold">Ramal</p>
        <p className="is-size-6">{resource}</p>
        <p className="is-size-6">{state}</p>
        <p className="is-size-6 has-text-weight-semibold">{channel_ids.toUpperCase()}</p>
      </div>
      <div className={ `column is-narrow` }>
        <div className={ iconsClass }>
          <Link to="#" onClick={ () => handleClick(resource) } hidden={buttonClick2Call}><FontAwesomeIcon icon={faPhoneAlt} fixedWidth className="icon mx-1"/></Link>
          <Link to="#" onClick={ () => handleClickStop() } hidden={!buttonClick2Call}><FontAwesomeIcon icon={faPhoneSlash} style={{ color: 'red' }} fixedWidth className="icon mx-1"/></Link>
          <Link to="#" onClick={ () => handleTransfer(resource) } hidden={buttonTransferCall}><FontAwesomeIcon icon={faShare} fixedWidth className="icon mx-1"/></Link>
          <Link to="#" onClick={ () => handleTransferStop(resource) } hidden={!buttonTransferCall}><FontAwesomeIcon icon={faStopCircle} style={{ color: 'red' }} fixedWidth className="icon mx-1"/></Link>
          <Link to="#" onClick={ () => handleClickSpy(resource) }><FontAwesomeIcon icon={faEye} fixedWidth className="icon mx-1"/></Link>
        </div>
      </div>
    </div>
  );
}

export default EndpointCard;

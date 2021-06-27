import React, { useContext } from 'react';
import PbxContext from '../../context/PbxContext';

const CallsTableAnswers = (props) => {
  const getItensStateGlobal = useContext(PbxContext);
  const { setChannelInState } = getItensStateGlobal;
  
  const { 
    channelId,
    numberConnected,
    endpointName,
    endpoint,
    typeCall,
    status,
  } = props.call;


  return (
    <tbody>
      <tr>
        <td><input type="radio" name="channel" onClick={ () => setChannelInState({ channelId, endpointNumber: endpoint }) } /></td>
        <td>{endpointName}</td>
        <td>{endpoint}</td>
        <td>{typeCall}</td>
        <td>{status}</td>
        <td>{numberConnected}</td>
      </tr>
    </tbody>
  )
}

export default CallsTableAnswers;

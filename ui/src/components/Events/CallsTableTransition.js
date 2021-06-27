import React, { useContext } from 'react';
import PbxContext from '../../context/PbxContext';

const CallsTableTransition = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { realTimeCall } = getItensStateGlobal;
  const { 
    numberConnected,
    endpointName,
    endpoint,
    typeCall,
    status,
  } = realTimeCall;
  
  return (
    <tbody>
      <tr>
        <td><input type="checkbox" hidden/></td>
        <td>{endpointName}</td>
        <td>{endpoint}</td>
        <td>{typeCall}</td>
        <td>{status}</td>
        <td>{numberConnected}</td>
      </tr>
    </tbody>
  )
}

export default CallsTableTransition;

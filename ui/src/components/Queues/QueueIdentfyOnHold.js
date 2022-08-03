import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faBan } from '@fortawesome/free-solid-svg-icons';

const QueueIdentfyOnHold = ({ onHoldCall }) => {
  const { clid } = onHoldCall;

  const [time, setTime] = useState({ currentTime: 0 }) 

  const timer = () => setTime((prevState) => { 
    return { currentTime: prevState.currentTime + 1 }
  })
  
  useEffect(() => {
    let cancel = false;
    
    if (cancel) return;
    setInterval(() => timer(), 1000)

    return () => {
      cancel = true
    };
  }, [clid]);
  return (
      <tr className="is-size-7 has-text-centered">
        <td>{ clid }</td>
        <td>{ time.currentTime }</td>
      </tr>
  )
}

QueueIdentfyOnHold.propTypes = {
  clid: PropTypes.string,
};

export default QueueIdentfyOnHold;
import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faBan } from '@fortawesome/free-solid-svg-icons';

const QueueAgents = ({ agent }) => {
  const { name, location, paused, status } = agent;
  
  return (
      <tr className='is-size-7 has-text-centered '>
        <td>{ name }</td>
        <td>{ location }</td>
        <td>{ paused === '0' ? 'não' : 'sim'}</td>
        <td>{ status === '5' ? 'offline' : 'online' }</td>
      </tr>
  )
}

QueueAgents.propTypes = {
    name: PropTypes.string,
    location: PropTypes.string,
    paused: PropTypes.number,
    status: PropTypes.number,
  };

export default QueueAgents;
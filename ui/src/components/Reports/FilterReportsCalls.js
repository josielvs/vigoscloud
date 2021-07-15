import React, { useContext, useState } from 'react';

import PbxContext from '../../context/PbxContext'
import '../../libs/bulma.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const FilterReportsCalls = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { callsDb, setCallsDb } = getItensStateGlobal;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <form className="container">
      <div className="is-flex is-align-content-center">
        <div className="field is-flex mx-1">
          <label className="label">Data Inicial
            <div className="control">
            <input className="input" type="date" name="start-date"/>
          </div>
          </label>
        </div>
        <div className="field is-flex mx-1">
          <label className="label">Data Final
            <div className="control">
            <input className="input" type="date" name="end-date"/>
          </div>
          </label>
        </div>
      <a class="button is-loading">
        Button
      </a>
      </div>
    </form>
  );

  };

export default FilterReportsCalls;

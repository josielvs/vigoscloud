import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { fetchSectors, fetchDataReport, fetchDataReportList } from '../../services/api';

import PbxContext from '../../context/PbxContext';
import '../../libs/bulma.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

const FilterReportsCalls = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  sendDataToFilter,
  setStartHour,
  setEndHour,
  setSectorLocal,
  setEndpointLocal,
  setStatusCallLocal,
  setProtocolLocal,
  setPhoneNumberLocal,
  setTypeCallsLocal,
}) => {
  const getItensStateGlobal = useContext(PbxContext);
  const {
    endpoints,
    verifySort,
    capitalizeFirstLetter
  } = getItensStateGlobal;

  const [sectors, setSectors] = useState([]);

  const fetchSectorsFunction = async () => { 
    const getSectorsInDb = await fetchSectors();
    const sectorsList = getSectorsInDb.reduce((acc, cur) => {
      const changeFirstLetter = cur.sector.length > 3 ? capitalizeFirstLetter(cur.sector) : cur.sector.toUpperCase();
      acc.push(changeFirstLetter);
      return acc;
    }, []).sort();
    setSectors(sectorsList);
    return sectorsList;
  };

  const rangeHours = Array.from({ length: 24 }).map((_, index) => index);

  useEffect(() => {
    fetchSectorsFunction();
  }, []);

  return (
    <div>
      <div className="columns mt-1 mb-0">
        <div className="column is-three-fifths is-offset-one-fifth">
          <div className="control">
            <h1 className="is-size-4 has-text-centered has-text-weight-bold">Filtro de Dados</h1>
          </div>
        </div>
      </div>
      <form onSubmit={ (e) =>  e.preventDefault() }>
        <div className="columns mx-2">
          <div className="column is-2 is-offset-4 field">
            <label className="label">Data Inicial *
              <div className="control">
              <input className="input" id="date-initial" type="date" value={ startDate } onChange={(e) => setStartDate(e.target.value)} />
            </div>
            </label>
          </div>
          <div className="field column is-2">
            <label className="label">Data Final *
              <div className="control">
              <input className="input" id="date-final" type="date" value={ endDate } onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            </label>
          </div>
        </div>
        <div className="columns mx-2 is-hidden" id='notification'>        
          <div className="column is-4 is-offset-4 notification is-danger has-text-centered" >
            <button className="delete is-small" onClick={ () => getStatusNotification(false) }></button>
            * Campo obrigatório!
          </div>
        </div>
        <div className="columns mx-2">
          <div className="column">
            <label className="label">Tipo
              <div className="control">
                <div className="select">
                  <select className="select" onChange={ (e) => setTypeCallsLocal(e.target.value) }>
                    <option value="">Selecione</option>
                    <option value="Efetuada">Efetuada</option>
                    <option value="Recebida">Recebida</option>
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className="column">
            <label className="label">Status
              <div className="control">
                <div className="select pl-0">
                  <select className="select" onChange={(e) => setStatusCallLocal(e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="ANSWERED">Atendida</option>
                    <option value="NO ANSWER">Não Atendida</option>
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className="column">
            <label className="label">Setor
              <div className="control">
                <div className="select pl-0">
                  <select className="select" onChange={(e) => setSectorLocal(e.target.value)}>
                    <option value="">Selecione</option>
                    { 
                      sectors.sort(verifySort).map((sector, index) => <option key={ index } value={ sector.toLowerCase() }>{ sector }</option>)
                    }
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className="column">
            <label className="label">Ramal
              <div className="control">
                <div className="select">
                  <select className="select" onChange={(e) => setEndpointLocal(e.target.value)}>
                    <option value="">Selecione</option>
                    { 
                      endpoints.filter((endpoint) => endpoint.resource.length < 5 &&  endpoint.resource >= 1000).sort((a, b) => a.resource - b.resource).map((endpoint, index) => <option key={ index } value={ endpoint.resource }>{ endpoint.resource }</option>)
                    }
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className="column">
            <label className="label">Hora Inicial
              <div className="control">
                <div className="select">
                  <select className="select" onChange={(e) => setStartHour(e.target.value)}>
                    <option value="">Selecione</option>
                    { 
                      rangeHours.map((hour, index) => <option key={ index } value={ hour }>{ hour }</option>)
                    }
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className="column">
            <label className="label">Hora Final
              <div className="control">
                <div className="select">
                  <select className="select" onChange={(e) => setEndHour(e.target.value)}>
                    <option value="">Selecione</option>
                    { 
                      rangeHours.map((hour, index) => <option key={ index } value={ hour }>{ hour }</option>)
                    }
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className="field column">
            <label className="label">Protocolo
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Digite do prot."
                  onChange={ (e) => setProtocolLocal(e.target.value) }
                />
              </div>
            </label>
          </div>
          <div className="field column">
            <label className="label">Telefone
              <div className="control">
                <input className="input"
                  type="text"
                  placeholder="Apenas números"
                  onChange={ (e) => setPhoneNumberLocal(e.target.value) } />
              </div>
            </label>
          </div>
        </div>
        <div className="columns is-centered mx-2">
            <div className="field column is-one-quarter">
                <div className="control">
                  <button className="button is-info is-fullwidth px-1" type="submit" onClick={ () => sendDataToFilter() }>
                    <span className="icon">
                      <FontAwesomeIcon icon={faFilter} fixedWidth />
                    </span>
                    <span>
                      FILTRAR
                    </span>
                  </button>
                </div>
            </div>
          </div>
      </form>
    </div>
  );
};

FilterReportsCalls.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  setStartDate: PropTypes.func,
  setEndDate: PropTypes.func,
  sendDataToFilter: PropTypes.func,
  setStartHour: PropTypes.func,
  setEndHour: PropTypes.func,
  setSectorLocal: PropTypes.func,
  setEndpointLocal: PropTypes.func,
  setStatusCallLocal: PropTypes.func,
  setProtocolLocal: PropTypes.func,
  setPhoneNumberLocal: PropTypes.func,
  setTypeCallsLocal: PropTypes.func,
};

export default FilterReportsCalls;

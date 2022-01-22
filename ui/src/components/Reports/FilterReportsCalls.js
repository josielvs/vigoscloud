import React, { useContext, useState, useEffect } from 'react';
import { fetchSectors, fetchDataReport, fetchDataReportList } from '../../services/api';

import PbxContext from '../../context/PbxContext'
import '../../libs/bulma.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

const FilterReportsCalls = ({ getAllDataDb }) => {
  const getItensStateGlobal = useContext(PbxContext);
  const { endpoints, setStorageDataReport, verifySort } = getItensStateGlobal;

  const [notification, setNotification] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startHour, setStartHour] = useState(0);
  const [endHour, setEndHour] = useState(23);
  const [sectorLocal, setSectorLocal] = useState('');
  const [endpointLocal, setEndpointLocal] = useState('');
  const [sectorDbLocal, setSectorDbLocal] = useState([]);
  const [statusCallLocal, setStatusCallLocal] = useState('');
  const [protocolLocal, setProtocolLocal] = useState('');
  const [phoneNumberLocal, setPhoneNumberLocal] = useState('');
  const [typeCallsLocal, setTypeCallsLocal] = useState('');

  const fetchSectorsFunction = async () => { 
    const getSectorsInDb = await fetchSectors();
    const sectorsList = Object.values(getSectorsInDb);
    setSectorDbLocal(sectorsList);
    return sectorsList;
  };

  const rangeHours = Array.from({ length: 24 }).map((_, index) => index);

  const getStatusNotification = (status) => {
    if (notification === status) return;

    const notificationDiv = document.querySelector('#notification').classList;
    notificationDiv.toggle('is-hidden');

    const inputDateInitial = document.querySelector('#date-initial').classList;
    inputDateInitial.toggle('is-danger');

    const inputDateFinal = document.querySelector('#date-final').classList;
    inputDateFinal.toggle('is-danger');
    
    setNotification(status);
    return;
  };

  const getListCallsRows = async () => {
    const localFetchDataReportList = await fetchDataReportList({
        dateStart: startDate,
        dateStop: endDate,
        hourStart: `${startHour}:00:00`,
        hourStop: `${endHour}:59:59`,
        sector: sectorLocal,
        getEndpoint: endpointLocal,
        telNumber: phoneNumberLocal,
        getProtocol: protocolLocal,
        statusCall: statusCallLocal,
        typeRecOrEfet: typeCallsLocal,
        limit: 3000,
        offset: 0,
      });
    getAllDataDb(localFetchDataReportList)
    return;
  };
  
  const addFiltersOnReport = async () => {
    if (!startDate || !endDate) return getStatusNotification(true);
    const localFetchDataReport = await fetchDataReport(
      {
        dateStart: startDate,
        dateStop: endDate,
        hourStart: `${startHour}:00:00`,
        hourStop: `${endHour}:59:59`,
        sector: sectorLocal,
        getEndpoint: endpointLocal,
        telNumber: phoneNumberLocal,
        getProtocol: protocolLocal,
      });
    setStorageDataReport(localFetchDataReport);
    getListCallsRows();
    return;
  };

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
      <form>
        <div className="columns mx-2">
          <div className="column is-2 is-offset-4 field">
            <label className="label">Data Inicial *
              <div className="control">
              <input className="input" id="date-initial" type="date" onChange={(e) => setStartDate(e.target.value)} />
            </div>
            </label>
          </div>
          <div className="field column is-2">
            <label className="label">Data Final *
              <div className="control">
              <input className="input" id="date-final" type="date" onChange={(e) => setEndDate(e.target.value)}
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
                  <select className="select" value={ typeCallsLocal } onChange={ (e) => setTypeCallsLocal(e.target.value) }>
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
                  <select className="select" value={ statusCallLocal } onChange={(e) => setStatusCallLocal(e.target.value)}>
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
                      sectorDbLocal.sort(verifySort).map((sector, index) => <option key={ index } value={ sector.sectors }>{ sector.sectors }</option>)
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
                      endpoints.sort((a, b) => a - b).filter((endpoint) => endpoint.resource.length < 5).map((endpoint, index) => <option key={ index } value={ endpoint.resource }>{ endpoint.resource }</option>)
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
                <input className="input" type="text" placeholder="Digite do prot." onChange={ (e) => setProtocolLocal(e.target.value) } />
              </div>
            </label>
          </div>
          <div className="field column">
            <label className="label">Telefone
              <div className="control">
                <input className="input" type="text" placeholder="Apenas números" onChange={ (e) => setPhoneNumberLocal(e.target.value) } />
              </div>
            </label>
          </div>
        </div>
        <div className="columns is-centered mx-2">
            <div className="field column is-one-quarter">
                <div className="control">
                  <button className="button is-info is-fullwidth px-1" type="button" onClick={ () => addFiltersOnReport() }>
                  {/* <button className="button is-info is-fullwidth px-1" type="button" onClick={ () => testeqqq() }> */}
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

export default FilterReportsCalls;

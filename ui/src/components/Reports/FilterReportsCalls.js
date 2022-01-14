import React, { useContext, useState, useEffect } from 'react';
import { fetchSectors } from '../../services/api';

import PbxContext from '../../context/PbxContext'
import '../../libs/bulma.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const FilterReportsCalls = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { endpoints, storageDataReport, sectorsDb } = getItensStateGlobal;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sectorDB, setSectorsDB] = useState([]);
  const [sectorLocal, setSectorLocal] = useState('');
  const [statusCallLocal, setStatusCallLocal] = useState('');
  const [protocolLocal, setProtocolLocal] = useState('');
  const [typeCallsLocal, setTypeCallsLocal] = useState('');

  const fetchSectorsFunction = async () => { 
    const getSectorsInDb = await fetchSectors();
    const sectorsList = Object.values(getSectorsInDb);
    setSectorsDB(sectorsList);
    return sectorsList;
  };
  
  const fetchIntemsToFilter = async () => {
    
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
            <label className="label">Data Inicial
              <div className="control">
              <input className="input" type="date" onChange={(e) => setStartDate(e.target.value)} />
            </div>
            </label>
          </div>
          <div className="field column is-2">
            <label className="label">Data Final
              <div className="control">
              <input className="input" type="date" onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            </label>
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
                  <select className="select" value={ sectorLocal } onChange={(e) => setSectorLocal(e.target.value)}>
                    <option value="">Selecione</option>
                    { 
                      sectorDB.map((sector, index) => <option key={ index } value={ sector.sectors }>{ sector.sectors }</option>)
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
                  <select className="select" value={ statusCallLocal } onChange={(e) => setStatusCallLocal(e.target.value)}>
                    <option value="">Selecione</option>
                    { 
                      endpoints.filter((endpoint) => endpoint.resource.length < 5).map((endpoint, index) => <option key={ index } value={ endpoint.resource }>{ endpoint.resource }</option>)
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
        <div className="columns mx-2">
          {/* <div className="column mx-0">
            <label className="label is-flex-wrap-nowrap">Duração (em segundos)
              <div className="control">
                <input className="input" type="number" placeholder="Ex.: 60" onChange={ (e) => setDurationLocal(e.target.value) } />
              </div>
            </label>
          </div>
          <div className="column mx-0">
            <label className="label">Espera (em segundos)
              <div className="control">
                <input className="input" type="number" placeholder="Ex.: 60" />
              </div>
            </label>
          </div> */}
        </div>
        <div className="columns is-centered mx-2">
            <div className="field column is-one-quarter">
                <div className="control">
                  <button className="button is-info is-fullwidth px-1" type="button" onClick={ () => addFiltersOnCalls() }>
                    <span className="icon">
                      <FontAwesomeIcon icon={faSearch} fixedWidth />
                    </span>
                    <span>
                      BUSCAR
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

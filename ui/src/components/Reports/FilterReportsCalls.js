import React, { useContext, useState, useEffect } from 'react';
import { fetchCallsByDateDB } from '../../services/api';

import PbxContext from '../../context/PbxContext'
import '../../libs/bulma.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const FilterReportsCalls = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { setCallsDb, dateConverter } = getItensStateGlobal;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filtredByDate, setFiltredByDate] = useState([]);

  // const addOthersFilters = (calls) => {
  //   const filterCall = calls.
  // };

  const readCallsOnDate = async () => {
    const callsOnSelectedDate = await fetchCallsByDateDB({ dateStart: startDate, dateStop: endDate });
    console.log(callsOnSelectedDate);
    // addOthersFilters(callsOnSelectedDate);
    // setFiltredByDate(callsOnSelectedDate);
  };

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
          <div className="field column mx-0">
            <label className="label">Data Inicial
              <div className="control">
              <input className="input" type="date" onChange={(e) => setStartDate(e.target.value)} />
            </div>
            </label>
          </div>
          <div className="field column mx-0">
            <label className="label">Data Final
              <div className="control">
              <input className="input" type="date" onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            </label>
          </div>
          <div className="column mx-0 mt-1 is-one-quarter">
            <div className="field column mt-2">
                <div className="control">
                  <button className="button is-info is-fullwidth" type="button" onClick={ () => readCallsOnDate() }>
                    <span className="icon">
                      <FontAwesomeIcon icon={faSearch} fixedWidth />
                    </span>
                    <span>
                      FILTRAR DATA
                    </span>
                  </button>
                </div>
            </div>
          </div>
        </div>
        <div className="columns mx-2">
          <div className="column is-4 mx-0">
            <label className="label">Tipo
              <div className="control">
                <div className="select column is-full pl-0">
                  <select className="column is-full">
                    <option className="column">Selecione</option>
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className="column is-4 mx-0">
            <label className="label">Status
              <div className="control">
                <div className="select column is-full pl-0">
                  <select className="select column is-full">
                    <option>Selecione</option>
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className="column is-4 mx-0">
            <label className="label">Setor
              <div className="control">
                <div className="select column is-full pl-0">
                  <select className="select column is-full">
                    <option>Selecione</option>
                  </select>
                </div>
              </div>
            </label>
          </div>
        </div>
        <div className="columns mx-2">
          <div className="field column mx-0">
            <label className="label">Protocolo
              <div className="control">
                <input className="input" type="text" placeholder="Digite do prot."/>
              </div>
            </label>
          </div>
          <div className="field column mx-0">
            <label className="label">Código de Área
              <div className="control">
                <input className="input" type="text" placeholder="Digite o DDD"/>
              </div>
            </label>
          </div>
          <div className="field column mx-0">
            <label className="label">Telefone
              <div className="control">
                <input className="input" type="text" placeholder="Apenas números"/>
              </div>
            </label>
          </div>
          <div className="column mx-0">
            <label className="label is-flex-wrap-nowrap">Duração (seg.)
              <div className="control">
                <input className="input" type="number" placeholder="Ex.: 60"/>
              </div>
            </label>
          </div>
          <div className="column mx-0">
            <label className="label">Espera (seg.)
              <div className="control">
                <input className="input" type="number" placeholder="Ex.: 60"/>
              </div>
            </label>
          </div>
        </div>
        <div className="columns mx-2">
          <div className="column is-one-fifth mx-1">
            <label className="label">
              <input className="mr-1" type="checkbox"/>
                Filtrar por Ramal
              <div className="control">
                <div className="select is-multiple is-hidden">
                  <select multiple size="8">
                    <option value="Argentina">Argentina</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Chile">Chile</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Guyana">Guyana</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Peru">Peru</option>
                    <option value="Suriname">Suriname</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Venezuela">Venezuela</option>
                  </select>
                </div>
              </div>
            </label>
          </div>
        </div>
        <div className="columns is-centered mx-2">
            <div className="field column is-one-quarter">
                <div className="control">
                  <button className="button is-info is-fullwidth px-1" type="button" onClick={ () => readCallsOnDate() }>
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

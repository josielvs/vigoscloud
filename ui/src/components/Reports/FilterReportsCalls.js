import React, { useContext, useState } from 'react';

import PbxContext from '../../context/PbxContext'
import '../../libs/bulma.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const FilterReportsCalls = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { setCallsDb } = getItensStateGlobal;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
          <div className="field column is-2 mx-1">
            <label className="label">Data Inicial
              <div className="control">
              <input className="input" type="date" name="start-date"/>
            </div>
            </label>
          </div>
          <div className="field column is-2 mx-1">
            <label className="label">Data Final
              <div className="control">
              <input className="input" type="date" name="end-date"/>
            </div>
            </label>
          </div>
          <div className="field column mx-1">
            <label className="label">Protocolo
              <div className="control">
                <input className="input" type="text" placeholder="Digite do protocolo"/>
              </div>
            </label>
          </div>
          <div className="field column mx-1">
            <label className="label">Código de Área
              <div className="control">
                <input className="input" type="text" placeholder="Digite do DDD - Ex.: 11"/>
              </div>
            </label>
          </div>
          <div className="field column mx-1">
            <label className="label">Telefone
              <div className="control">
                <input className="input" type="text" placeholder="Somente números"/>
              </div>
            </label>
          </div>
          <div className="column mx-1">
            <label className="label is-flex-wrap-nowrap">Tempo em Linha (seg.)
              <div className="control">
                <input className="input" type="number" placeholder="Ex.: 60"/>
              </div>
            </label>
          </div>
          <div className="column mx-1">
            <label className="label">Tempo Espera (seg.)
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
                <div class="select is-multiple is-hidden">
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
        <div className="columns mx-2">
            {/* <div className="field column is-two-fifths mx-1"> */}
            <div className="field column is-three-fifths is-offset-one-fifth">
                <div className="control has-text-centered">
                  <button class="button is-info px-6">
                    <span class="icon">
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

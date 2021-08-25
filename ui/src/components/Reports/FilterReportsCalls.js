import React, { useContext, useState, useEffect } from 'react';
import { fetchCallsByDateDB } from '../../services/api';

import PbxContext from '../../context/PbxContext'
import '../../libs/bulma.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const FilterReportsCalls = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { callsDb, setCallsDb, formatClidCalls, addStatusCalls } = getItensStateGlobal;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [extensionsList, setExtensionsList] = useState([]);
  const [typeCallsLocal, setTypeCallsLocal] = useState('');
  const [sectorLocal, setSectorLocal] = useState('');
  const [statusCallLocal, setStatusCallLocal] = useState('');
  const [protocolLocal, setProtocolLocal] = useState('');
  const [areaCodeLocal, setAreaCodeLocal] = useState('');
  const [phoneNumberLocal, setPhoneNumberLocal] = useState('');
  const [durationLocal, setDurationLocal] = useState('');
  const [waitLocal, setWaitLocal] = useState('');
  const [extensionsLocal, setExtensionsLocal] = useState({});

  const filterEndpointsExten = (data) => {
    const extensSended = data
      .filter((call) => call.clid.length > 2 && call.clid.length < 5)
      .map((call) => call.clid);

    const extenReceived = data
      .filter((call) => call.lastapp === 'Queue' && call.dstchannel.includes('PJSIP'))
      .map((call) => call.dstchannel.split('/')[1].split('-')[0]);
    
    const union = extenReceived.concat(extensSended);

    const result = union.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);

    console.log('Filter_Line_40',callsDb);

    return setExtensionsList(result.sort());
  };

  const addFiltersOnCalls = () => {
    const result = callsDb.filter((call) => typeCallsLocal === '' ? call : call.typecall === typeCallsLocal)
      .filter((call) => statusCallLocal === '' ? call : call.disposition === statusCallLocal)
      .filter((call) => sectorLocal === '' ? call : call.lastdata === sectorLocal)

    return setCallsDb(result);
  };

  const readCallsOnDate = async () => {
    const callsOnSelectedDate = await fetchCallsByDateDB({ dateStart: startDate, dateStop: endDate });
    let dataFormated = formatClidCalls(callsOnSelectedDate);
    dataFormated = addStatusCalls(dataFormated);
    filterEndpointsExten(dataFormated);
    return setCallsDb(dataFormated);
  };

  const handleChange = (e) => {
    let value = Array.from(e.target.selectedOptions, option => option.value);
    setExtensionsLocal({ values: value });
  }

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
                      FILTRAR POR DATA
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
                  <select className="column is-full" value={ typeCallsLocal } onChange={ (e) => setTypeCallsLocal(e.target.value) }>
                    <option className="column" value="">Selecione</option>
                    <option value="Efetuada">Efetuada</option>
                    <option value="Recebida">Recebida</option>
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className="column is-4 mx-0">
            <label className="label">Status
              <div className="control">
                <div className="select column is-full pl-0">
                  <select className="select column is-full" value={ statusCallLocal } onChange={(e) => setStatusCallLocal(e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="ANSWERED">Atendida</option>
                    <option value="NO ANSWER">Não Atendida</option>
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className="column is-4 mx-0">
            <label className="label">Setor
              <div className="control">
                <div className="select column is-full pl-0">
                  <select className="select column is-full" value={ sectorLocal } onChange={(e) => setSectorLocal(e.target.value)}>
                    <option value="">Selecione</option>
                    { 
                      callsDb
                        .filter((call) => call.lastapp === 'Queue')
                        .reduce((unique, item) => unique.includes(item.lastdata) ? unique : [...unique, item.lastdata], [])
                        .map((sector, index) => <option key={index} value={sector}>{ sector.charAt(0).toUpperCase() + sector.slice(1).split(',')[0] }</option>)
                    }
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
                <input className="input" type="text" placeholder="Digite do prot." onChange={ (e) => setProtocolLocal(e.target.value) } />
              </div>
            </label>
          </div>
          <div className="field column mx-0">
            <label className="label">Código de Área
              <div className="control">
                <input className="input" type="text" placeholder="Digite o DDD" onChange={ (e) => setAreaCodeLocal(e.target.value) } />
              </div>
            </label>
          </div>
          <div className="field column mx-0">
            <label className="label">Telefone
              <div className="control">
                <input className="input" type="text" placeholder="Apenas números" onChange={ (e) => setPhoneNumberLocal(e.target.value) } />
              </div>
            </label>
          </div>
          <div className="column mx-0">
            <label className="label is-flex-wrap-nowrap">Duração (seg.)
              <div className="control">
                <input className="input" type="number" placeholder="Ex.: 60" onChange={ (e) => setDurationLocal(e.target.value) } />
              </div>
            </label>
          </div>
          <div className="column mx-0">
            <label className="label">Espera (seg.)
              <div className="control">
                <input className="input" type="number" placeholder="Ex.: 60" onChange={ (e) => setWaitLocal(e.target.value) } />
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
                {/* <div className="select is-multiple is-hidden"> */}
                <div className="select is-multiple">
                  <select multiple size="8" name="endpoints" onChange={ (e) => handleChange(e) }>
                    <option value="">Selecione</option>
                    { 
                      extensionsList
                        .map((extension, index) => <option value={extension} key={index}>{ extension }</option>)
                    }
                  </select>
                </div>
              </div>
            </label>
          </div>
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

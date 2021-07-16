import React, { useContext, useState } from 'react';
import PbxContext from '../../context/PbxContext';
import { clickToCall } from '../../services';

const FilterDateReports = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { callsDb, setCallsDb, dataDbImutate, setFilterReportList, setCheckFilter } = getItensStateGlobal;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [columnSelected, setColumnSelected] = useState('');
  const [dataOfColumn, setDataOfColumn] = useState('');

  const convertDate = (dateInput) => {
    if(dateInput !== undefined) {
      const dateFullReceived = dateInput.includes(dateInput);
      let dateForUse;
      if(dateFullReceived) dateForUse = dateInput.split("T");
        dateForUse = dateInput.split('-');
        const newDate = new Date(
          parseInt(dateForUse[0], 10),
          parseInt(dateForUse[1], 10) - 1,
          parseInt(dateForUse[2], 10))
        return newDate;
    }
    return null;
  };

  const sendCall = async () => {
    const call = await clickToCall();
    return call;
  };

  const convertDateForFind = (data) => {
    const { name, value } = data;
    if (name === 'start-date') {
      setStartDate(value);
    } else {
      setEndDate(value)
    }
  }

  const filterDataSelected = (data) => {
    const dataFiltredByselectValue = data.filter(call => dataOfColumn ? call[columnSelected] === dataOfColumn : call);
    setCallsDb(dataFiltredByselectValue);
  }

  const filterDateResult = async () => {
    let dataInicial = convertDate(startDate);
    let dataFinal = convertDate(endDate);

    let callFiltredByDate = await callsDb.filter(result => {
      return convertDate(result.calldate) >= dataInicial && convertDate(result.calldate) <= dataFinal;
    }).filter(call => dataOfColumn ? call[columnSelected] === dataOfColumn : call);
    
    filterDataSelected(callFiltredByDate);

    setCallsDb(callFiltredByDate);

    setCheckFilter(true);
    setFilterReportList({
      startDateStateGlobal: startDate,
      endDateStateGlobal: endDate,
      columnGlobalState: columnSelected,
      dataOfColumGlobalState: dataOfColumn,
    });
  };

  return (
    <div className="card-content">
      <h2>Filtro de Dados</h2>
      <br />
      <div className="field">
        <div>
          <label className="label">Data Inicial</label>
          <div className="control filter-buttom" >
            <input className="input is-normal date-input" type="date" name="start-date" onChange={(e) => convertDateForFind(e.target)} />
          </div>
        </div>
        <div>
          <label className="label">Data Final</label>
          <div className="control filter-buttom">
            <input className="input is-normal" type="date" name="end-date" onChange={(e) => convertDateForFind(e.target)} />
          </div>
        </div>
        <div>
          <label className="label">Itens de Filtro</label>
          <div className="select filter-buttom">
            <select  value={columnSelected} onChange={(e) => setColumnSelected(e.target.value)}>
              <option value="">Selecione</option>
	            {/* <option value="duration">Tempo Total da Ligação</option> */}
              <option value="statuscall">Status da Ligação</option>
              <option value="typecall">Tipo</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label">Filtro</label>
          <div className="select filter-buttom">
            <select value={dataOfColumn} onChange={(e) => setDataOfColumn(e.target.value)}>
              <option value="">Selecione</option>
              { columnSelected
                ? dataDbImutate.map(valuesResult => {
                  if(columnSelected === 'calldate') {
                    const alterDate = valuesResult[columnSelected].split('T')[0];
                    return alterDate;
                  }
                  return valuesResult[columnSelected]
                })
                .filter((elem, index, self) =>  index === self.indexOf(elem) && elem !== '')
                .map((result, index) => <option key={index} >{ result }</option>)
                : null }
            </select>
          </div>
        </div>
        <div className="btn-filter">
          <button className="button is-info filter-buttom" onClick={ filterDateResult } >
            Filtrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterDateReports;

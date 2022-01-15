import React, { useContext, useEffect, useState } from 'react';
import ReportTable from './ReportTable';
import NoDataLoad from './NoDataLoad';
import PbxContext from '../../context/PbxContext'
import { accessLocalStorage } from '../../services';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';

const ReportList = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const [userDbLocal, setUserDbLocal] = useState({});
  const { callsDb } = getItensStateGlobal;

  const convertDateAndTime = (call) => {
    const addZero = (number) => {
      return number <= 9 ? `0${number}` : number;
    }
    const dateReceived = call.calldate.split('T');
    let dateFormated = dateReceived[0].split('-');
    dateFormated = `${dateFormated[2]}/${dateFormated[1]}/${dateFormated[0]}`;
    const upGetDate = new Date(call.calldate);
    const updateTime = `${addZero(upGetDate.getHours())}:${addZero(upGetDate.getMinutes())}:${addZero(upGetDate.getSeconds())}`;
    const dateBrNew = `${dateFormated} ${updateTime}`

    return dateBrNew;
  };

  const secConvert = (time) => {
    const hours = Math.floor( time / 3600 );
    const minutes = Math.floor( (time % 3600) / 60 );
    const seconds = time % 60;
    
    const doubleDigitsMinutes = minutes < 10 ? `0${minutes}` : minutes;      
    const doubleDigitsSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const doubleDigitsHours = hours < 10 ? `0${hours}` : hours;

    const timeFullFormated = `${doubleDigitsHours}:${doubleDigitsMinutes}:${doubleDigitsSeconds}`
    
    return timeFullFormated;
  }

  const callDestinationConvert = (call) => {
    let numberOfDestination = call.dstchannel;
    numberOfDestination = numberOfDestination.includes('-') ? numberOfDestination.split('/')[1] : numberOfDestination;
    numberOfDestination = numberOfDestination.includes('-') ? numberOfDestination.split('-')[0] : numberOfDestination;
    numberOfDestination = numberOfDestination.includes('@') ? numberOfDestination.split('@')[0] : numberOfDestination;
    return numberOfDestination;
  };

  const addKeyProtocolNumber = (objectArray, properties) => {
    return objectArray.reduce((acc, obj) => {
      let key = obj[properties];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  };

  const checkCallResponsedOrNot = (allCalls) => {
    const addCallsOfProtocol = addKeyProtocolNumber(allCalls, 'callprotocol');
    return addCallsOfProtocol;
  };
  // console.log(checkCallResponsedOrNot(callsDb));

  const csvGenerate = () => {
    let csv = 'Data e Hora, Ligação De, Ligação Para, Status da Ligação, Tipo, Total da Ligação, Tempo Em Linha, Protocolo\n';

    callsDb.forEach(row => {
      csv += row.dateBrFull;
      csv += `,${row.src}`;
      csv += `,${row.dst}`;
      csv += `,${row.statuscall}`;
      csv += `,${row.typecall}`;
      csv += `,${row.callDuration}`;
      csv += `,${row.callBillsec}`;
      csv += `,${row.callprotocol}`;
      csv += '\n';
    });

    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Relatorio.csv';
    hiddenElement.click();
  };
  
  const getUserDataLocal = async () => {
    const dataUser = await accessLocalStorage.getUserLocalStorage(); 
    const { user } = dataUser;
    setUserDbLocal(user);
    return;
  };

  useEffect(() => {
    getUserDataLocal();
  }, []);

  return callsDb && callsDb === [] ? { NoDataLoad } : (
    <div className="report-page">
      <hr />
      <section className="section calls-information">
        <div className="table-container">
          <div className="columns mt-1 mb-0">
            <div className="column is-three-fifths is-offset-one-fifth">
              <div className="control">
                <h1 className="is-size-4 has-text-centered has-text-weight-bold">Histórico de Chamadas</h1>
              </div>
            </div>
          </div>
          <div className="is-flex-desktop">
            <button className="button is-info is-pulled-right px-6" onClick={ csvGenerate }>
              <span>
                <FontAwesomeIcon icon={faFileCsv} fixedWidth />
              </span>
              <span> Download CSV</span>
            </button>
          </div>
          <div className="table-container is-flex-wrap-wrap">
          <table id="tableCalls" className="table is-hoverable is-striped is-fullwidth">
              <thead>
                  <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Ligação De</th>
                  <th scope="col">Ligação Para</th>
                  <th scope="col">Status da Ligação</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Total da Ligação</th>
                  <th scope="col">Tempo Em Linha</th>
                  <th scope="col">Protocolo</th>
                  <th scope="col">Gravação</th>
                  </tr>
              </thead>
              {
               callsDb.filter(call => call.callprotocol && call.src.length > 2).map((call, index) => {
                  const newFormatDateFull = convertDateAndTime(call);

                  const callDuration = secConvert(call.duration);
                  const callBillsec = secConvert(call.billsec);

                  const isInternalNumberPhone = call.typecall === 'Recebida' ? callDestinationConvert(call) : call.dst;

                  call['dst'] = isInternalNumberPhone;
                  call['dateBrFull'] = newFormatDateFull;
                  call['callDuration'] = callDuration;
                  call['callBillsec'] = callBillsec;

                  return <ReportTable key={ index } call={ call } />;
                })
              }
          </table>
          </div>
        </div>
      </section>
      <br />
    </div>
  )
}

export default ReportList;

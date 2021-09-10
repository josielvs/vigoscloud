import React, { useContext } from 'react';
import ReportTable from './ReportTable';
import PbxContext from '../../context/PbxContext'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';

const ReportList = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { callsDb } = getItensStateGlobal;

  const csvGenerate = () => {
    let csv = 'Data e Hora, Ligação De, Ligação Para, Total da Ligação, Tempo Em Linha, Tipo, Status da Ligação, Protocolo\n';

    callsDb.forEach(row => {
      csv += row.dateBrFull;
      csv += `,${row.src}`;
      csv += `,${row.dst}`;
      csv += `,${row.callDuration}`;
      csv += `,${row.callBillsec}`;
      csv += `,${row.typecall}`;
      csv += `,${row.statuscall}`;
      csv += `,${row.callprotocol}`;
      csv += '\n';
    });

    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Relatorio.csv';
    hiddenElement.click();
  };

  return (
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
          {/* <div className="is-flex-desktop">
            <button className="button is-info is-pulled-right px-6" onClick={ csvGenerate }>
              <span>
                <FontAwesomeIcon icon={faFileCsv} fixedWidth />
              </span>
              <span> Download CSV</span>
            </button>
          </div> */}
          <div className="table-container is-flex-wrap-wrap">
          <table id="tableCalls" className="table is-hoverable is-striped is-fullwidth">
              <thead>
                  <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Ligação De</th>
                  <th scope="col">Ligação Para</th>
                  <th scope="col">Total da Ligação</th>
                  <th scope="col">Tempo Em Linha</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Status da Ligação</th>
                  <th scope="col">Protocolo</th>
                  <th scope="col">Gravação</th>
                  </tr>
              </thead>
              {
               callsDb.filter(call => call.callprotocol).map((call, index) => {
                  function addZero(number){
                    if (number <= 9)
                        return "0" + number;
                    else
                        return number;
                  }
                  const dateReceived = call.calldate.split('T');
                  let dateFormated = dateReceived[0].split('-');
                  dateFormated = `${dateFormated[2]}/${dateFormated[1]}/${dateFormated[0]}`;
                  const upGetDate = new Date(call.calldate);
                  const updateTime = `${addZero(upGetDate.getHours())}:${addZero(upGetDate.getMinutes())}:${addZero(upGetDate.getSeconds())}`;
                  const newFormatDateFull = `${dateFormated} ${updateTime}`;

                  function secConvert(time){
                    const hours = Math.floor( time / 3600 );
                    const minutes = Math.floor( (time % 3600) / 60 );
                    const seconds = time % 60;
                    
                    const doubleDigitsMinutes = minutes < 10 ? `0${minutes}` : minutes;      
                    const doubleDigitsSeconds = seconds < 10 ? `0${seconds}` : seconds;
                    const doubleDigitsHours = hours < 10 ? `0${hours}` : hours;
                    
                    return `${doubleDigitsHours}:${doubleDigitsMinutes}:${doubleDigitsSeconds}`;
                  }

                  const callDuration = secConvert(call.duration);
                  const callBillsec = secConvert(call.billsec);

                  let isInternalNumberPhone;
                  if(call.typecall === 'Recebida') {
                    isInternalNumberPhone = call.dstchannel;
                    isInternalNumberPhone = isInternalNumberPhone.split('/')[1];
                    isInternalNumberPhone = isInternalNumberPhone && isInternalNumberPhone.includes('-') ? isInternalNumberPhone.split('-')[0] : isInternalNumberPhone;
                    isInternalNumberPhone = isInternalNumberPhone.includes('@') ? isInternalNumberPhone.split('@')[0] : isInternalNumberPhone;
                  } else {
                    isInternalNumberPhone = call.dst;
                  }

                  call['dst'] = isInternalNumberPhone;
                  call['dateBrFull'] = newFormatDateFull;
                  call['callDuration'] = callDuration;
                  call['callBillsec'] = callBillsec;

                  return <ReportTable key={ index } call={ call } />
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

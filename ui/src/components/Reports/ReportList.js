import React, { useContext } from 'react';
import ReportTable from './ReportTable';
import PbxContext from '../../context/PbxContext'

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
          <h1>Histórico de Chamadas</h1>
          <div className="download-calls">
            <button className="button is-info is-pulled-right" onClick={ csvGenerate } style={ { width: '260px' } } > Baixar CSV </button>
          </div>
          <hr />
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
                    isInternalNumberPhone = isInternalNumberPhone.split('-')[0];
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
      </section>
      <br />
    </div>
  )
}

export default ReportList;
import React, { useContext } from 'react';
import PbxContext from '../../context/PbxContext';

const TableReceivedCalls = () =>  {
  const getItensStateGlobal = useContext(PbxContext);
  const { storageDataReport } = getItensStateGlobal;

  const { globalReportToTableReceived } = storageDataReport;
  const {
    amount_calls,
    answered_calls,
    no_answer_calls,
    busy_calls,
    transshipment_calls,
    total_time_calls,
    average_time_calls,
    average_queue_calls
  } = globalReportToTableReceived;

  return (
    <div className="column is-half">
      <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr className='has-background-info'>
            <th className='has-text-primary-light is-spaced is-justify-content-center' colSpan="2">Contatos Recebidos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Contatos</td>
            <th>{ amount_calls }</th>
          </tr>
          <tr>
            <td>Total Contatos Atendidos</td>
            <th>{ answered_calls }</th>
          </tr>
          <tr>
            <td>Total Contatos Não Atendidos</td>
            <th>{ no_answer_calls }</th>
          </tr>
          <tr>
            <td>Total Contatos Ocupados</td>
            <th>{ busy_calls }</th>
          </tr>
          <tr>
            <td>Chamadas de Transbordo</td>
            <th>{ transshipment_calls }</th>
          </tr>
          <tr>
            <td>Duração Total</td>
            <th>{ total_time_calls }</th>
          </tr>
          <tr>
            <td>Tempo Médio</td>
            <th>{ average_time_calls }</th>
          </tr>
          <tr>
            <td>Tempo Médio na Fila (Atendidos)</td>
            <th>{ average_queue_calls }</th>
          </tr>
        </tbody>
      </table>
    </div>
  )
};

export default TableReceivedCalls;

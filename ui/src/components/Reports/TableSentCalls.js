import React, { useContext } from 'react';
import PbxContext from '../../context/PbxContext';

const TableSentCalls = () =>  {
  const getItensStateGlobal = useContext(PbxContext);
  const { storageDataReport } = getItensStateGlobal;

  const { globalReportToTableSent } = storageDataReport;
  const {
    amount_calls,
    total_time_calls,
    average_time_calls,
    answered_calls,
    busy_calls,
    failed_calls,
    no_answer_calls
  } = globalReportToTableSent;

  return (
    <div className="column is-half">
      <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr className='has-background-success'>
            <th className='has-text-primary-light is-spaced is-justify-content-center' colSpan="2">Contatos Realizados</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ligações Realizada para Contatos</td>
            <th>{ amount_calls }</th>
          </tr>
          <tr>
            <td>Total Contatos Realizados Atendidos</td>
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
            <td>Total Contatos com Falha</td>
            <th>{ failed_calls }</th>
          </tr>
          <tr>
            <td>Duração Total</td>
            <th>{ total_time_calls }</th>
          </tr>
          <tr>
            <td>Tempo Médio</td>
            <th>{ average_time_calls }</th>
          </tr>
        </tbody>
      </table>
    </div>
  )
};

export default TableSentCalls;

import React from 'react';

const TableSentCalls = () =>  {

  return (
    <div className="column is-half">
      <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr className='has-background-success'>
            <th className='has-text-primary-light is-spaced is-justify-content-center' colspan="2">Contatos Recebidos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ligações Realizada para Contatos</td>
            <th>6749</th>
          </tr>
          <tr>
            <td>Duração Total</td>
            <th>11:12:38</th>
          </tr>
          <tr>
            <td>Tempo Médio</td>
            <th>00:18:32</th>
          </tr>
          <tr>
            <td>Total Contatos Realizados Atendidos</td>
            <th>5309</th>
          </tr>
          <tr>
            <td>Total Contatos Não Atendidos</td>
            <th>1341</th>
          </tr>
          <tr>
            <td>Total Contatos Ocupados</td>
            <th>99</th>
          </tr>
        </tbody>
      </table>
    </div>
  )
};

export default TableSentCalls;

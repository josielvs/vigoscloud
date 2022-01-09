import React from 'react';

const TableReceivedCalls = () =>  {

  return (
    <div className="column is-half">
      <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr className='has-background-info'>
            <th className='has-text-primary-light is-spaced is-justify-content-center' colspan="2">Contatos Recebidos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ligações Atendidas de Contatos</td>
            <th>8427</th>
          </tr>
          <tr>
            <td>Total Contatos Atendidos</td>
            <th>6067</th>
          </tr>
          <tr>
            <td>Total Contatos Não Atendidos</td>
            <th>2239</th>
          </tr>
          <tr>
            <td>Total Contatos Ocupados</td>
            <th>121</th>
          </tr>
          <tr>
            <td>Chamadas de Transbordo</td>
            <th>1</th>
          </tr>
          <tr>
            <td>Duração Total</td>
            <th>14:52:50</th>
          </tr>
          <tr>
            <td>Tempo Médio</td>
            <th>00:13:17</th>
          </tr>
          <tr>
            <td>Tempo Médio na Fila (Atendidos)</td>
            <th>00:00:09</th>
          </tr>
        </tbody>
      </table>
    </div>
  )
};

export default TableReceivedCalls;

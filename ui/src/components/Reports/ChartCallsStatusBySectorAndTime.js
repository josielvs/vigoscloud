import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

const ChartCallsStatusBySectorAndTime = () => {
  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
  );

  const valueLabelsNaoAtendidas = [{ '8': 5, '9': 6, '10': 7, '11': 1, '12': 2, '13': 0, '14': 0, '15': 7, '16': 1, '17': 4, '18': 2 }];

  const data = {
    labels: ['Comercial', 'Financeiro', 'Suporte', 'Pós Vendas', 'RH', 'Compras'],
    datasets: [
      {
        label: 'Hora',
        data: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Não Atendidas',
        data: valueLabelsNaoAtendidas.map((label) => valueLabelsNaoAtendidas[0][label]),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="column is-half">
      <h2 className="has-text-left is-size-5">Status das Chamadas por Setor</h2>
      <Radar data={data} />
    </div>
  );
}


export default ChartCallsStatusBySectorAndTime;


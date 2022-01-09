import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartCallsStatusPie = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Total Global (Todos Setores)',
      },
    },
  };

  const data = {
    labels: ['Internas', 'Externas'],
    datasets: [
      {
        data: [12, 19],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="column is-2 is-offset-1">
      <h2 className="has-text-left is-size-5">Tipos de Ligações Realizadas</h2>
      <Doughnut className='py-1' options={options} data={data} />
    </div>
  )
}

export default ChartCallsStatusPie;

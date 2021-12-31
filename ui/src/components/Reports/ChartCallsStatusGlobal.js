import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

const ChartBySector = () => {

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'none',
      },
      title: {
        display: true,
        text: 'Total Global (Todos Setores)',
      },
    },
  };

  const valueLabelsAtendidas = [{ 'Atendidas': 1103, 'Não Atendidas': 230 }];
  const labels = ['Atendidas', 'Não Atendidas'];
  
  const data = {
    labels,
    datasets: [
      {
        label: '',
        data: labels.map((label) => valueLabelsAtendidas[0][label]),
        backgroundColor: ['rgba(53, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'],
      },
    ],
  };


  return (
    <div className="column is-half">
      <h2 className="has-text-left is-size-5">Status das Chamadas Global</h2>
        <Bar options={options} data={data} />
    </div>
  );
}

export default ChartBySector;

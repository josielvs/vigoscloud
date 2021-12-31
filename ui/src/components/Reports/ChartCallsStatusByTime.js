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
import { Line } from 'react-chartjs-2';

const ChartCallsStatusByTime = () => {

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
        position: 'top',
      },
      title: {
        display: true,
        // text: 'Chart.js Bar Chart',
      },
    },
  };

  const valueLabelsAtendidas = [{ '8': 23, '9': 34, '10': 76, '11': 21, '12': 11, '13': 4, '14': 7, '15': 45, '16': 3, '17': 23, '18': 17 }];
  const valueLabelsNaoAtendidas = [{ '8': 5, '9': 6, '10': 7, '11': 1, '12': 2, '13': 0, '14': 0, '15': 7, '16': 1, '17': 4, '18': 2 }];
  const labels = ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Atendidas',
        data: labels.map((label) => valueLabelsAtendidas[0][label]),
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      },
      {
        label: 'Não Atendidas',
        data: labels.map((label) => valueLabelsNaoAtendidas[0][label]),
        fill: false,
        borderColor: "#742774"
      }
    ]
  };


  return (
    <div className="column">
      <h2 className="has-text-left is-size-5">Status das Chamadas por Hora</h2>
        <Line options={options} data={data} />
    </div>
  );
}

export default ChartCallsStatusByTime;

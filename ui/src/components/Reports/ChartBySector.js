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
        position: 'top',
      },
      title: {
        display: true,
        // text: 'Chart.js Bar Chart',
      },
    },
  };

  const valueLabelsAtendidas = [{ 'Comercial': 89, 'Financeiro': 200, 'Suporte': 150, 'Pós Vendas': 300, 'RH': 112, 'Compras': 380 }];
  const valueLabelsNaoAtendidas = [{ 'Comercial': 30, 'Financeiro': 12, 'Suporte': 20, 'Pós Vendas': 80, 'RH': 60, 'Compras': 90 }];
  const labels = ['Comercial', 'Financeiro', 'Suporte', 'Pós Vendas', 'RH', 'Compras'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Atendidas',
        data: labels.map((label) => valueLabelsAtendidas[0][label]),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Não Atendidas',
        data: labels.map((label) => valueLabelsNaoAtendidas[0][label]),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };


  return (
    <div className="column is-half">
      <h2 className="has-text-left is-size-5">Status das Chamadas por Setor</h2>
        <Bar options={options} data={data} />
    </div>
  );
}

export default ChartBySector;

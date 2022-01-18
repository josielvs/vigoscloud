import React, { useContext } from 'react';
import PbxContext from '../../context/PbxContext';
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
  const getItensStateGlobal = useContext(PbxContext);
  const { storageDataReport } = getItensStateGlobal;

  const { globalAnsweredAndNotAnswer } = storageDataReport;

  const valueReceived = Object.values(globalAnsweredAndNotAnswer);

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

  const valueLabelsAtendidas = [{ 'Atendidas': valueReceived[0], 'Não Atendidas': valueReceived[1] }];
  const labels = ['Atendidas', 'Não Atendidas'];
  
  const data = {
    labels,
    datasets: [
      {
        label: '',
        data: labels.map((label) => valueLabelsAtendidas[0][label]),
        backgroundColor: ['rgba(30, 144, 255, 0.7)', 'rgba(255, 99, 132, 0.5)'],
      },
    ],
  };


  return (
    <div className="column is-half">
      <h2 className="has-text-centered is-size-5">Status das Chamadas Global</h2>
        <Bar options={options} data={data} />
    </div>
  );
}

export default ChartBySector;

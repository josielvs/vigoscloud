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
  const { storageDataReport, verifySort } = getItensStateGlobal;

  const { volumeSectorsReceivedAnswered, volumeSectorsReceivedNotAnswer } = storageDataReport;
  
  const callsSentsAnswered = volumeSectorsReceivedAnswered.reduce((obj, item) => ((obj[item.sectors] = item.answered), obj),{});
  const callsSentsNotAnswer = volumeSectorsReceivedNotAnswer.reduce((obj, item) => ((obj[item.sectors] = item.no_answer), obj),{});
  
  const valueLabelsAtendidas = [callsSentsAnswered];
  const valueLabelsNaoAtendidas = [callsSentsNotAnswer];
  
  const labelsAnswered = Object.keys(callsSentsAnswered);
  const labelNoAnswer = Object.keys(callsSentsNotAnswer);
  const labelsVerify = labelsAnswered.concat(labelNoAnswer).sort(verifySort);;
  const labels = [...new Set(labelsVerify)];

  console.log(volumeSectorsReceivedNotAnswer);
  
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

  const data = {
    labels,
    datasets: [
      {
        label: 'Atendidas',
        data: labels.map((label) => valueLabelsAtendidas[0][label]),
        backgroundColor: 'rgba(30, 144, 255, 0.7)',
      },
      {
        label: 'Não Atendidas',
        data: labels.map((label) => valueLabelsNaoAtendidas[0][label]),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };


  return (
    <div className="column is-one-third">
      <h2 className="has-text-left is-size-5">Status das Chamadas por Setor</h2>
        <Bar options={options} data={data} />
    </div>
  );
}

export default ChartBySector;

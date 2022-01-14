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

const ChartsSent = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { storageDataReport, verifySort } = getItensStateGlobal;

  const { volumeEndpointsSentAnswered, volumeEndpointsSentNoAnswer } = storageDataReport;

  const callsSentsAnswered = volumeEndpointsSentAnswered.reduce((obj, item) => ((obj[item.endpoints] = item.sent_answered), obj),{});
  const callsSentsNotAnswer = volumeEndpointsSentNoAnswer.reduce((obj, item) => ((obj[item.endpoints] = item.sent_no_answer), obj),{});
 
  const valueLabelsAtendidas = [callsSentsAnswered];
  const valueLabelsNaoAtendidas = [callsSentsNotAnswer];

  const labelsAnswered = Object.keys(callsSentsAnswered);
  const labelNoAnswer = Object.keys(callsSentsNotAnswer);
  const labelsVerify = labelsAnswered.concat(labelNoAnswer).sort(verifySort).filter((keylabel) => keylabel.length < 5);
  const labels = [...new Set(labelsVerify)];

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
        backgroundColor: 'rgba(0, 179, 60, 0.7)',
        borderColor: 'rgb(0, 179, 60, 0.5))',
      },
      {
        label: 'Não Atendidas',
        data: labels.map((label) => valueLabelsNaoAtendidas[0][label]),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  
  return (
    <div className="column column is-4 is-offset-0">
      <h2 className="has-text-left is-size-5">Chamadas Realizadas por Ramal</h2>
        <Bar options={options} data={data} />
    </div>
  );
}

export default ChartsSent;

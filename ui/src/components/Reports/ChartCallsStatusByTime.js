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
import { Line } from 'react-chartjs-2';

const ChartCallsStatusByTime = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { storageDataReport, verifySort } = getItensStateGlobal;

  const { volumeHourReceivedAnswered, volumeHourReceivedNoAnswer } = storageDataReport;
  
  const callsSentsAnswered = volumeHourReceivedAnswered.reduce((obj, item) => ((obj[Number(item.hours_calls)] = item.answered), obj),{});
  const callsSentsNotAnswer = volumeHourReceivedNoAnswer.reduce((obj, item) => ((obj[Number(item.hours_calls)] = item.no_answer), obj),{});
  
  const valueLabelsAtendidas = [callsSentsAnswered];
  const valueLabelsNaoAtendidas = [callsSentsNotAnswer];
  
  const labelsAnswered = Object.keys(callsSentsAnswered);
  const labelNoAnswer = Object.keys(callsSentsNotAnswer);
  const labelsVerify = labelsAnswered.concat(labelNoAnswer).sort((a, b) => a - b);
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
        fill: true,
        backgroundColor: "rgba(53, 162, 235,0.2)",
        borderColor: "rgba(30, 144, 255, 0.7)"
      },
      {
        label: 'Não Atendidas',
        data: labels.map((label) => valueLabelsNaoAtendidas[0][label]),
        fill: false,
        borderColor: "rgba(255, 99, 132, 0.7)"
      }
    ]
  };

  const exportExcelDownload = async () => {
    const arrayAtendidas = valueLabelsAtendidas[0];
    const arrayNaoAtendidas = valueLabelsNaoAtendidas[0];

    const total_hour = labels.map((hour) => hour);

    const data = total_hour.map((hour) => {
      const atendidas = arrayAtendidas[hour] ? arrayAtendidas[hour] : '0';
      const naoAtendidas = arrayNaoAtendidas[hour] ? arrayNaoAtendidas[hour] : '0';
      const objElements = { hour, atendidas, naoAtendidas };
      return objElements;
    });
    return { name: 'Chamadas_Hora', description: 'Chamadas Por Hora', data }
  };
  console.log(exportExcelDownload());

  return (
    <div className="column is-half">
      <h2 className="has-text-centered is-size-5">Status das Chamadas por Hora</h2>
        <Line options={options} data={data} />
    </div>
  );
}

export default ChartCallsStatusByTime;

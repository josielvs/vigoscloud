import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
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

const ChartsReceived = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { storageDataReport, verifySort } = getItensStateGlobal;

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const { volumeEndpointsReceivedAnswered, volumeEndpointsReceivedNotAnswer } = storageDataReport;

  const callsRecevedsAnswered = volumeEndpointsReceivedAnswered.reduce((obj, item) => ((obj[item.endpoints] = item.received_answered), obj),{});
  const callsRecevedsNotAnswer = volumeEndpointsReceivedNotAnswer.reduce((obj, item) => ((obj[item.endpoints] = item.received_no_aswer), obj),{});

  const valueLabelsAnswered = [callsRecevedsAnswered];
  const valueLabelsNoAnswer = [callsRecevedsNotAnswer];

  const labelsAnswered = Object.keys(callsRecevedsAnswered);
  const labelNoAnswer = Object.keys(callsRecevedsNotAnswer);
  const labelsVerify = labelsAnswered.concat(labelNoAnswer).sort(verifySort).filter((keylabel) => keylabel.length >= 2 && keylabel.length <= 4);
  const labels = [...new Set(labelsVerify)];

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
        data: labels.map((label) => valueLabelsAnswered[0][label]),
        backgroundColor: 'rgba(30, 144, 255, 0.8)',
        borderColor: 'rgb(30, 144, 255, 0, 0.8)',
      },
      {
        label: 'Não Atendidas',
        data: labels.map((label) => valueLabelsNoAnswer[0][label]),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  
  return (
    <div className="column is-half">
      <h2 className="has-text-centered is-size-5">Chamadas Recebidas por Ramal</h2>
        <Bar options={options} data={data} />
    </div>
  );
}

export default ChartsReceived;

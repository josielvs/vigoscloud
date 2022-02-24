import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

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

const ChartBySector = ({ getRows }) => {
  const getItensStateGlobal = useContext(PbxContext);
  const { storageDataReport, verifySort, capitalizeFirstLetter } = getItensStateGlobal;

  const { volumeSectorsReceivedAnswered, volumeSectorsReceivedNotAnswer } = storageDataReport;

  const chartRef = useRef(null);
  
  const callsSentsAnswered = volumeSectorsReceivedAnswered.reduce((obj, item) => ((obj[item.sectors] = item.answered), obj),{});
  const callsSentsNotAnswer = volumeSectorsReceivedNotAnswer.reduce((obj, item) => ((obj[item.sectors] = item.no_answer), obj),{});
  
  const valueLabelsAtendidas = [callsSentsAnswered];
  const valueLabelsNaoAtendidas = [callsSentsNotAnswer];
  
  const labelsAnswered = Object.keys(callsSentsAnswered);
  const labelNoAnswer = Object.keys(callsSentsNotAnswer);
  const labelsVerify = labelsAnswered.concat(labelNoAnswer).sort(verifySort);
  const labelsMerge = [...new Set(labelsVerify)].filter((sector) => sector !== 'Porteiros');
  const labels = labelsMerge.map((label) => label.length > 4 ? capitalizeFirstLetter(label) : label.toUpperCase());
  
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
        data: labels.map((label) => valueLabelsAtendidas[0][label.toLowerCase()]),
        backgroundColor: 'rgba(30, 144, 255, 0.7)',
      },
      {
        label: 'Não Atendidas',
        data: labels.map((label) => valueLabelsNaoAtendidas[0][label.toLowerCase()]),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const getDataToRequestFilter = (event) => {
    if (chartRef.current) {
    const chart = ChartJS.getChart(chartRef.current);
    const clickedElements = chart.getElementsAtEventForMode(event, 'nearest',{ intersect: true }, true);
    if (clickedElements.length > 0) {
      const firstElement = clickedElements[0];
      const labelType = chart.data.datasets[firstElement.datasetIndex].label;
      const labelIndexClicked = chart.data.labels[firstElement.index];
      getRows(labelIndexClicked.toLowerCase(), labelType.slice(0, labelType.length - 1));
      // console.log(labelIndexClicked.toLowerCase(), labelType.slice(0, labelType.length - 1));
    }
   }
  };

  return (
    <div className="column is-half">
      <h2 className="has-text-centered is-size-5">Status das Chamadas por Setor</h2>
      <Bar
        options={options}
        data={data}
        ref={chartRef}
        getElementAtEvent={(_, event) => getDataToRequestFilter(event)}
      />
    </div>
  );
}

ChartBySector.propTypes = {
  getRows: PropTypes.func,
};

export default ChartBySector;

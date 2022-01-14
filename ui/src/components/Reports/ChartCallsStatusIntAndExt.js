import React, { useContext } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import PbxContext from '../../context/PbxContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartCallsStatusPie = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { storageDataReport } = getItensStateGlobal;

  const { volumeCallsInternalsAndExternals } = storageDataReport;

  const labelsReceived = Object.keys(volumeCallsInternalsAndExternals);
  const dataValues = Object.values(volumeCallsInternalsAndExternals);

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
    labels: labelsReceived,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          'rgba(0, 179, 60, 0.7)',
          'rgba(117, 163, 163, 0.5)',
        ],
        borderColor: [
          'rgba(0, 179, 60, 0.7)',
          'rgba(117, 163, 163, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="column is-2 is-offset-1">
      <h2 className="has-text-centered is-size-5">Ligações Realizadas</h2>
      <Doughnut className='py-1' options={options} data={data} />
    </div>
  )
}

export default ChartCallsStatusPie;

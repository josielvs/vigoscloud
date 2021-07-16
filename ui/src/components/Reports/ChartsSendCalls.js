import React, { useCallback, useContext, useEffect, useState } from 'react';
import PbxContext from '../../context/PbxContext'
import { Bar } from 'react-chartjs-2';

const Charts = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { callsDb } = getItensStateGlobal;
  const [labels, setLabels] = useState([]);
  const [chartItems, setChartItens] = useState({
    datasets: [
      {
        label: '',
        backgroundColor: 'rgba(30,144,255)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: [0],
      }
    ],
  });

  const chartBarGenerate = useCallback(() => {
    const endpointsArray = [];

    let dateFormated;
    callsDb.filter(call => call.callprotocol).forEach(element => {
      const dateReceived = element.calldate.split('T');
      dateFormated = dateReceived[0].split('-');
      dateFormated = `${dateFormated[2]}/${dateFormated[1]}/${dateFormated[0]}`;

      const endpointSize = element.src;
      if (endpointSize.length < 5 && element.statuscall === 'Atendida') {
        endpointsArray.push(element.src);
      }
    });

    const endpointList = callsDb.filter(element => {
      const isPhoneInternal = element.src;
      if(isPhoneInternal.length < 5 && Number(isPhoneInternal)) {
        return element;
      }
      return null;
    }).reduce((object, item) => {
      let endpoint = item.src;
      if (endpoint.length === 7) {
        let formatEndpoint = item.lastdata;
        formatEndpoint = formatEndpoint.split('/')[1];
        endpoint = formatEndpoint.split(',')[0];
      }
      if ( !object[endpoint] ) {
         object[endpoint]=1;
      } else {
         object[endpoint]++;
      }
      return object; 
    },{});

    const axisYSet = Object.values(endpointList).reduce((acc, cur, array) => {
      if (acc < cur) acc = cur + 4;
      return acc;
    }, 0);

    setLabels(Object.keys(endpointList));
    setChartItens({
      datasets: [
        {
          label: dateFormated,
          backgroundColor: 'rgb(187, 255, 0)',
          borderColor: 'rgb(102, 255, 0)',
          borderWidth: 1,
          data: [...Object.values(endpointList), axisYSet],
        }
      ]
    });
    console.log([...Object.values(endpointList), axisYSet]);
  }, [callsDb]);
  
  useEffect(() => {
    chartBarGenerate();
  }, [chartBarGenerate])

  const { datasets } = chartItems;
  return (
    // <div className="chart-calls-atended">
    <div className="column is-half">
      <h2 className="has-text-left is-size-5">Chamadas Realizadas</h2>
        <Bar
          data={ {labels, datasets } }
          options={{
            title:{
              display:true,
              text:'Chamadas Realizadas',
              fontSize:20,
            },
            legend:{
              display:false,
              position:'right'
            },
            scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
            }
          }}
        />
    </div>
  );
}

export default Charts;

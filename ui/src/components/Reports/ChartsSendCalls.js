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

    let dateFormated;
    callsDb.filter(call => call.callprotocol).forEach(element => {
      const dateReceived = element.calldate.split('T');
      dateFormated = dateReceived[0].split('-');
      dateFormated = `${dateFormated[2]}/${dateFormated[1]}/${dateFormated[0]}`;
    });
    const actualDate = new Date();
    dateFormated ? dateFormated : dateFormated = `${actualDate.getDate()}/${actualDate.getMonth()+1}/${actualDate.getFullYear()}`;

    const reduceEndipoints = callsDb.reduce((acc, cur) => {
      const endpoint = cur.src;
      if (endpoint.length < 5 && acc[cur.src] && cur.disposition === 'ANSWERED' && cur.typecall === 'Efetuada') {
        acc[cur.src] += 1;
      } else if (!acc[cur.src] && endpoint.length < 5) {
        acc[cur.src] = 1;
      }
      return acc;
    }, {});

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

    const axisYSet = Object.values(endpointList).reduce((acc, cur) => {
      if (acc < cur) acc = cur + 1;
      return acc <= 6 ? 7 : acc;
    }, 0);

    setLabels(Object.keys(endpointList));
    setChartItens({
      datasets: [
        {
          label: dateFormated,
          backgroundColor: 'rgb(187, 255, 0)',
          borderColor: 'rgb(102, 255, 0)',
          borderWidth: 1,
          data: [...Object.values(reduceEndipoints), axisYSet],
        }
      ]
    });
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


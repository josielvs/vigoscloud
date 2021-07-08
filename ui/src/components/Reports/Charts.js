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

      const endpointSize = element.dst;
      if (endpointSize.length < 5) {
        endpointsArray.push(element.dst);
      }
    });

    const endpointList = callsDb.filter(element => {
      const isPhoneInternal = element.dst;
      if(isPhoneInternal.length < 5 && Number(isPhoneInternal)) {
        return element;
      }
      return null;
    }).reduce((object, item) => {
      if (item.billsec > 0) {
        let endpoint = item.dst;
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
      }
      return object; 
    },{});

    setLabels(Object.keys(endpointList));
    setChartItens({
      datasets: [
        {
          label: dateFormated,
          backgroundColor: 'rgba(30,144,255)',
          borderColor: 'rgba(30,144,255)',
          borderWidth: 1,
          data: Object.values(endpointList),
        }
      ]
    })
  }, [callsDb]);
  
  useEffect(() => {
    chartBarGenerate();
  }, [chartBarGenerate])
  
  const { datasets } = chartItems;
  return (
    <div className="chart-calls-atended">
      <h2>Chamadas Recebidas</h2>
      <Bar
        data={ {labels, datasets } }
        options={{
          title:{
            display:true,
            text:'Quantidade de Atendimentos',
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

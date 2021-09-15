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

    const reduceEndipoints = callsDb.reduce((acc, cur) => {
      const endpoint = cur.dst;
      const checkClid = cur.clid;
      if (endpoint.length < 5 && acc[cur.dst] && cur.disposition === 'ANSWERED' && cur.typecall === 'Efetuada' && endpoint.length !== checkClid.length) {
        acc[cur.dst] += 1;
      } else if (!acc[cur.dst] && endpoint.length < 5) {
        acc[cur.dst] = 1;
      }
      return acc;
    }, {});
    // Josiel
    const endpointList = callsDb.filter(element => {
      const isPhoneInternal = element.dst;
      if(isPhoneInternal.length < 5 && Number(isPhoneInternal)) {
        return element;
      }
      return null;
    }).reduce((object, item) => {
      if (item.billsec > 0) {
        let endpoint = item.dst;
        const sourceCall = item.src;
        if (endpoint.length === 7) {
          let formatEndpoint = item.lastdata;
          formatEndpoint = formatEndpoint.split('/')[1];
          endpoint = formatEndpoint.split(',')[0];
        }
        if (!object[endpoint] && endpoint.length !== sourceCall.length) {
          object[endpoint] = 1;
        } else if (endpoint.length !== sourceCall.length) {
          object[endpoint]++;
        }
      }
      return object; 
    },{});

    const axisYSet = Object.values(reduceEndipoints).reduce((acc, cur) => {
      if (acc < cur) acc = cur + 1;
      return acc <= 6 ? 7 : acc;
    }, 0);

    setLabels(Object.keys(endpointList));
    setChartItens({
      datasets: [
        {
          label: dateFormated,
          backgroundColor: 'rgba(30,144,255)',
          borderColor: 'rgba(30,144,255)',
          borderWidth: 0,
          data: [...Object.values(endpointList), axisYSet],
        }
      ],
    })
  }, [callsDb]);
  
  useEffect(() => {
    chartBarGenerate();
  }, [chartBarGenerate])
  
  const { datasets } = chartItems;
  return (
    <div className="column is-half">
      <h2 className="has-text-left is-size-5">Chamadas Recebidas</h2>
      <Bar
        data={ { labels, datasets } }
        options={{
          title: {
            display: true,
            text: 'Quantidade de Atendimentos',
            fontSize:20,
          },
          legend:{
            display: true,
            position: 'right'
          },
          options: {
              scales: {
                  y: {
                      beginAtZero: true
                  }
              }
          }
        }}
      />
    </div>
  );
}

export default Charts;

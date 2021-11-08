import React, { useContext, useEffect } from 'react';

import EndpointCard from './EndpointCard';
import PbxContext from '../../context/PbxContext';

import down from '../../sounds/down.mp3';
import up from '../../sounds/up.mp3';

const EndpointsList = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { endpoints, ipEndpoints } = getItensStateGlobal;


  const playSoundState = async (state) => {
    const audio = new Audio(state);
    await audio.play();
  }

  const fnTeste = () => {
    return document.getElementById(ipEndpoints.endpoint);
  };
  
  useEffect(() => {
    fnTeste();
  }, [ipEndpoints]);

    let newEndpoints = endpoints;
    if(!newEndpoints) newEndpoints = [];
    if(newEndpoints !== []) newEndpoints.sort((a, b) => a.resource - b.resource)
    const elementsPage = (
      <div className="columns is-multiline is-centered mx-2 mt-6">
            {
              newEndpoints.filter((endpoint) => {
                const sizeNameEndpoint = endpoint.resource;
                if(sizeNameEndpoint.length <= 4) {
                  return endpoint;
                }
                return null;
              }).map((endpoint) => {
                if(ipEndpoints.endpoint === endpoint.resource) {
                  const classNamed = endpoint.state === 'online' ? 'has-background-success' : 'has-background-primary-light';
                  endpoint = {
                    technology: endpoint.technology,
                    resource: endpoint.resource,
                    state: endpoint.state,
                    channel_ids: endpoint.channel_ids,
                    myClass: classNamed,
                    ip: ipEndpoints.ip,
                  };
                }
                return <EndpointCard key={endpoint.resource} endpoint={endpoint} />
              })
            }
      </div>);
    return (
      <div className="body-div my-3">
        <div className="columns is-multiline is-centered mx-2 mt-6">
          {
            newEndpoints.filter((endpoint) => {
              const sizeNameEndpoint = endpoint.resource;
              if(sizeNameEndpoint.length <= 4) {
                return endpoint;
              }
              return null;
            }).map((endpoint) => {
              if(ipEndpoints.endpoint === endpoint.resource) {
                const classNamed = endpoint.state === 'online' ? 'has-background-success' : 'has-background-primary-light';
                endpoint = {
                  technology: endpoint.technology,
                  resource: endpoint.resource,
                  state: endpoint.state,
                  channel_ids: endpoint.channel_ids,
                  myClass: classNamed,
                  ip: ipEndpoints.ip,
                };
              }
              return <EndpointCard key={endpoint.resource} endpoint={endpoint} />
            })
          }
         </div>
      </div>
    )
};

export default EndpointsList;


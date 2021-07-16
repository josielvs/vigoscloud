import React, { useContext } from 'react';
import EndpointCard from './EndpointCard';
import PbxContext from '../../context/PbxContext';

const EndpointsList = () => {
  const getItensStateGlobal = useContext(PbxContext);
  const { endpoints, ipEndpoints } = getItensStateGlobal;

    let newEndpoints = endpoints;
    if(!newEndpoints) newEndpoints = [];
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
      // <div className="home">
      //   <h1 className="is-size-4 has-text-centered has-text-weight-bold">Status Ramais</h1>
      //   <div className="endpoints-information">
      //     <div className="endpoints-display">
      //       {
      //         newEndpoints.filter((endpoint) => {
      //           const sizeNameEndpoint = endpoint.resource;
      //           if(sizeNameEndpoint.length <= 4) {
      //             return endpoint;
      //           }
      //           return null;
      //         }).map((endpoint) => {
      //           if(ipEndpoints.endpoint === endpoint.resource) {
      //             endpoint = {
      //               technology: endpoint.technology,
      //               resource: endpoint.resource,
      //               state: endpoint.state,
      //               channel_ids: endpoint.channel_ids,
      //               ip: ipEndpoints.ip,
      //             };
      //           }
      //           return <EndpointCard key={endpoint.resource} endpoint={endpoint} />
      //         })
      //       }
      //     </div>
      //   </div>
      // </div>;
    return (
      <div className="body-div my-3">
        <div>{ elementsPage }</div>
      </div>
    )
}

export default EndpointsList;

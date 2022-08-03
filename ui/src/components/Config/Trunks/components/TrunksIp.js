import React from 'react';

function TrunkIp(props) {
  const { changeValues } = props;
  /*
    IP:
      {
        "provider": "Embratel",
        "ipSbcTrunk": "172.23.25.100",
        "ipLocal": "200.201.11.12",
        "trunkNumber": "1432230303",
        "codec": "alaw",
        "authUsername": "",
        "password": "",
        "type": "IP"
      }
  */

  return (
    <div>
      <div className="columns mx-2">
        <div className="column is-4 is-offset-1 field">
          <label className="label">Nome do Provedor (Operadora)
            <div className="control">
              <input className="input" name="provider" type="text" onChange={(e) => changeValues(e.target)} placeholder="Nome" />
              <p name="provider-invalid-data" className='has-text-danger is-size-7 is-hidden'>Caracteres inválidos!</p>
            </div>
          </label>
        </div>
        <div className="column is-4 is-offset-1 field">
          <label className="label">Número Tronco (DDR)
            <div className="control">
              <input className="input" name="trunkNumber" type="text" onChange={(e) => changeValues(e.target)} placeholder="1431110000" />
              <p name="trunkNumber-invalid-data" className='has-text-danger is-size-7 is-hidden'>Caracteres inválidos!</p>
            </div>
          </label>
        </div>
      </div>
      <div className="columns mx-2">
        <div className="column is-3 is-offset-1 field">
          <label className="label">IP SIP (Operadora)
            <div className="control">
              <input className="input" name="ipSbcTrunk" type="text" onBlur={(e) => changeValues(e.target)} placeholder="1.0.0.1" />
              <p name="ipSbcTrunk-invalid-data" className='has-text-danger is-size-7 is-hidden'>Caracteres inválidos!</p>
            </div>
          </label>
        </div>
        <div className="column is-3 field">
          <label className="label">IP Local (IP SIP Local)
            <div className="control">
              <input className="input" name="ipLocal" type="text" onBlur={(e) => changeValues(e.target)} placeholder="2.0.0.1" />
              <p name="ipLocal-invalid-data" className='has-text-danger is-size-7 is-hidden'>Caracteres inválidos!</p>
            </div>
          </label>
        </div>
        <div className="column is-3 field">
          <label className="label">Codec
            <div className="control">
              <div name="codec" className="select is-fullwidth">
                <select className="select" name="codec" onChange={(e) => changeValues(e.target)} >
                  <option value="">Selecione</option>
                  <option value="alaw">G.711a (ALAW)</option>
                  <option value="ulaw">G.711b (ULAW)</option>
                </select>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default TrunkIp;

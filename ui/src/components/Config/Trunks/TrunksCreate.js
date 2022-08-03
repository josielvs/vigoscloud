import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import PbxContext from '../../../context/PbxContext';

import TrunksIp from './components/TrunksIp';
import TrunksAuth from './components/TrunksAuth';

import { accessLocalStorage, exportCreateTrunks, valuesAnalyze, changeViewForms } from '../../../services';

import Loading from '../../Loading/LoadingModule';

import '../../../libs/bulma.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSquare } from '@fortawesome/free-solid-svg-icons';

function TrunksCreate() {
  const getItensStateGlobal = useContext(PbxContext);
  const { majoritaryItemsEndpoints, toggleIsHidden, toggleIsChangeFormElements } = getItensStateGlobal;

  let url = window.location.href;
  url = url.split('/')[2];

  const history = useHistory();

  const [values, setValues] = useState({
    "ipLocal": "",
    "trunkNumber": "",
    "authUsername": "",
    "password": "",
  });
  const [validate, setValidate] = useState({});
  const [disable, setDisable] = useState(true);

  const { changeBorderImputToRedOrNormal, changeVisibityMessages} = changeViewForms;

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

    Autenticado:
      {
        "provider": "Algar",
        "ipSbcTrunk": "172.23.1.1",
        "ipLocal": "",
        "trunkNumber": "",
        "codec": "alaw",
        "authUsername": "vigos@vigos",
        "password": "123456",
        "type": "AUTH"
      }
  */

  const validateUserLogged = useCallback(() => {
    const dataUser = accessLocalStorage.getUserLocalStorage();
    const { user: { role } } = dataUser;
    if (!dataUser) return history.push('/');
    if (dataUser && role !== 'root') return history.push('/home');
  }, []);

  const changeScreen = (check, name) => {
    changeBorderImputToRedOrNormal(check, name);
    changeVisibityMessages(check, `${name}-invalid-data`);
  };

  const handleChangeDataAnalyze = (name, value) => {
    const { checkNumber, checkPassword, isTripleChar, isIP } = valuesAnalyze;

    if(name === 'trunkNumber') {
      const checkValueIsNumber = checkNumber(value);
      changeScreen(checkValueIsNumber, name);
      return checkValueIsNumber;
    };

    if(name === 'password') {
      const passwordIsValid = checkPassword(value);
      changeScreen(passwordIsValid, name);
      return passwordIsValid;
    }

    if(name === 'provider') {
      const checkValueIsCharacters = isTripleChar(value);
      changeScreen(checkValueIsCharacters, name);
      return checkValueIsCharacters;
    }

    if(name === 'ipSbcTrunk'|| name === 'ipLocal') {
      const checkValueIsCharacters = isIP(value);
      changeScreen(checkValueIsCharacters, name);
      return checkValueIsCharacters;
    }
  };

  const handleChangeValues = (item) => {
    const { name, value } = item;

    const itemStatus = handleChangeDataAnalyze(name, value);
    setValidate((prevState) => prevState, validate[name] = itemStatus === undefined  ? true : itemStatus);
    setValues((prevState) => prevState, values[name] = value )
    if(Object.keys(validate).length >= 6) Object.values(validate).includes(false) ? setDisable(true) : setDisable(false);
    return;
  };

  const typeTrunkSelected = (item) => {
    const { value } = item;
    if (value === 'IP') {
      changeVisibityMessages(true, 'trunk-auth-div');
      changeVisibityMessages(false, 'trunk-ip-div');
      changeVisibityMessages(false, 'button-send-form');
      handleChangeValues(item);
      return;
    }

    changeVisibityMessages(true, 'trunk-ip-div');
    changeVisibityMessages(false, 'trunk-auth-div');
    changeVisibityMessages(false, 'button-send-form');
    handleChangeValues(item);
    return;
  };

  const sendDataTrunkGenerate = async () => {
    // const filteredProperties = majoritaryItemsEndpoints.filter((item) => !values.hasOwnProperty(item));

    // if(filteredProperties.length > 0) {
    //   toggleIsHidden('#alert-create-endpoints');

    //   filteredProperties.forEach((prop) => {
    //     changeVisibityMessages(false, prop);
    //     changeBorderImputToRedOrNormal(false, prop);
    //   });
    //   return;
    // };

    const fetchEndpoints = await exportCreateTrunks(values);
    // toggleIsChangeFormElements('alert-create-endpoints', 'is-hidden');
    const result = Object.keys(fetchEndpoints).length > 0 ? true : false;
    if(result) {
      // setLoading(false);
      // changeVisibityMessages(true, 'create-form');
      // changeVisibityMessages(true, 'button-send-form');
      changeVisibityMessages(false, 'success-create-trunks');
      setTimeout(() => {
        return history.push('/config/tronco/lista');
      }, 3000);
    };
    return;
  };

  useEffect(() => {
    validateUserLogged();
  }, [validateUserLogged]);

  return (
    <div>
      <div className="columns">
        <div className="column is-half is-offset-one-quarter has-text-centered">
          <strong className="is-size-3">ADICIONAR TRONCOS</strong>
          <hr className="dropdown-divider"/>
        </div>
      </div>
          <article id="success-create-trunks" name="success-create-trunks" className="column is-half is-offset-one-quarter message is-info is-hidden">
            <div className="message-header">
              <p>Sucesso!</p>
              <button className="delete" aria-label="delete" onClick={ () => toggleIsHidden('#success-create-trunks') }></button>
            </div>
            <div className="message-body">
              Tronco criado com <strong>sucesso</strong>!
            </div>
          </article>
      <div className="columns mx-2">
        <div className="column is-2 is-offset-5 field">
          <div className="control has-text-centered">
            <p><strong>Tipo de Tronco</strong></p>
            <label className="radio">
              <input type="radio" className='radio' name="type" value="Auth" onChange={(e) => typeTrunkSelected(e.target)} /> <strong>Autenticado</strong>
            </label>
            <label className="radio ml-5">
              <input type="radio" className='radio' name="type" value="IP" onChange={(e) => typeTrunkSelected(e.target)} /> <strong>IP</strong>
            </label>
            <p name="type-invalid-data" className='has-text-danger is-size-7 is-hidden'>Selecione o tipo de ramal!</p>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column is-half is-offset-one-quarter has-text-centered">
          <div name="trunk-ip-div" className="is-hidden">
            <TrunksIp
              changeValues={handleChangeValues}
            />
          </div>
          <div name="trunk-auth-div" className="is-hidden">
          <TrunksAuth />
          </div>
        </div>
      </div>
          <div id="button-send-form" name="button-send-form" className="columns mt-3 is-hidden">
            <div className="field column mt-3 is-half is-2 is-offset-5 has-text-centered">
              <div className="control">
                <button className="button is-info is-fullwidth mt-3" type="submit" disabled={ disable } onClick={ () => sendDataTrunkGenerate() }>
                  <span className="icon">
                    <FontAwesomeIcon icon={ faPhoneSquare } fixedWidth />
                  </span>
                  <span>
                    CRIAR TRONCO
                  </span>
                </button>
              </div>
            </div>
          </div>
    </div>
  );
}

export default TrunksCreate;

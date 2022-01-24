import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { accessLocalStorage,requestToken, validEmail, validPassword } from '../../services';
import PbxContext from '../../context/PbxContext';
import logo from '../../img/logo.png';

function Login() {
  const getItensStateGlobal = useContext(PbxContext);
  const { setUser, setPath } = getItensStateGlobal;
  const [notification, setNotification] = useState(true);
  const [emailLocal, setEmailLocal] = useState('');
  const [password, setPassword] = useState('');
  const [disable, setDisable] = useState(true);

  const history = useHistory();

  const handleClick = async () => {
    const ipRequest = window.location.href;
    const errorCode = 200;
    const userData = { email: emailLocal, password };
    const response = await requestToken(userData, ipRequest);
    if (response.status !== errorCode) return setNotification(false);
    if (response) accessLocalStorage.setUserLocalStorage({ ...response.data, ipRequest });
    setUser(response.data.user);
    setPath('/home')
    history.push('home');
  };

  useEffect(() => {
    const validateData = () => {
      const validLocalEmail = validEmail(emailLocal);
      const validLocalPass = validPassword(password);
      if (validLocalEmail && validLocalPass) {
        return setDisable(false);
      }
      return setDisable(true);
    }
    validateData();
  }, [emailLocal, password]);

  return (
    <div className="columns py-6 is-flex-desktop">
      <div className="card is-flex-direction-row column is-half is-offset-one-quarter mt-6">
        <form className="card-content is-flex-direction-row column is-full"
          onSubmit={ (e) =>  e.preventDefault() }
        >
        <div className="card-image column is-full">
          {/* style={ { width: '33rem', minWidth: '25rem' } } */}
            <figure className="image column is-tree-fifths"> 
              <img src={logo} alt="Vigos" />
            </figure>
        </div>
          <div className="field column is-full">
            <div className="control column is-full">
              <label className="label">E-mail
                <input
                  className="input is-normal column is-full"
                  type="email"
                  placeholder="Digite o email de acesso"
                  onChange={ (e) => setEmailLocal(e.target.value) }
                  onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                  />
              </label>
            </div>
          </div>
          <div className="field column is-full">
            <div className="control column is-full">
              <label className="label">Senha
                <input
                  className="input is-normal column is-full"
                  type="password"
                  placeholder="Digite a senha"
                  onChange={ (e) => setPassword(e.target.value) }
                  onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                />
              </label>
            </div>
          </div>
          <div className="notification is-danger mx-5" hidden={ notification }>
            <button className="delete" onClick={ () => setNotification(true) }></button>
            Email ou Senha inválidos!
          </div>
          <div className="field column is-full">
            <div className="control column is-full">
              <button
                type="submit"
                onClick={ () => handleClick() }
                className="button is-info column is-half py-0"
                disabled={ disable }
              >
              <p className="column is-full py-0">Entrar</p>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

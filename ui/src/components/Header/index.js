import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import PbxContext from '../../context/PbxContext';
import logo from '../../img/logo.png';
import { accessLocalStorage } from '../../services';

const Header = () => {
  const getItensStateGlobal = useContext(PbxContext);
  let { path, setPath } = getItensStateGlobal;
  const hystoryPath = useHistory().location.pathname;
  if(!path) path = hystoryPath;
  const user = accessLocalStorage.getUserLocalStorage();
  if (!user) return null;
  const { ipRequest } = user;
  const protocolUriActive = ipRequest.replace(/http/i, 'https');
  const burguerViewer = () => {
    const showMenu = document.querySelector('#navMenu');
    showMenu.classList.toggle('is-active');
    showMenu.classList.toggle('is-hidden');
  };
  return path !== '/' ? (
    <div className="navbar header-custon card-header" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <p className="navbar-item">
          <img src={logo} alt="logo" width="200" height="100" />
        </p>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <Link to="/home" className="navbar-item" onClick={() => setPath('/home')}>
            Home
          </Link>
        <div className="navbar-start">
          <Link to={{ pathname: protocolUriActive }} target="_blank" className="navbar-item">
            WebPhone
          </Link>
          <Link to="/relatorios" className="navbar-item" onClick={() => setPath('/relatorios')}>
            Relatórios
          </Link>
          <div className="navbar-item has-dropdown is-hoverable">
            <p className="navbar-link">
              Configurações
            </p>
              <div className="navbar-dropdown">
                <p className="navbar-item">
                  Adicionar Ramais
                </p>
              </div>
            </div>
          </div>
          <div className="navbar-item has-dropdown is-hoverable">
            <p className="navbar-link">
              Troubleshooting
            </p>
              <div className="navbar-dropdown">
                <p className="navbar-item">
                  Análise SIP
                </p>
              </div>
            </div>
        </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons are-small">
                <Link to="/" onClick={() => {
                  accessLocalStorage.removeUserItem();
                  setPath('/');
                }}
                >
                  <button className="button is-sm is-primary">
                    Log out
                  </button>
                </Link>
              </div>
            </div>
          </div>
      </div>
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" onClick={ () => burguerViewer() }>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    )
    : null;
}

export default Header;
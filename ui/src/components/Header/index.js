import React, { useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import PbxContext from '../../context/PbxContext';
import logo from '../../img/logo.png';
import { accessLocalStorage } from '../../services';

const Header = () => {
  const getItensStateGlobal = useContext(PbxContext);
  let { path, setPath, toggleIsChangeFormElements, setComponentConfigIsUp } = getItensStateGlobal;
  const history = useHistory();
  if(!path) path = history.location.pathname;
  const user = accessLocalStorage.getUserLocalStorage();
  if (!user) return null;
  const { user: { role } } = user;
  if(role === 'root') toggleIsChangeFormElements('config-items', 'navbar-dropdown mx-0 px-0 has-text-centered is-active')
  const { ipRequest } = user;
  const protocolUriActive = ipRequest.replace(/http/i, 'https');

  const verifyComponentView = () => {
    const user = accessLocalStorage.getUserLocalStorage();
    const { user: { role } } = user;
    console.log()
    if(role === 'root') toggleIsChangeFormElements('config-items', 'navbar-dropdown mx-0 px-0 has-text-centered is-active')
    return;
  };

  useEffect(() => {
    verifyComponentView();
  }, [])
  
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
          <div className="navbar-item is-hoverable">
            <p className="navbar-link">
              Configurações
            </p>
            <div id="config-items" name="config-items" className="navbar-dropdown mx-0 px-0 has-text-centered is-hidden">
              <div className="dropdown is-hoverable mx-0 px-0">
                <div className="dropdown-trigger mx-0 px-0">
                  <div className=" mx-0 px-0" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span>Ramais</span>
                    <span className="icon is-small">
                      <i className="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                  </div>
                </div>
                <div className="dropdown-menu ml-4" id="dropdown-menu" role="menu">
                  <div className="dropdown-content has-background-light">
                    <Link to="/config/ramal/novo" className="dropdown-item">
                      Criar Ramal
                    </Link>
                    <hr className="dropdown-divider"/>
                    <Link to="/config/ramal/lista" className="dropdown-item">
                      Consultar Ramal
                    </Link>
                    <hr className="dropdown-divider"/>
                    <Link to="/config" className="dropdown-item" onClick={() => toggleIsHidden('#endpoint-upd')}>
                      Alterar Ramal
                    </Link>
                    <hr className="dropdown-divider"/>
                    <Link to="config" className="dropdown-item">
                      Deletar Ramal
                    </Link>
                  </div>
                </div>
              </div>
              <hr className="dropdown-divider"/>
              <div className="dropdown is-hoverable">
                <div className="dropdown-trigger">
                  <div className="" aria-haspopup="true" aria-controls="dropdown-menu-trunks">
                    <span>Tronco</span>
                    <span className="icon is-small">
                      <i className="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                  </div>
                </div>
                <div className="dropdown-menu ml-4" id="dropdown-menu-trunks" role="menu">
                  <div className="dropdown-content has-background-light">
                    <a href="#" className="dropdown-item">
                      Criar Tronco
                    </a>
                    <hr className="dropdown-divider"/>
                    <Link to="/" className="dropdown-item">
                      Consultar Tronco
                    </Link>
                    <hr className="dropdown-divider"/>
                    <a className="dropdown-item">
                      Alterar Tronco
                    </a>
                    <hr className="dropdown-divider"/>
                    <a href="#" className="dropdown-item">
                      Deletar Tronco
                    </a>
                  </div>
                </div>
              </div>
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
              <p className="navbar-item">
                Análise IP
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
      <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" onClick={ () => toggleIsHidden('#navMenu') }>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    )
    : null;
}

export default Header;
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import PbxContext from '../../context/PbxContext';

const Burger = () => {
  const getItensStateGlobal = useContext(PbxContext);
  let { setPath, toggleIsHidden } = getItensStateGlobal;

  const handleClick = (path, toggleId) => {
    setPath(path);
    toggleIsHidden(toggleId);
  }

  return (
    <div className="columns">
      <div
        className="column side-menu-container navbar-item has-dropdown is-hoverable is-hidden"
        id="navMenu"
      >
      <div className="navbar-dropdown">
        <Link
          to="/home"
          className="navbar-item has-text-centered is-fullwidth"
          data-testid="side-menu-item-products"
          onClick={ () => handleClick('/home', '#navMenu') }
        >
          Home
        </Link>
        <Link
          to="/relatorios"
          className="navbar-item has-text-centered is-fullwidth"
          data-testid="side-menu-item-products"
          onClick={ () => handleClick('/relatorios', '#navMenu') }
        >
          Relatórios
        </Link>
        <Link
          to="/"
          className="navbar-item  has-text-centered"
          data-testid="side-menu-item-logout"
          onClick={ () => handleClick('/', '#navMenu') }
        >
          Sair
        </Link>
      </div>
    </div>
  </div>
  );
}

export default Burger;
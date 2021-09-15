import React from 'react';

import '../../libs/bulma.min.css';

// Josiel
const LoadingModule = () => {
  return (
    <div className="field column is-three-fifths is-offset-one-fifth">
      <div className="control has-text-centered">
        <h1 className="mt-6 pt-6"> Não há ligações para a data atual! </h1>
      </div>
    </div>
  )
}

export default LoadingModule;

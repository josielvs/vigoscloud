import React from 'react';
import Loading from '../../img/loading.gif';

import '../../libs/bulma.min.css';

const LoadingModule = () => {
  return (
    <div className="field column is-three-fifths is-offset-one-fifth">
      <div className="control has-text-centered">
        <img className="mt-6 pt-6" src={ Loading } alt="Vigos" />
      </div>
    </div>
  )
}

export default LoadingModule;

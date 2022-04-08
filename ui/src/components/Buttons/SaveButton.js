import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faDownload } from '@fortawesome/free-solid-svg-icons';

const SaveButton = (props) => {
const { generateFile, classStatus } = props;
  return (
    <div className={ `columns is-centered mx-2 ${classStatus}` }>
      <div className="field column is-one-quarter">
        <div className="control">
          <button className={ `button is-link is-light is-fullwidth px-1` } type="submit" onClick={ () => generateFile() }>
            <span className="icon">
              <FontAwesomeIcon icon={ faDownload } fixedWidth />
            </span>
            <span>
              Gerar Arquivo para Download
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveButton;

import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faDownload } from '@fortawesome/free-solid-svg-icons';

const DownloadButton = (props) => {
  const { classStatus, getFileName } = props;
  return (
    <div className={ `columns is-centered mx-2 ${classStatus}` }>
      <div className="field column is-one-quarter">
        <div className="control">
          <button className={ `button is-link is-light is-fullwidth px-1` } type="submit" onClick={ () => getFileName() }>
            <span className="icon">
              <FontAwesomeIcon icon={ faDownload } fixedWidth />
            </span>
            <span>
              Download
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DownloadButton;

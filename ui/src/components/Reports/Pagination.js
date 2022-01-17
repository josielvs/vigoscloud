import React from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../img/loading.gif';

import '../../libs/bulma.min.css';

const Pagination = ({ callsPerPage, totalCalls, paginate, currentPage }) => {
  const pageNumbers = Array.from({ length: Math.ceil(totalCalls / callsPerPage) }).map((_, index) => index).filter((number) => number <= 20);

  return (
    <div className='columns is-centered'>
      <div className='column is-half'>
        <nav className="pagination is-small is-centered" role="navigation" aria-label="pagination">
          {/* <Link to='#' className="pagination-previous" onClick={() => paginate(currentPage + 1)}> Anterior </Link>
          <Link to='#' className="pagination-next" onClick={() => paginate(currentPage + 1)}> Próxima </Link> */}
          <ul className="pagination-list">
            {
              pageNumbers.map((number) => (
                <li><Link to="#" className="pagination-link" aria-label={`Ir para página ${number + 1}`} onClick={() => paginate(number + 1)} > {number + 1} </Link></li>
              ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Pagination;

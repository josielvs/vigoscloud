import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import ReportTable from './ReportTable';
import NoDataLoad from './NoDataLoad';
import PbxContext from '../../context/PbxContext'
import { accessLocalStorage } from '../../services';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
const ReportList = ({ callsList, sortedCalls }) => {
  const getItensStateGlobal = useContext(PbxContext);
  const { storageDataReport } = getItensStateGlobal;

  const [userRoleLocal, setUserRoleLocal] = useState('');
  const [arrow, setArrow] = useState('');

  const getUserDataLocal = async () => {
    const dataUser = await accessLocalStorage.getUserLocalStorage(); 
    const { user } = dataUser;
    setUserRoleLocal(user.role);
    return;
  };

  const thElement = useRef(null);
  
  const setAndChangeDataElement = () => {

  };

  useEffect(() => {
    getUserDataLocal();
  }, [storageDataReport]);

  return storageDataReport && storageDataReport === [] ? { NoDataLoad } : (
    <div className='mt-5 pt-5 my-3'>
      <div className="table-container is-flex-wrap-wrap">
        <table id="tableCalls" className="table is-hoverable is-striped is-fullwidth">  
            <thead>
                <tr className='is-size-7 has-text-centered '>
                <th className='th-interactive' scope="col" onClick={ () => sortedCalls('data') } >Data</th>
                <th className='th-interactive' scope="col" onClick={ () => sortedCalls('origem_primaria') } >Origem</th>
                <th scope="col">Origem Secundaria</th>
                <th className='th-interactive' scope="col" onClick={ () => sortedCalls('setor') } >Setor</th>
                <th scope="col" >Destino</th>
                <th scope="col" >Destino Secundario</th>
                <th className='th-interactive' scope="col" onClick={ () => sortedCalls('status') } >Status</th>
                <th scope="col" >Tempo Espera (segundos)</th>
                <th className='th-interactive' scope="col" onClick={ () => sortedCalls('duracao') } >Total da Ligação (segundos)</th>
                <th className='th-interactive' scope="col" onClick={ () => sortedCalls('tipo') } >Tipo</th>
                {/* <th scope="col">Id</th>
                <th scope="col">Sequencia</th> */}
                <th scope="col">Protocolo</th>
                <th scope="col">Gravação</th>
                </tr>
            </thead>
            {
              callsList.map((call, index) => <ReportTable key={ index } call={ call } role={ userRoleLocal } />)
            }
        </table>
      </div>
    </div>
  )
}

ReportList.propTypes = {
  callsList: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.string,
    origem_primaria: PropTypes.string,
    origem_segundaria: PropTypes.string,
    setor: PropTypes.string,
    destino_secundario: PropTypes.string,
    destino_primario: PropTypes.string,
    status: PropTypes.string,
    aguardando_atendimento: PropTypes.string,
    duracao: PropTypes.string,
    tipo: PropTypes.string,
    id: PropTypes.string,
    sequencia: PropTypes.number,
    protocolo: PropTypes.string,
  })),
  sortedCalls: PropTypes.func,
};

export default ReportList;

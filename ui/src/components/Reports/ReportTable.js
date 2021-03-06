import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faBan } from '@fortawesome/free-solid-svg-icons';

const ReportTable = ({ call, role }) => {
  let showRecs = { icon: '', path: '', target: '' };
  const { data, origem_primaria, origem_segundaria, destino_primario, destino_secundario, setor, aguardando_atendimento, duracao, status, sequencia, tipo, protocolo, tipo_saida, id } = call;  

  let url = window.location.href;
  url = url.split('/')[2];

  const date = new Date(data);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const adminTd = <Link to={{ pathname: `http://${url}/api/download/file/${protocolo}` }} target="_blank"><FontAwesomeIcon icon={faPlay} fixedWidth /></Link>;
  const userTd = <FontAwesomeIcon icon={faBan} fixedWidth />;

  const dateBr = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;

  return (
    <tbody>
      <tr className='is-size-7 has-text-centered '>
        <td>{`${dateBr} ${time}`}</td>
        <td>{origem_primaria}</td>
        <td>{origem_segundaria}</td>
        <td>{setor}</td>
        <td>{destino_primario}</td>
        <td>{destino_secundario}</td>
        <td>{status}</td>
        <td>{aguardando_atendimento}</td>
        <td>{duracao}</td>
        <td>{tipo}</td>
        <td>{protocolo}</td>
        <td>{ role !== 'admin' ? userTd : adminTd }</td>
      </tr>
    </tbody>
  )
}

ReportTable.propTypes = {
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
  };

export default ReportTable;


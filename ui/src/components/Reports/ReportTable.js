import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faBan } from '@fortawesome/free-solid-svg-icons';

class ReportTable extends React.Component {
  render() {
    let showRecs = { icon: '', path: '', target: '' };
    const { call } = this.props;
    const { dateBrFull, src, dst, callBillsec, callDuration, typecall, statuscall, callprotocol, callprotocolUrl, userType } = call;
    let url = window.location.href;
    url = url.split('/')[2];
    // const pathFull = `http://${url}/api/download/file/${callprotocol}`;
    // userType !== 'admin' ? showRecs = { icon: faBan, path: '#', target: '_' } : showRecs = { icon: faPlay, path: pathFull, target: '_blank' }
    return (
      <tbody>
        <tr>
          <td>{dateBrFull}</td>
          <td>{src}</td>
          <td>{dst}</td>
          <td>{statuscall}</td>
          <td>{typecall}</td>
          <td>{callDuration}</td>
          <td>{callBillsec}</td>
          <td>{callprotocol}</td>
	        <td><Link to={{ pathname: `http://${url}/api/download/file/${callprotocol}` }} target="_blank"><FontAwesomeIcon icon={faPlay} fixedWidth /></Link></td>
          {/* <td><Link to={{ pathname: showRecs.path }} target={showRecs.target}><FontAwesomeIcon icon={showRecs.icon} fixedWidth /></Link></td> */}
        </tr>
      </tbody>
    )
  }
}

export default ReportTable;


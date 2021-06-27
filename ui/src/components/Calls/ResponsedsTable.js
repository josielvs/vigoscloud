import React from 'react';

class ResponsedsTable extends React.Component {
  render() {
    const { call } = this.props;
    const { endpoint, typeCall, time, numberConnected, countCalls } = call;
  return (
    <tfoot>
      <tr>
        <td>{endpoint}</td>
        <td>{typeCall}</td>
        <td>{numberConnected}</td>
        <td>{time}</td>
        <td>{countCalls}</td>
      </tr>
    </tfoot>
  )
  }
}

export default ResponsedsTable;
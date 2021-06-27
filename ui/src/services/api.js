import axios from 'axios';

import accessLocalStorage from './accessLocalStorage';

const { 
  REACT_APP_HOST,
  REACT_APP_API_USER_AST,
  REACT_APP_API_PASS_AST,
  REACT_APP_API_HOST
} = process.env

export const clickToCall = async (data) => {
  const { token } = await accessLocalStorage.getUserLocalStorage();

  try {
    const response = await axios
      .post(`${REACT_APP_HOST}/api/calls/click`, data, { headers: { Authorization: token } });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const cancelClickToCall = async (data) => {
  const { token } = await accessLocalStorage.getUserLocalStorage();

  try {
    const response = await axios
      .post(`${REACT_APP_HOST}/api/calls/cancel-click`, data, { headers: { Authorization: token } });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const trasferCall = async (data) => {
  const { token } = await accessLocalStorage.getUserLocalStorage();

  try {
    const response = await axios
      .post(`${REACT_APP_HOST}/api/calls/transfer`, data, { headers: { Authorization: token } });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const cancelTrasferCall = async (data) => {
  const { token } = await accessLocalStorage.getUserLocalStorage();

  try {
    const response = await axios
      .post(`(REACT_APP_HOST}/api/calls/cancel-transfer`, data, { headers: { Authorization: token } });
    return response;
  } catch (error) {
    console.log(error);
  }
}


export const enterToCall = async (id) => {
  // const { token } = await accessLocalStorage.getUserLocalStorage();

  try {
    const response = await axios
      .post(`${REACT_APP_HOST}/ari/channels?api_key=vigospbx:vigosinterface&channelId/snoop`);
    return response;
  } catch (error) {
    console.log(error);
  }
}


export const requestToken = async (userData, ip) => {
  try {
    // const token = await axios.post(`${REACT_APP_HOST}/api/login`, userData);
    const token = await axios.post(`${ip}api/login`, userData);
    return token;
  } catch (error) {
    return error;
  }
}

export const registerUser = async (userData) => {
  try {
    const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
    const response = await axios.post(`${iprequest}api/login/register`, userData);
    return response;
  } catch (error) {
    return error.response.status;
  }
}

export const fetchEndpoints = async () => {
  try {
    const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
    const request = await fetch(`${ipRequest}ari/endpoints?api_key=${REACT_APP_API_USER_AST}:${REACT_APP_API_PASS_AST}`);
    const endpoints = await request.json();
    return endpoints;
  } catch (error) {
    console.log(error);
  }
};

export const fetchCallsDataBase = async (day) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/db`, day, { headers: { Authorization: token } });
    return response.data.rows;
  } catch (error) {
    return error;
  }
}

export const fetchCallsAnalistas = async (id) => {
  try {
    const request = await fetch(`${REACT_APP_HOST}/api/analistas/${id}`);
    const callsAnalist = await request.json();
    return callsAnalist;
  } catch (error) {
    console.log(error);
  }
};

export const fetchRecCall = async (id) => {
  try {
    const request = await fetch(`${REACT_APP_HOST}/api/download/file/${id}`);
    return request.url;
  } catch (error) {
    console.log(error);
  }
};

export const fetchCallOnDay = async (id) => {
  try {
    const request = await fetch(`${REACT_APP_HOST}/api/dbday/${id}`);
    const calls = await request.json();
    return calls;
  } catch (error) {
    console.log(error);
  }
};

// export default { fetchCallOnDay, fetchRecCall, fetchCallsAnalistas, fetchCallsDataBase, fetchEndpoints, enterToCall, clickToCall, trasferCall, requestToken, registerUser }
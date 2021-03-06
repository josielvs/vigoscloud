import axios from 'axios';

import accessLocalStorage from './accessLocalStorage';

const { 
  REACT_APP_HOST,
  REACT_APP_API_USER_AST,
  REACT_APP_API_PASS_AST,
} = process.env

export const clickToCall = async (data) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();

  try {
    const response = await axios
      .post(`${ipRequest}api/calls/click`, data, { headers: { Authorization: token } });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const cancelClickToCall = async (data) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();

  try {
    const response = await axios
      .post(`${ipRequest}api/calls/cancel-click`, data, { headers: { Authorization: token } });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const trasferCall = async (data) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();

  try {
    const response = await axios
      .post(`${ipRequest}api/calls/transfer`, data, { headers: { Authorization: token } });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const cancelTrasferCall = async (data) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();

  try {
    const response = await axios
      .post(`${ipRequest}api/calls/cancel-transfer`, data, { headers: { Authorization: token } });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const clickToSpy = async (data) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();

  try {
    const response = await axios
      .post(`${ipRequest}api/calls/spy`, data, { headers: { Authorization: token } });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const requestToken = async (userData, ip) => {
  try {
    const token = await axios.post(`${ip}api/login`, userData);
    return token;
  } catch (error) {
    return error;
  }
}

export const registerUser = async (userData) => {
  try {
    const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
    const response = await axios.post(`${ipRequest}api/login/register`, userData);
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

export const fetchCallsByDateDB = async (days) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/db/by-date`, days, { headers: { Authorization: token } });
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

export const fetchDataReport = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/db/report`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const fetchSectors = async () => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .get(`${ipRequest}api/db/report/sector`, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const fetchDataReportList = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/db/report/list`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const fetchRowsChartSectors = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/db/report/list-sector-chart`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportReportGenerate = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/report/export`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportReportGenerateLogs = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/report/export-logs`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportReportDownload = async () => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .get(`${ipRequest}api/report/download-stats`, { headers: { Authorization: token } });
    return response;
  } catch (error) {
    return error;
  }
};

////////// API TRUNKS /////////
export const exportCreateTrunks = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/config/trunks/create`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportSelectAllTrunks = async () => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .get(`${ipRequest}api/config/trunks`, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportDeleteTrunks = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/config/trunks/delete`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

////////// API ENDPOINTS /////////
export const exportCreateEndpoints = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/config/endpoints/create`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportSelectAllEndpoints = async () => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .get(`${ipRequest}api/config/endpoints`, { headers: { Authorization: token } })
    return response.data;
  } catch (error) {
    return console.error(error);
  }
};

export const exportSelectEndpointsById = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/config/endpoints/id`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportUpdateEndpoints = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/config/endpoints/update`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportDeleteEndpoints = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/config/endpoints/delete`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

////////// API QUEUES /////////
export const exportCreateQueues = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/config/queues/create`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportSelectAllQueues = async () => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .get(`${ipRequest}api/config/queues`, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportSelectQueuesByName = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/config/queues/name`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportUpdateQueues = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/config/queues/update`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportDeleteQueues = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/config/queues/delete`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

////////// API MEMBER QUEUES /////////
export const exportCreateQueueMembers = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/config/queues/members/create`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportSelectAllQueueMembers = async () => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .get(`${ipRequest}api/config/queues/members`, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportSelectQueueMemberByName = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/config/queues/members/name`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportSelectQueueMemberByEndpoint = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/config/queues/members/endpoint`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportDeleteQueueMember = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/config/queues/members/delete`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

////////// API MOH /////////
export const exportCreateMoh = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/config/queues/members/create`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportSelectAllMohs = async () => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .get(`${ipRequest}api/config/moh`, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const exportDeleteMohs = async (dataRequest) => {
  const { token, ipRequest } = await accessLocalStorage.getUserLocalStorage();
  
  try {
    const response = await axios
      .post(`${ipRequest}api/config/moh/delete`, dataRequest, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return error;
  }
};

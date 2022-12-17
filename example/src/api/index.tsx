import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config/env';
// const axios = require('axios');

// Step-1: Create a new Axios instance with a custom config.
// The timeout is set to 10s. If the request takes longer than
// that then the request will be aborted.
const BACKEND_ENDPOINT = axios.create({
  baseURL: config.api,
  timeout: 1000,
});

// Step-2: Create request, response & error handlers
const requestHandler = (request: any) => {
  // Token will be dynamic so we can use any app-specific way to always
  // fetch the new token before making the call
  const value = AsyncStorage.getItem('token');
  request.headers.Authorization = `Bearer ${value}`;
  return request;
};

const responseHandler = (response: any) => {
  return response;
};

const errorHandler = (error: any) => {
  return Promise.reject(error);
};

// Step-3: Configure/make use of request & response interceptors from Axios
// Note: You can create one method say configureInterceptors, add below in that,
// export and call it in an init function of the application/page.
BACKEND_ENDPOINT.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => errorHandler(error)
);

BACKEND_ENDPOINT.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
);

// Step-4: Export the newly created Axios instance to be used in different locations.

export default { BACKEND_ENDPOINT };

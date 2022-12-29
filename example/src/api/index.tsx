// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import config from '../config/env';

// // Step-1: Create a new Axios instance with a custom config.
// // The timeout is set to 10s. If the request takes longer than
// // that then the request will be aborted.
// const BACKEND_ENDPOINT = axios.create({
// 	baseURL: config.api,
// 	timeout: 1000,
// });

// // Step-2: Create request, response & error handlers
// const requestHandler = (request: any) => {
// 	// Token will be dynamic so we can use any app-specific way to always
// 	// fetch the new token before making the call
// 	const value = AsyncStorage.getItem('token');
// 	request.headers.Authorization = `Bearer ${value}`;
// 	return request;
// };

// const responseHandler = (response: any) => {
// 	return response;
// };

// const errorHandler = (error: any) => {
// 	return Promise.reject(error);
// };

// // Step-3: Configure/make use of request & response interceptors from Axios
// // Note: You can create one method say configureInterceptors, add below in that,
// // export and call it in an init function of the application/page.
// BACKEND_ENDPOINT.interceptors.request.use(
// 	request => requestHandler(request),
// 	error => errorHandler(error)
// );

// BACKEND_ENDPOINT.interceptors.response.use(
// 	response => responseHandler(response),
// 	error => errorHandler(error)
// );

// // Step-4: Export the newly created Axios instance to be used in different locations.

// export default {BACKEND_ENDPOINT};
import CONFIG from '../config/env';
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';
import {headers, httpsAgent, injectToken} from './http';

class instanceService {
	private instance: AxiosInstance | null = null;

	private get http(): AxiosInstance {
		return this.instance != null ? this.instance : this.initHttp();
	}

	initHttp() {
		const http = axios.create({
			baseURL: 'https://203.151.66.114:86/oss_api/public/api',
			headers,
			// httpsAgent,
		});

		http.interceptors.request.use(injectToken, error => Promise.reject(error));

		http.interceptors.response.use(
			response => {
				return response;
			},
			error => {
				console.log('error ++++', error);
				const {response} = error;
				return this.handleError(response);
			}
		);

		this.instance = http;
		return http;
	}

	request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
		return this.http.request(config);
	}

	get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
		return this.http.get<T, R>(url, config);
	}

	post<T = any, R = AxiosResponse<T>>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
		return this.http.post<T, R>(url, data, config);
	}

	put<T = any, R = AxiosResponse<T>>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
		return this.http.put<T, R>(url, data, config);
	}

	patch<T = any, R = AxiosResponse<T>>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
		return this.http.patch<T, R>(url, data, config);
	}

	delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
		return this.http.delete<T, R>(url, config);
	}

	// Handle global app errors
	// We can handle generic app errors depending on the status code
	private handleError(error: AxiosError) {
		if (!error) return;
		const {status} = error as AxiosError & {status?: number | undefined};
		switch (status) {
			case 500: {
				break;
			}
			case 403: {
				break;
			}
			case 401: {
				break;
			}
			case 429: {
				break;
			}
		}
		return Promise.reject(error);
	}
}

export const API = new instanceService();

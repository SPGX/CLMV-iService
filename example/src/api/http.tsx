// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { AxiosRequestConfig } from 'axios';

// export const headers: Readonly<Record<string, string>> = {
//   'Accept': 'application/json',
//   'Content-Type': 'application/json; charset=utf-8',
//   'X-Requested-With': 'XMLHttpRequest',
// };

// // We can use the following function to inject the JWT token through an interceptor
// // We get the `accessToken` from the localStorage that we set when we authenticate
// export const injectToken = (
//   config: AxiosRequestConfig | any
// ): AxiosRequestConfig => {
//   try {
//     const token = AsyncStorage.getItem('accessToken');
//     if (token != null) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   } catch (error: any) {
//     throw new Error(error);
//   }
// };

import axios, { AxiosResponse } from 'axios';

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = '/api';
axios.interceptors.request.use(async (request) => {
  await sleep(1000);
  return request;
});
// axios.interceptors.response.use(async (response) => {
//   await sleep(1000);
//   return response;
// });

const returnResponseBody = <T>(response: AxiosResponse<T>) => response.data;

export const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(returnResponseBody),
  post: <T, R>(url: string, body: T) =>
    axios.post<R, AxiosResponse<R>, T>(url, body).then(returnResponseBody),
  put: <T, R>(url: string, body: T) =>
    axios.put<R, AxiosResponse<R>, T>(url, body).then(returnResponseBody),
  delete: (url: string) => axios.delete(url).then(returnResponseBody),
};

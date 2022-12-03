import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { store } from '../stores/store';
import { history } from '../utils/route';

function getFistErrorMessage(data: any): string | undefined {
  if (data.errors) {
    const firstError: any = Object.values(data.errors)[0];
    return firstError ? firstError[0] : undefined;
  }
  return undefined;
}

function toastFistErrorMessage(data: any) {
  const firstError = getFistErrorMessage(data);
  firstError && toast.error(firstError);
}

function handle400Response(data: any, config: AxiosRequestConfig<{}>) {
  if (config.method === 'get' && data.errors?.hasOwnProperty('id')) {
    // a special case when user try to access an item with invalid guid
    history.push('/not-found');
    return;
  }
  const errorMessage = getFistErrorMessage(data) ?? 'Bad Request.';
  toast.error(errorMessage);
}

function handle401Response(data: any) {
  toast.error('Unauthorized.');
}

function handle404Response(data: any) {
  toastFistErrorMessage(data);
  history.push('/not-found');
}

function handle500Response(data: any) {
  store.commonStore.setServerSideErrorMessage(
    getFistErrorMessage(data) || 'Unknown error.'
  );
  history.push('/server-side-error');
}

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = '/api';
axios.interceptors.request.use(async (request) => {
  await sleep(200);
  return request;
});

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;
    const ignoreStatusCodes: number[] | undefined = (config as any)
      .ignoreStatusCodes;
    if (ignoreStatusCodes && ignoreStatusCodes.find((x) => x === status)) {
      return Promise.reject(error);
    }
    switch (status) {
      case 400:
        handle400Response(data, config);
        break;
      case 401:
        handle401Response(data);
        break;
      case 404:
        handle404Response(data);
        break;
      case 500:
        handle500Response(data);
        break;
    }
    return Promise.reject(error);
  }
);

const returnResponseBody = <T>(response: AxiosResponse<T>) => response.data;

export const requests = {
  get: <T>(url: string, config?: AxiosRequestConfig<{}>) =>
    axios.get<T>(url, config).then(returnResponseBody),
  post: <T, R>(url: string, body: T, config?: AxiosRequestConfig<T>) =>
    axios
      .post<R, AxiosResponse<R>, T>(url, body, config)
      .then(returnResponseBody),
  put: <T, R>(url: string, body: T, config?: AxiosRequestConfig<T>) =>
    axios
      .put<R, AxiosResponse<R>, T>(url, body, config)
      .then(returnResponseBody),
  delete: (url: string, config?: AxiosRequestConfig<{}>) =>
    axios.delete(url, config).then(returnResponseBody),
};

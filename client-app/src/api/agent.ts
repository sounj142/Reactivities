import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestTransformer,
  AxiosResponse,
} from 'axios';
import { toast } from 'react-toastify';
import { store } from '../stores/store';
import { getClientTimeZone, toISOStringWithTimezone } from '../utils/common';
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
  const errorMessage =
    getFistErrorMessage(data) ||
    (typeof data === 'string' && data.length ? data : 'Bad Request.');
  toast.error(errorMessage);
}

function handleGenericResponse(data: any) {
  const error =
    typeof data === 'string' && data.length ? data : 'Unauthorized.';
  toast.error(error);
}

function handle401Response(data: any) {
  handleGenericResponse(data);
}

function handle403Response(data: any) {
  handleGenericResponse(data);
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

const dateTransformer = (data: any): any => {
  if (data instanceof FormData) {
    return data;
  }
  if (data instanceof Date) {
    // customize date serialition logic - https://stackoverflow.com/questions/70689305/customizing-date-serialization-in-axios
    return toISOStringWithTimezone(data);
  }
  if (Array.isArray(data)) {
    return data.map((val) => dateTransformer(val));
  }
  if (typeof data === 'object' && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, val]) => [key, dateTransformer(val)])
    );
  }
  return data;
};

axios.defaults.baseURL = `${process.env.REACT_APP_SERVER_URL}api`;
axios.defaults.transformRequest = [
  dateTransformer,
  ...(axios.defaults.transformRequest as AxiosRequestTransformer[]),
];
axios.interceptors.request.use(async (request) => {
  if (process.env.NODE_ENV === 'development') await sleep(200);

  const token = store.userStore.user?.token;
  if (request.headers) {
    request.headers.time_zone = getClientTimeZone();
    if (token) request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) return Promise.reject(error);

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
      case 403:
        handle403Response(data);
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

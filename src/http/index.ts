import axios from 'axios';
import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

interface Result<T> {
  code: number;
  msg: string;
  data: T;
}

interface Interceptors {
  reqSuccessInterceptor?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  reqErrorInterceptor?: (error: AxiosError) => Promise<AxiosError>;
  resSuccessInterceptor?: (config: AxiosResponse) => AxiosResponse;
  resErrorInterceptor?: (error: AxiosError) => Promise<AxiosError>;
}

interface CreateAxiosConfig extends AxiosRequestConfig {
  interceptors?: Interceptors;
}

export class Request {
  private axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosConfig;

  constructor(config: CreateAxiosConfig) {
    this.options = config;
    this.axiosInstance = axios.create(config);
    this.setInterceptors();
  }

  private getInterceptors() {
    let interceptorsMap: Interceptors = {
      reqSuccessInterceptor: undefined,
      reqErrorInterceptor: undefined,
      resSuccessInterceptor: undefined,
      resErrorInterceptor: undefined
    };

    if (this.options.interceptors) {
      interceptorsMap = this.options.interceptors;
    }
    return interceptorsMap;
  }

  private setInterceptors() {
    const { reqSuccessInterceptor, reqErrorInterceptor, resSuccessInterceptor, resErrorInterceptor } = this.getInterceptors();

    this.axiosInstance.interceptors.request.use(reqSuccessInterceptor, reqErrorInterceptor);
    this.axiosInstance.interceptors.response.use(resSuccessInterceptor, resErrorInterceptor);

    //全局请求拦截器
    this.axiosInstance.interceptors.request.use(
      config => {
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    //全局响应拦截器
    this.axiosInstance.interceptors.response.use(
      response => {
        if (response.status === 200) {
          return response.data;
        } else {
          Promise.reject(`请求失败 status:${response.status} statusText=${response.statusText}`);
        }
        return response;
      },
      (error: AxiosError) => {
        if (error && error.response) {
          switch (error.response.status) {
            case 400:
              error.message = '错误请求';
              break;
            case 401:
              error.message = '未授权，请先授权';
              break;
            case 403:
              error.message = '拒绝访问';
              break;
            case 404:
              error.message = '请求错误，未找到资源';
              break;
            case 405:
              error.message = '请求方法不允许';
              break;
            case 408:
              error.message = '请求超时';
              break;
            case 500:
              error.message = '服务器端出错|500';
              break;
            case 501:
              error.message = '网络未实现';
              break;
            case 502:
              error.message = '网络错误';
              break;
            case 503:
              error.message = '服务不可用';
              break;
            case 504:
              error.message = '网络超时';
              break;
            case 505:
              error.message = 'http版本不支持该请求';
              break;
            default:
              error.message = '请求错误';
          }

          error.message = `${error.response.status} ${error.message}`;
        } else {
          return Promise.reject(error);
        }

        return Promise.reject(error.message);
      }
    );
  }

  get<T = object>(url: string, params?: T, config: AxiosRequestConfig = {}): Promise<Result<T>> {
    config.params = params;
    return this.axiosInstance.get(url, config);
  }

  post<T = object>(url: string, params?: T, config: AxiosRequestConfig = {}): Promise<Result<T>> {
    return this.axiosInstance.post(url, params, config);
  }
}

export const request = new Request({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  timeout: 15 * 1000
});

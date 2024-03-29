import axios, { AxiosInstance } from 'axios';
import { AppError } from '@utils/AppError';
import { storageAuthTokenGet, storageAuthTokenSave } from '../storage/storageAuthToken';

type PromiseType = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

type ProcessQueueParams = {
  error: Error | null
  token: string | null
}

type RegisterInterceptorTokenManagerProps = {
  signOut: () => void;
  refreshTokenUpdated: (newToken: string) => void;
}

type ApiInstanceProps = AxiosInstance & {
  registerInterceptorTokenManager: ({}: RegisterInterceptorTokenManagerProps) => () => void;
}

const api = axios.create({
  baseURL: 'http://192.168.1.224:3333',
}) as ApiInstanceProps;

let isRefreshing = false;
let failedQueue: Array<PromiseType> = [];

const processQueue = ({error, token = null}: ProcessQueueParams): void => {
  failedQueue.forEach(request => {
    if(error){
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });
  failedQueue = [];
};

api.registerInterceptorTokenManager = ({signOut, refreshTokenUpdated}) => {
  const interceptorTokenManager = api.interceptors.response.use(response => response, async requestError => {
    if(requestError?.response?.status === 401) {
      if(requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid') {
        const oldToken = await storageAuthTokenGet();

        if(!oldToken) {
          signOut();
          return Promise.reject(requestError);
        }

        const originalRequest = requestError.config;

        if(isRefreshing){
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject});
          })
            .then(token => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;

              return axios(originalRequest);
            }).catch((error) => {
              throw error;
            });
        }
        isRefreshing = true;

        return new Promise(async (resolve, reject) => {
          try {
            const {data} = await api.post('/sessions/refresh-token', { token: oldToken });
            await storageAuthTokenSave(data.token);

            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            originalRequest.headers['Authorization'] = `Bearer ${data.token}`;

            refreshTokenUpdated(data.token);

            processQueue({ error: null, token: data.token});
            console.log('TOKEN ATUALIZADO');

            resolve(originalRequest);
          } catch (error: any) {
            processQueue({ error, token: null});
            signOut();
            reject(error);
          } finally {
            isRefreshing = false;
          }
        });
      }
      signOut();
    }

    if(requestError.response && requestError.response.data){
      return Promise.reject( new AppError(requestError.response.data.message));
    } else {
      return Promise.reject(requestError);
    }
  });

  return () => {
    api.interceptors.response.eject(interceptorTokenManager);
  };
};

export  {
  api
};

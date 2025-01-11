import { AxiosRequestConfig, HttpStatusCode } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { AuthApi, HttpClient } from './AuthApi';
import { UserApi } from './UserApi';
import { useEffect, useState } from 'react';
import { StoreApi } from './StoreApi';
import { TgApi } from './TgApi';
import { VkApi } from './VkApi';
import { OrderApi } from './OrderApi';
import { objectToCamel, objectToSnake } from 'ts-case-convert';

export const REFRESH_TOKEN = 'refresh_token';
export const ACCESS_TOKEN = 'access_token';

const SERVER_ERRORS_FROM = 500;

export enum AuthResponseCodes {
	WRONG_EMAIL_OR_PASSWORD = StatusCodes.BAD_REQUEST,
}

export enum UserResponseCodes {
	UNAUTHORIZED = StatusCodes.UNAUTHORIZED,
	EMAIL_VERIFY_FAILED = StatusCodes.GONE,
	WRONG_PASSWORD = StatusCodes.BAD_REQUEST,
	VK_ID_IS_USED = StatusCodes.BAD_REQUEST,
	TELEGRAM_ID_IS_USED = StatusCodes.BAD_REQUEST,
}

export enum StoreResponseCodes {
	STORE_NOT_FOUND = StatusCodes.NOT_FOUND,
	NOT_OWNER = StatusCodes.FORBIDDEN,
	NOT_SELLER = StatusCodes.FORBIDDEN,
	STORE_TITLE_BUSY = StatusCodes.CONFLICT,
}

export enum NetworksResponseCodes {
	NOT_STORE_OWNER = StatusCodes.FORBIDDEN,
	NETWORK_BUSY = StatusCodes.CONFLICT,
}

export enum ProductResponseCodes {
	NOT_STORE_OWNER = StatusCodes.FORBIDDEN,
	NOT_PRODUCT_OWNER = StatusCodes.FORBIDDEN,
	PRODUCT_NOT_FOUND = StatusCodes.NOT_FOUND,
}

export enum OrderResponseCodes {
	ORDER_NOT_FOUND = StatusCodes.NOT_FOUND,
	NOT_ORDER_OWNER = StatusCodes.FORBIDDEN,
	BAD_STORE_OR_PRODUCT = StatusCodes.BAD_REQUEST,
	NOT_SELLER = StatusCodes.FORBIDDEN,
}

export const DEFAULT_ERROR_MESSAGE = 'Произошла ошибка. Попробуйте позже';

const securityWorker = (): AxiosRequestConfig => {
	const result: AxiosRequestConfig = {};
	const token = localStorage.getItem(ACCESS_TOKEN);
	// eslint-disable-next-line @typescript-eslint/naming-convention
	result.headers = { Authorization: `Bearer ${token}` };
	return result;
};

const defaultConfig = {
	baseURL:
		import.meta.env.VITE_NODE_ENV === 'production'
			? import.meta.env.VITE_API_URL
			: import.meta.env.VITE_LOCAL_API_URL,
	headers: {
		withCredentials: true,
	},
	securityWorker: securityWorker,
};

const httpClient = new HttpClient(defaultConfig);

const httpClientNoRedirect = new HttpClient(defaultConfig);

const responseInterceptor = (client: HttpClient, onFailFunc: () => void) => {
	client.instance.interceptors.response.use(
		(response) => {
			response.data = objectToCamel(response.data);
			return response;
		},
		async (error) => {
			if (error.response?.status === HttpStatusCode.UnprocessableEntity) {
				window.location.href = '/500';
				return Promise.reject(error);
			}

			if (error.response?.status >= SERVER_ERRORS_FROM || error.code === 'ERR_NETWORK') {
				window.location.href = '/500';
				return Promise.reject(error);
			}

			if (error.response?.status === StatusCodes.UNAUTHORIZED) {
				if ('Authorization' in error.config.headers) {
					const token = localStorage.getItem(REFRESH_TOKEN);
					if (!token) {
						onFailFunc();
						return Promise.reject(error);
					}

					// here config of original request, response of that was intercepted. It's need for avoid cycles of 401 codes from refresh
					const originalConfig = error.config;
					if (!originalConfig._isRetry) {
						originalConfig._isRetry = true;

						try {
							const response = await authApi.auth.postRefresh({
								refreshToken: token,
							});
							localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);
							localStorage.setItem(REFRESH_TOKEN, response.data.refreshToken);
							originalConfig.headers.Authorization = `Bearer ${response.data.accessToken}`;

							return httpClient.instance(originalConfig);
						} catch (refreshError) {
							onFailFunc();
							localStorage.removeItem(REFRESH_TOKEN);
							localStorage.removeItem(ACCESS_TOKEN);
							return Promise.reject(error);
						}
					}
					return Promise.reject(error);
				} else {
					return Promise.reject(error);
				}
			} else {
				return Promise.reject(error);
			}
		},
	);
};

const requestInterceptor = (client: HttpClient) => {
	client.instance.interceptors.request.use(
		function (config) {
			if (config.data != undefined && config.headers['Content-Type'] === 'application/json') {
				config.data = objectToSnake(config.data);
			}
			if (config.params != undefined) {
				config.params = objectToSnake(config.params);
			}
			return config;
		},
		function (error) {
			return Promise.reject(error);
		},
	);
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const AxiosInstance = ({ children }) => {
	//this flag sets in true when interceptors were added. useEffect is async function, and we must be sure that interceptors have been set!
	const [interceptorInitialized, setInterceptorInitialized] = useState(false);

	useEffect(() => {
		setInterceptorInitialized(true);
		return () => {
			responseInterceptor(httpClient, () => {
				window.location.href = '/login';
			});
			requestInterceptor(httpClient);
			responseInterceptor(httpClientNoRedirect, () => ({}));
			requestInterceptor(httpClientNoRedirect);
		};
	}, [interceptorInitialized]);
	return interceptorInitialized && children;
};

export const authApi = new AuthApi(httpClient);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const userApi = new UserApi(httpClient);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const storeApi = new StoreApi(httpClient);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const tgApi = new TgApi(httpClient);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const vkApi = new VkApi(httpClient);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const orderApi = new OrderApi(httpClient);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const userApiNoRedirect = new UserApi(httpClientNoRedirect);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const tgApiNoRedirect = new TgApi(httpClientNoRedirect);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const orderApiNoRedirect = new OrderApi(httpClientNoRedirect);

/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** DetailResponseModel */
export interface DetailResponseModel {
	/** Detail */
	detail: string;
}

/** HTTPValidationError */
export interface HTTPValidationError {
	/** Detail */
	detail?: ValidationError[];
}

/** LoginFormModel */
export interface LoginFormModel {
	/**
	 * Email
	 * @minLength 1
	 * @maxLength 128
	 */
	email: string;
	/**
	 * Password
	 * @minLength 8
	 * @maxLength 64
	 */
	password: string;
}

/** RefreshTokenBodyModel */
export interface RefreshTokenBodyModel {
	/** Refresh Token */
	refreshToken: string;
}

/** TokensResponseModel */
export interface TokensResponseModel {
	/** Detail */
	detail: string;
	/** Access Token */
	accessToken: string;
	/** Refresh Token */
	refreshToken: string;
}

/** ValidationError */
export interface ValidationError {
	/** Location */
	loc: (string | number)[];
	/** Message */
	msg: string;
	/** Error Type */
	type: string;
}

import type {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	HeadersDefaults,
	ResponseType,
} from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
	extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
	/** set parameter to `true` for call `securityWorker` for this request */
	secure?: boolean;
	/** request path */
	path: string;
	/** content type of request body */
	type?: ContentType;
	/** query params */
	query?: QueryParamsType;
	/** format of response (i.e. response.json() -> format: "json") */
	format?: ResponseType;
	/** request body */
	body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown>
	extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
	securityWorker?: (
		securityData: SecurityDataType | null,
	) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
	secure?: boolean;
	format?: ResponseType;
}

export enum ContentType {
	Json = 'application/json',
	FormData = 'multipart/form-data',
	UrlEncoded = 'application/x-www-form-urlencoded',
	Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
	public instance: AxiosInstance;
	private securityData: SecurityDataType | null = null;
	private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
	private secure?: boolean;
	private format?: ResponseType;

	constructor({
		securityWorker,
		secure,
		format,
		...axiosConfig
	}: ApiConfig<SecurityDataType> = {}) {
		this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' });
		this.secure = secure;
		this.format = format;
		this.securityWorker = securityWorker;
	}

	public setSecurityData = (data: SecurityDataType | null) => {
		this.securityData = data;
	};

	protected mergeRequestParams(
		params1: AxiosRequestConfig,
		params2?: AxiosRequestConfig,
	): AxiosRequestConfig {
		const method = params1.method || (params2 && params2.method);

		return {
			...this.instance.defaults,
			...params1,
			...(params2 || {}),
			headers: {
				...((method &&
					this.instance.defaults.headers[
						method.toLowerCase() as keyof HeadersDefaults
					]) ||
					{}),
				...(params1.headers || {}),
				...((params2 && params2.headers) || {}),
			},
		};
	}

	protected stringifyFormItem(formItem: unknown) {
		if (typeof formItem === 'object' && formItem !== null) {
			return JSON.stringify(formItem);
		} else {
			return `${formItem}`;
		}
	}

	protected createFormData(input: Record<string, unknown>): FormData {
		if (input instanceof FormData) {
			return input;
		}
		return Object.keys(input || {}).reduce((formData, key) => {
			const property = input[key];
			const propertyContent: any[] = property instanceof Array ? property : [property];

			for (const formItem of propertyContent) {
				const isFileType = formItem instanceof Blob || formItem instanceof File;
				formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
			}

			return formData;
		}, new FormData());
	}

	public request = async <T = any, _E = any>({
		secure,
		path,
		type,
		query,
		format,
		body,
		...params
	}: FullRequestParams): Promise<AxiosResponse<T>> => {
		const secureParams =
			((typeof secure === 'boolean' ? secure : this.secure) &&
				this.securityWorker &&
				(await this.securityWorker(this.securityData))) ||
			{};
		const requestParams = this.mergeRequestParams(params, secureParams);
		const responseFormat = format || this.format || undefined;

		if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
			body = this.createFormData(body as Record<string, unknown>);
		}

		if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
			body = JSON.stringify(body);
		}

		return this.instance.request({
			...requestParams,
			headers: {
				...(requestParams.headers || {}),
				...(type ? { 'Content-Type': type } : {}),
			},
			params: query,
			responseType: responseFormat,
			data: body,
			url: path,
		});
	};
}

/**
 * @title FastAPI
 * @version 0.1.0
 */
export class AuthApi<SecurityDataType extends unknown> {
	http: HttpClient<SecurityDataType>;

	constructor(http: HttpClient<SecurityDataType>) {
		this.http = http;
	}

	auth = {
		/**
		 * @description Authenticate user with email and password: returns access and refresh tokens.
		 *
		 * @name PostLogin
		 * @summary Login
		 * @request POST:/auth/login
		 */
		postLogin: (data: LoginFormModel, params: RequestParams = {}) =>
			this.http.request<TokensResponseModel, DetailResponseModel | HTTPValidationError>({
				path: `/auth/login`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * @description Accepts both access and refresh tokens and if they are valid, marks them as black-listed (separately). Expects access token to be present in headers this way: 'Authorization': 'Bearer YOUR-ACCESS-TOKEN'.
		 *
		 * @name PostLogout
		 * @summary Logout
		 * @request POST:/auth/logout
		 * @secure
		 */
		postLogout: (data: RefreshTokenBodyModel, params: RequestParams = {}) =>
			this.http.request<DetailResponseModel, HTTPValidationError>({
				path: `/auth/logout`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * @description Uses refresh token to get new access and refresh tokens. Marks old refresh token as black-listed until it expires.
		 *
		 * @name PostRefresh
		 * @summary Refresh
		 * @request POST:/auth/refresh
		 */
		postRefresh: (data: RefreshTokenBodyModel, params: RequestParams = {}) =>
			this.http.request<TokensResponseModel, DetailResponseModel | HTTPValidationError>({
				path: `/auth/refresh`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * @description Validates access token in request. Expects access token to be present in headers this way: 'Authorization': 'Bearer YOUR-ACCESS-TOKEN'.
		 *
		 * @name PostValidate
		 * @summary Validate
		 * @request POST:/auth/validate
		 * @secure
		 */
		postValidate: (params: RequestParams = {}) =>
			this.http.request<DetailResponseModel, DetailResponseModel>({
				path: `/auth/validate`,
				method: 'POST',
				secure: true,
				format: 'json',
				...params,
			}),
	};
}

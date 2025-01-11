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

export interface ErrorResponse {
	detail?: string;
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
 * @title Fanflow VK Store API
 * @version 1.0.0
 *
 * API for managing a store linked to a blogger, tracking user engagement, and awarding FanfCoin. Token always valid, because api gateway proxy token through auth/validate
 */
export class VkApi<SecurityDataType extends unknown> {
	http: HttpClient<SecurityDataType>;

	constructor(http: HttpClient<SecurityDataType>) {
		this.http = http;
	}

	activity = {
		/**
		 * @description Creates a store for a blogger with settings for awarding FanfCoin for comments and likes
		 *
		 * @name ActivityCreate
		 * @summary Create VK group activity collection for a store
		 * @request POST:/activity
		 * @secure
		 */
		activityCreate: (
			data: {
				/**
				 * Store ID from Store service.
				 * @example "672e5840a42de01e6a6c7a19"
				 */
				storeId: string;
				/**
				 * The VK access token for the group.
				 * @example "1298adqwelqwepqwel"
				 */
				vkToken: string;
				/**
				 * Waiting time before comments are credited (in hours, 1-168).
				 * @min 1
				 * @max 168
				 * @example 2
				 */
				commentTimeWait: number;
				/**
				 * FanfCoin awarded per comment (must be > 0).
				 * @min 0.1
				 * @example 2.5
				 */
				perCommentPoints: number;
				/**
				 * Waiting time before likes are credited (in hours, 1-168).
				 * @min 1
				 * @max 168
				 * @example 1
				 */
				likeTimeWait: number;
				/**
				 * FanfCoin awarded per like (must be > 0).
				 * @min 0.1
				 * @example 1
				 */
				perLikePoints: number;
			},
			params: RequestParams = {},
		) =>
			this.http.request<ErrorResponse, ErrorResponse>({
				path: `/activity`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * @description Updates the FanfCoin award likes and comment waiting time for a store
		 *
		 * @name ActivityPartialUpdate
		 * @summary Update VK group activity collection settings
		 * @request PATCH:/activity
		 * @secure
		 */
		activityPartialUpdate: (
			data: {
				/**
				 * Store ID from Store service.
				 * @example "672e5840a42de01e6a6c7a19"
				 */
				storeId: string;
				/**
				 * The VK access token for the group.
				 * @example "1298adqwelqwepqwel"
				 */
				vkToken?: string;
				/**
				 * Waiting time before comments are credited (in hours, 1-168).
				 * @min 1
				 * @max 168
				 * @example 2
				 */
				commentTimeWait?: number;
				/**
				 * FanfCoin awarded per comment (must be > 0).
				 * @min 0.1
				 * @example 2.5
				 */
				perCommentPoints?: number;
				/**
				 * Waiting time before likes are credited (in hours, 1-168).
				 * @min 1
				 * @max 168
				 * @example 1
				 */
				likeTimeWait?: number;
				/**
				 * FanfCoin awarded per like (must be > 0).
				 * @min 0.1
				 * @example 1
				 */
				perLikePoints?: number;
			},
			params: RequestParams = {},
		) =>
			this.http.request<ErrorResponse, ErrorResponse>({
				path: `/activity`,
				method: 'PATCH',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * @description Stops tracking activity for the specified store.
		 *
		 * @name ActivityDelete
		 * @summary Stop VK group activity tracking in store
		 * @request DELETE:/activity
		 * @secure
		 */
		activityDelete: (
			query: {
				/**
				 * The store's ID.
				 * @example "672e5840a42de01e6a6c7a19"
				 */
				storeId: string;
			},
			params: RequestParams = {},
		) =>
			this.http.request<ErrorResponse, ErrorResponse>({
				path: `/activity`,
				method: 'DELETE',
				query: query,
				secure: true,
				format: 'json',
				...params,
			}),

		/**
		 * @description Allows a user to subscribe to activity updates for a specific store.
		 *
		 * @name SubscribeCreate
		 * @summary Subscribe to VK group activity updates
		 * @request POST:/activity/{storeId}/subscribe
		 * @secure
		 */
		subscribeCreate: (
			storeId: string,
			data: {
				/**
				 * Telegram user ID of the subscriber
				 * @min 1
				 * @example 987654321
				 */
				vkUserId?: number;
			},
			params: RequestParams = {},
		) =>
			this.http.request<ErrorResponse, ErrorResponse>({
				path: `/activity/${storeId}/subscribe`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * @description Allows a user to unsubscribe from activity updates for a specific store.
		 *
		 * @name UnsubscribeCreate
		 * @summary Unsubscribe from VK group activity updates
		 * @request POST:/activity/{storeId}/unsubscribe
		 * @secure
		 */
		unsubscribeCreate: (storeId: string, params: RequestParams = {}) =>
			this.http.request<ErrorResponse, ErrorResponse>({
				path: `/activity/${storeId}/unsubscribe`,
				method: 'POST',
				secure: true,
				format: 'json',
				...params,
			}),

		/**
		 * @description Retrieves a list of all stores to which the user is subscribed, including store ID, TG chat ID, and activity tracking settings
		 *
		 * @name SubscriptionsList
		 * @summary Get list of VK channel subscriptions
		 * @request GET:/activity/subscriptions
		 * @secure
		 */
		subscriptionsList: (params: RequestParams = {}) =>
			this.http.request<
				{
					/**
					 * The store's ID
					 * @example "672e5840a42de01e6a6c7a19"
					 */
					storeId?: string;
					/**
					 * Waiting time before comments are credited (in hours, 1-168).
					 * @min 1
					 * @max 168
					 * @example 2
					 */
					commentTimeWait?: number;
					/**
					 * FanfCoin awarded per comment (must be > 0).
					 * @min 0.1
					 * @example 2.5
					 */
					perCommentPoints?: number;
					/**
					 * Waiting time before likes are credited (in hours, 1-168).
					 * @min 1
					 * @max 168
					 * @example 1
					 */
					likeTimeWait?: number;
					/**
					 * FanfCoin awarded per like (must be > 0).
					 * @min 0.1
					 * @example 1
					 */
					perLikePoints?: number;
				}[],
				ErrorResponse
			>({
				path: `/activity/subscriptions`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params,
			}),
	};
}

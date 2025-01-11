/* eslint-disable */
/* tslint: disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ChatDto {
	/**
	 * Store ID from Store service.
	 * @minLength 24
	 * @maxLength 24
	 * @example "123456789012345678901234"
	 */
	storeId: string;
	/**
	 * The Telegram chat ID (supergroup) of the blogger
	 * @format int64
	 * @example 123456789
	 */
	tgChatId: number;
	/**
	 * The Telegram channel ID of the blogger
	 * @format int64
	 * @example 1233455543
	 */
	tgChannelId: number;
	/**
	 * The waiting time before comments are credited (in hours, must be between 1 and 168).
	 * @format int32
	 * @min 0
	 * @max 168
	 * @example 2
	 */
	commentTimeWait: number;
	/**
	 * FanfCoin awarded per comment (must be greater than 0)
	 * @format int32
	 * @min 1
	 * @example 2
	 */
	perCommentPoints: number;
	/**
	 * The waiting time before boosts are credited (in hours, must be between 1 and 168)
	 * @format int32
	 * @min 0
	 * @max 168
	 * @example 1
	 */
	boostTimeWait: number;
	/**
	 * FanfCoin awarded per boost (must be greater than 0)
	 * @format int32
	 * @min 1
	 * @example 100
	 */
	perBoostPoints: number;
}

export interface DetailResponse {
	/** @example "detailed explain of result" */
	detail?: string;
}

export interface ActivitySubscriptionBody {
	/**
	 * Telegram user ID of the subscriber
	 * @format int64
	 * @example 987654321
	 */
	tgUserId?: number;
}

export interface ChatDtoNullable {
	/**
	 * Store ID from Store service.
	 * @minLength 24
	 * @maxLength 24
	 * @example "123456789012345678901234"
	 */
	storeId: string;
	/**
	 * The Telegram chat ID (supergroup) of the blogger
	 * @format int64
	 * @example 123456789
	 */
	tgChatId: number;
	/**
	 * The Telegram channel ID of the blogger
	 * @format int64
	 * @example 1233455543
	 */
	tgChannelId: number;
	/**
	 * The waiting time before comments are credited (in hours, must be between 1 and 168).
	 * @format int32
	 * @min 0
	 * @max 168
	 * @example 2
	 */
	commentTimeWait: number;
	/**
	 * FanfCoin awarded per comment (must be greater than 0)
	 * @format int32
	 * @min 1
	 * @example 2
	 */
	perCommentPoints: number;
	/**
	 * The waiting time before boosts are credited (in hours, must be between 1 and 168)
	 * @format int32
	 * @min 0
	 * @max 168
	 * @example 1
	 */
	boostTimeWait: number;
	/**
	 * FanfCoin awarded per boost (must be greater than 0)
	 * @format int32
	 * @min 1
	 * @example 100
	 */
	perBoostPoints: number;
}

export interface ResponseStoreExchangeRate {
	/**
	 * FanfCoin awarded per comment (must be greater than 0)
	 * @format int32
	 * @min 1
	 * @example 2
	 */
	perCommentPoints: number;
	/**
	 * FanfCoin awarded per boost (must be greater than 0)
	 * @format int32
	 * @min 1
	 * @example 100
	 */
	perBoostPoints: number;
}

export interface IsSubscribeResponse {
	/**
	 * True if user is subscribed to given channel.
	 * @example true
	 */
	isSubscribe: boolean;
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
 * @title Fanflow TG Store API
 * @version 1.0.0
 *
 * API for managing a store linked to a blogger, tracking user engagement, and awarding FanfCoin. Token always valid, because api gateway proxy token through auth/validate
 */
export class TgApi<SecurityDataType extends unknown> {
	http: HttpClient<SecurityDataType>;

	constructor(http: HttpClient<SecurityDataType>) {
		this.http = http;
	}

	tg = {
		/**
		 * @description Creates a store for a blogger with settings for awarding FanfCoin for comments and boosts
		 *
		 * @tags activity-controller
		 * @name CreateChannelActivity
		 * @summary Create TG channel activity collection for a store
		 * @request POST:/tg/activity
		 * @secure
		 */
		createChannelActivity: (data: ChatDto, params: RequestParams = {}) =>
			this.http.request<DetailResponse, DetailResponse>({
				path: `/tg/activity`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * @description Stops tracking activity for the specified store
		 *
		 * @tags activity-controller
		 * @name DeleteChannelActivity
		 * @summary Stop TG channel activity tracking in store
		 * @request DELETE:/tg/activity
		 * @secure
		 */
		deleteChannelActivity: (
			query: {
				/**
				 * @minLength 24
				 * @maxLength 24
				 */
				storeId: string;
			},
			params: RequestParams = {},
		) =>
			this.http.request<DetailResponse, DetailResponse>({
				path: `/tg/activity`,
				method: 'DELETE',
				query: query,
				secure: true,
				format: 'json',
				...params,
			}),

		/**
		 * @description Updates the FanfCoin award rates and comment waiting time for a store
		 *
		 * @tags activity-controller
		 * @name PatchChannelActivity
		 * @summary Update TG channel activity collection settings
		 * @request PATCH:/tg/activity
		 * @secure
		 */
		patchChannelActivity: (data: ChatDtoNullable, params: RequestParams = {}) =>
			this.http.request<DetailResponse, DetailResponse>({
				path: `/tg/activity`,
				method: 'PATCH',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * @description Allows a user to unsubscribe from activity updates for a specific store
		 *
		 * @tags activity-controller
		 * @name DeleteChannelSubscription
		 * @summary Unsubscribe from TG channel activity updates
		 * @request POST:/tg/activity/{store_id}/unsubscribe
		 * @secure
		 */
		deleteChannelSubscription: (storeId: string, params: RequestParams = {}) =>
			this.http.request<DetailResponse, DetailResponse>({
				path: `/tg/activity/${storeId}/unsubscribe`,
				method: 'POST',
				secure: true,
				format: 'json',
				...params,
			}),

		/**
		 * @description Allows to get user subscribe status for a store
		 *
		 * @tags activity-controller
		 * @name IsSubscribe
		 * @summary Get subscribe status for store_id
		 * @request GET:/tg/activity/{store_id}/subscribe
		 * @secure
		 */
		isSubscribe: (storeId: string, params: RequestParams = {}) =>
			this.http.request<IsSubscribeResponse, DetailResponse>({
				path: `/tg/activity/${storeId}/subscribe`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params,
			}),

		/**
		 * @description Allows a user to subscribe to activity updates for a specific store
		 *
		 * @tags activity-controller
		 * @name AddChannelSubscription
		 * @summary Subscribe to TG channel activity updates
		 * @request POST:/tg/activity/{store_id}/subscribe
		 * @secure
		 */
		addChannelSubscription: (
			storeId: string,
			data: ActivitySubscriptionBody,
			params: RequestParams = {},
		) =>
			this.http.request<DetailResponse, DetailResponse>({
				path: `/tg/activity/${storeId}/subscribe`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * @description Retrieves info about specific store that present in data base
		 *
		 * @tags activity-controller
		 * @name GetStoreExchangeRates
		 * @summary Get Info about exchange rates on specific store
		 * @request GET:/tg/activity/{store_id}
		 */
		getStoreExchangeRates: (storeId: string, params: RequestParams = {}) =>
			this.http.request<ResponseStoreExchangeRate, DetailResponse>({
				path: `/tg/activity/${storeId}`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * @description Retrieves a list of all stores to which the user is subscribed, including store ID, TG chat ID, and activity tracking settings
		 *
		 * @tags activity-controller
		 * @name GetSubscriptions
		 * @summary Get list of TG channel subscriptions
		 * @request GET:/tg/activity/subscriptions
		 * @secure
		 */
		getSubscriptions: (params: RequestParams = {}) =>
			this.http.request<ChatDto[], DetailResponse>({
				path: `/tg/activity/subscriptions`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params,
			}),
	};
}

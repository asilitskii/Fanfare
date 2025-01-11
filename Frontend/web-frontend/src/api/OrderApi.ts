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

/** AddressModel */
export interface AddressModel {
	/** Apartment */
	apartment: string | null;
	/**
	 * City
	 * @minLength 2
	 * @maxLength 64
	 */
	city: string;
	/**
	 * House
	 * @maxLength 7
	 */
	house: string;
	/**
	 * Postal Code
	 * @minLength 6
	 * @maxLength 6
	 */
	postalCode: string;
	/**
	 * Street
	 * @minLength 2
	 * @maxLength 64
	 */
	street: string;
}

/** BalanceChangeModel */
export interface BalanceChangeModel {
	/**
	 * Delta
	 * Delta of user balance in hundredths of fanfcoin
	 * @exclusiveMin 0
	 */
	delta: number;
	/** Store Id */
	storeId: string;
	/**
	 * User Id
	 * @format uuid4
	 */
	userId: string;
}

/** DetailModel */
export interface DetailModel {
	/** Detail */
	detail: string;
}

/** HTTPValidationError */
export interface HTTPValidationError {
	/** Detail */
	detail?: ValidationError[];
}

/** OrderChangeStatusModel */
export interface OrderChangeStatusModel {
	newStatus: OrderStatus;
}

/** OrderContactInfoModel */
export interface OrderContactInfoModel {
	/**
	 * Last First Name
	 * @minLength 5
	 * @maxLength 61
	 */
	lastFirstName: string;
	/** Phone Number */
	phoneNumber: string;
}

/** OrderCreatedModel */
export interface OrderCreatedModel {
	/**
	 * Order Id
	 * @format uuid4
	 */
	orderId: string;
	orderStatus: OrderStatus;
}

/** OrderCreationModel */
export interface OrderCreationModel {
	contactInfo: OrderContactInfoModel;
	deliveryAddress: AddressModel;
	/**
	 * Products
	 * @minItems 1
	 */
	products: OrderCreationProductModel[];
	/** Store Id */
	storeId: string;
}

/** OrderCreationProductModel */
export interface OrderCreationProductModel {
	/**
	 * Count
	 * @exclusiveMin 0
	 */
	count: number;
	/** Id */
	id: string;
}

/** OrderInfoModel */
export interface OrderInfoModel {
	contactInfo: OrderContactInfoModel;
	deliveryAddress: AddressModel;
	/**
	 * Order Creation Timestamp
	 * @format date-time
	 */
	orderCreationTimestamp: string;
	/**
	 * Order Id
	 * @format uuid4
	 */
	orderId: string;
	/** Order Reception Timestamp */
	orderReceptionTimestamp: string | null;
	/**
	 * Products
	 * products are sorted in descending of their prices
	 */
	products: ProductModel[];
	status: OrderStatus;
	/** Store Id */
	storeId: string;
	/**
	 * Total Price
	 * Total price of order in kopeks
	 * @min 0
	 */
	totalPrice: number;
}

/** OrderStatus */
export enum OrderStatus {
	Created = 'created',
	Assembly = 'assembly',
	OnTheWay = 'on_the_way',
	AwaitingReceipt = 'awaiting_receipt',
	Received = 'received',
	Canceled = 'canceled',
}

/** ProductModel */
export interface ProductModel {
	/**
	 * Count
	 * @exclusiveMin 0
	 */
	count: number;
	/** Id */
	id: string;
	/** Logo Url */
	logoUrl?: string | null;
	/**
	 * Price
	 * Price of product in kopeks
	 * @min 0
	 * @max 999999999
	 */
	price: number;
	/**
	 * Title
	 * @minLength 1
	 * @maxLength 128
	 */
	title: string;
}

/** SingleOrderInfoModel */
export interface SingleOrderInfoModel {
	contactInfo: OrderContactInfoModel;
	deliveryAddress: AddressModel;
	/** Is Seller */
	isSeller: boolean;
	/**
	 * Order Creation Timestamp
	 * @format date-time
	 */
	orderCreationTimestamp: string;
	/**
	 * Order Id
	 * @format uuid4
	 */
	orderId: string;
	/** Order Reception Timestamp */
	orderReceptionTimestamp: string | null;
	/**
	 * Products
	 * products are sorted in descending of their prices
	 */
	products: ProductModel[];
	status: OrderStatus;
	/** Store Id */
	storeId: string;
	/**
	 * Total Price
	 * Total price of order in kopeks
	 * @min 0
	 */
	totalPrice: number;
}

/** UserBalanceModel */
export interface UserBalanceModel {
	/**
	 * Balance
	 * Balance of user in kopeks
	 * @min 0
	 */
	balance: number;
}

/** UserOrdersModel */
export interface UserOrdersModel {
	/** Orders */
	orders: OrderInfoModel[];
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
export class OrderApi<SecurityDataType extends unknown> {
	http: HttpClient<SecurityDataType>;

	constructor(http: HttpClient<SecurityDataType>) {
		this.http = http;
	}

	balances = {
		/**
		 * No description
		 *
		 * @tags balances
		 * @name GetUserBalance
		 * @summary Get User Balance
		 * @request GET:/balances
		 * @secure
		 */
		getUserBalance: (
			query: {
				/**
				 * Store Id
				 * @example "672f3785db934d9b84beaafd"
				 */
				storeId: string;
			},
			params: RequestParams = {},
		) =>
			this.http.request<UserBalanceModel, HTTPValidationError>({
				path: `/balances`,
				method: 'GET',
				query: query,
				secure: true,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags internal
		 * @name ChangeUserBalance
		 * @summary Change User Balance
		 * @request POST:/balances
		 */
		changeUserBalance: (data: BalanceChangeModel, params: RequestParams = {}) =>
			this.http.request<DetailModel, HTTPValidationError>({
				path: `/balances`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),
	};
	orders = {
		/**
		 * No description
		 *
		 * @tags orders
		 * @name CreateOrder
		 * @summary Create Order
		 * @request POST:/orders
		 * @secure
		 */
		createOrder: (data: OrderCreationModel, params: RequestParams = {}) =>
			this.http.request<OrderCreatedModel, DetailModel | HTTPValidationError>({
				path: `/orders`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * @description Returns active orders sorted in descending by creation date. See parameter `ordered_from` for details.
		 *
		 * @tags orders
		 * @name GetActiveOrders
		 * @summary Get Active Orders
		 * @request GET:/orders/active
		 * @secure
		 */
		getActiveOrders: (
			query: {
				/**
				 * Ordered From
				 * True: returns orders that were ordered from current user's store, False: returns orders that current user ordered
				 */
				orderedFrom: boolean;
				/**
				 * Product Limit
				 * Max number of products that will be returned in the order
				 */
				productLimit?: number | null;
			},
			params: RequestParams = {},
		) =>
			this.http.request<UserOrdersModel, DetailModel | HTTPValidationError>({
				path: `/orders/active`,
				method: 'GET',
				query: query,
				secure: true,
				format: 'json',
				...params,
			}),

		/**
		 * @description Returns archive orders sorted in descending by creation date. See parameter `ordered_from` for details.
		 *
		 * @tags orders
		 * @name GetArchiveOrders
		 * @summary Get Archive Orders
		 * @request GET:/orders/archive
		 * @secure
		 */
		getArchiveOrders: (
			query: {
				/**
				 * Ordered From
				 * True: returns orders that were ordered from current user's store, False: returns orders that current user was ordered
				 */
				orderedFrom: boolean;
				/**
				 * Product Limit
				 * Max number of products that will be returned in the order
				 */
				productLimit?: number | null;
			},
			params: RequestParams = {},
		) =>
			this.http.request<UserOrdersModel, DetailModel | HTTPValidationError>({
				path: `/orders/archive`,
				method: 'GET',
				query: query,
				secure: true,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags orders
		 * @name GetOrderInfo
		 * @summary Get Order Info
		 * @request GET:/orders/{order_id}
		 * @secure
		 */
		getOrderInfo: (orderId: string, params: RequestParams = {}) =>
			this.http.request<SingleOrderInfoModel, DetailModel | HTTPValidationError>({
				path: `/orders/${orderId}`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags orders
		 * @name ChangeOrderStatus
		 * @summary Change Order Status
		 * @request PATCH:/orders/{order_id}/status
		 * @secure
		 */
		changeOrderStatus: (
			orderId: string,
			data: OrderChangeStatusModel,
			params: RequestParams = {},
		) =>
			this.http.request<DetailModel, DetailModel | HTTPValidationError>({
				path: `/orders/${orderId}/status`,
				method: 'PATCH',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),
	};
}

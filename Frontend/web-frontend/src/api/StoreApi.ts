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

export interface LogoUpdatedResponse {
	/**
	 * Logo image
	 * @format uri
	 * @example "https://i.pinimg.com/736x/5a/38/a6/5a38a6077eb3115b5ab1da7825d80032.jpg"
	 */
	logoUrl: string;
}

export interface DetailResponse {
	/** @example "detailed explanation of result" */
	detail: string;
}

export interface StoreCreatedResponse {
	/**
	 * Id of the store
	 * @example "507f1f77bcf86cd799439044"
	 */
	storeId: string;
}

export interface CreateStoreModel {
	/**
	 * Title of the store
	 * @example "Store title"
	 */
	title: string;
	/**
	 * Description of the store
	 * @example "Store description"
	 */
	description: string;
}

export interface ProductCreatedResponse {
	/**
	 * Id of the product
	 * @example "507f1f77bcf86cd799439042"
	 */
	productId: string;
}

/** Characteristics of the product */
export interface Characteristic {
	/**
	 * Name of the characteristic
	 * @example "Characteristic name"
	 */
	name: string;
	/**
	 * Value of the characteristic
	 * @example "Characteristic nam value"
	 */
	value: string;
}

export interface CreateProductModel {
	/**
	 * Title of the product
	 * @example "Product title"
	 */
	title: string;
	/**
	 * Description of the product
	 * @example "Product description"
	 */
	description: string;
	/**
	 * Price of the product in kopecks
	 * @format int32
	 * @example 100000
	 */
	price: number;
	/** Characteristics of the product */
	characteristics: Characteristic[];
}

export interface UpdateStoreModel {
	/**
	 * Title of the store
	 * @example "Store title"
	 */
	title?: string;
	/**
	 * Description of the store
	 * @example "Store description"
	 */
	description?: string;
}

export interface UpdateProductModel {
	/**
	 * Title of the product
	 * @example "Product title"
	 */
	title?: string;
	/**
	 * Description of the product
	 * @example "Product description"
	 */
	description?: string;
	/**
	 * Price of the product in kopecks
	 * @format int32
	 * @example 100000
	 */
	price?: number;
	/** Characteristics of the product */
	characteristics?: Characteristic[];
}

export interface StoreShortInfo {
	/**
	 * Title of the store
	 * @example "Store title"
	 */
	title: string;
	/**
	 * Id of the store
	 * @example "507f1f77bcf86cd799439044"
	 */
	storeId: string;
	/**
	 * Logo image of the store
	 * @format uri
	 * @example "https://i.pinimg.com/736x/5a/38/a6/5a38a6077eb3115b5ab1da7825d80032.jpg"
	 */
	logoUrl?: string;
}

export interface IsOwnerResponse {
	/**
	 * Is the user the owner of the store
	 * @example true
	 */
	owner: boolean;
}

export interface StoreFullInfo {
	/**
	 * Title of the store
	 * @example "Store title"
	 */
	title: string;
	/**
	 * Description of the store
	 * @example "Store description"
	 */
	description: string;
	/**
	 * Id of the store
	 * @example "507f1f77bcf86cd799439044"
	 */
	storeId: string;
	/**
	 * Logo image of the store
	 * @format uri
	 * @example "https://i.pinimg.com/736x/5a/38/a6/5a38a6077eb3115b5ab1da7825d80032.jpg"
	 */
	logoUrl?: string;
}

export interface StoreIdModel {
	/**
	 * Id of the store
	 * @example "507f1f77bcf86cd799439044"
	 */
	storeId: string;
}

export interface ProductShortInfo {
	/**
	 * Title of the product
	 * @example "Product title"
	 */
	title: string;
	/**
	 * Price of the product in kopecks
	 * @format int32
	 * @example 100000
	 */
	price: number;
	/**
	 * Id of the product
	 * @example "507f1f77bcf86cd799439042"
	 */
	productId: string;
	/**
	 * Image of the product
	 * @format uri
	 * @example "https://i.pinimg.com/736x/5a/38/a6/5a38a6077eb3115b5ab1da7825d80032.jpg"
	 */
	logoUrl?: string;
}

export interface ProductFullInfo {
	/**
	 * Title of the product
	 * @example "Product title"
	 */
	title: string;
	/**
	 * Description of the product
	 * @example "Product description"
	 */
	description: string;
	/**
	 * Price of the product in kopecks
	 * @format int32
	 * @example 100000
	 */
	price: number;
	/** Characteristics of the product */
	characteristics: Characteristic[];
	/**
	 * Id of the product
	 * @example "507f1f77bcf86cd799439042"
	 */
	productId: string;
	/**
	 * Image of the product
	 * @format uri
	 * @example "https://i.pinimg.com/736x/5a/38/a6/5a38a6077eb3115b5ab1da7825d80032.jpg"
	 */
	logoUrl?: string;
	/**
	 * Id of the store in which product is sold
	 * @example "507f1f77bcf86cd799439044"
	 */
	storeId: string;
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
		this.instance = axios.create({
			...axiosConfig,
			baseURL: axiosConfig.baseURL || 'http://localhost: 8000',
		});
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
 * @title OpenAPI definition
 * @version v0
 * @baseUrl http://localhost: 8000
 */
export class StoreApi<SecurityDataType extends unknown> {
	http: HttpClient<SecurityDataType>;

	constructor(http: HttpClient<SecurityDataType>) {
		this.http = http;
	}

	stores = {
		/**
		 * No description
		 *
		 * @tags Stores
		 * @name UpdateStoreLogo
		 * @summary Update Store Logo
		 * @request PUT:/stores/{store_id}/logo
		 * @secure
		 */
		updateStoreLogo: (
			storeId: string,
			data: {
				/**
				 * The logo image file (PNG, JPEG, SVG or WEBP) - max 10MB
				 * @format binary
				 */
				logo: File;
			},
			params: RequestParams = {},
		) =>
			this.http.request<LogoUpdatedResponse, DetailResponse>({
				path: `/stores/${storeId}/logo`,
				method: 'PUT',
				body: data,
				secure: true,
				type: ContentType.FormData,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Stores
		 * @name GetStoreList
		 * @summary Get Store List
		 * @request GET:/stores
		 */
		getStoreList: (
			query?: {
				/** @example "Store name" */
				search?: string;
			},
			params: RequestParams = {},
		) =>
			this.http.request<StoreShortInfo[], any>({
				path: `/stores`,
				method: 'GET',
				query: query,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Stores
		 * @name CreateStore
		 * @summary Create Store
		 * @request POST:/stores
		 * @secure
		 */
		createStore: (data: CreateStoreModel, params: RequestParams = {}) =>
			this.http.request<StoreCreatedResponse, DetailResponse>({
				path: `/stores`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Stores
		 * @name UpdateStore
		 * @summary Update Store
		 * @request PATCH:/stores/{store_id}
		 * @secure
		 */
		updateStore: (storeId: string, data: UpdateStoreModel, params: RequestParams = {}) =>
			this.http.request<DetailResponse, DetailResponse>({
				path: `/stores/${storeId}`,
				method: 'PATCH',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Stores
		 * @name GetStoreInfoShort
		 * @summary Get Store Short Info
		 * @request GET:/stores/{store_id}/short
		 */
		getStoreInfoShort: (storeId: string, params: RequestParams = {}) =>
			this.http.request<StoreShortInfo, DetailResponse>({
				path: `/stores/${storeId}/short`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Stores
		 * @name IsStoreOwner
		 * @summary Is Store Owner
		 * @request GET:/stores/{store_id}/is-owner
		 * @secure
		 */
		isStoreOwner: (storeId: string, params: RequestParams = {}) =>
			this.http.request<IsOwnerResponse, DetailResponse>({
				path: `/stores/${storeId}/is-owner`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Internal
		 * @name IsStoreOwnerByUserId
		 * @summary Is Store Owner By User Id
		 * @request GET:/stores/{store_id}/is-owner-by-user-id
		 */
		isStoreOwnerByUserId: (
			storeId: string,
			query: {
				/** @example "1522fd63-32d3-471c-9aa1-764e96dc0ef5" */
				userId: string;
			},
			params: RequestParams = {},
		) =>
			this.http.request<IsOwnerResponse, DetailResponse>({
				path: `/stores/${storeId}/is-owner-by-user-id`,
				method: 'GET',
				query: query,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Stores
		 * @name GetStoreInfoFull
		 * @summary Get Store Full Info
		 * @request GET:/stores/{store_id}/full
		 */
		getStoreInfoFull: (storeId: string, params: RequestParams = {}) =>
			this.http.request<StoreFullInfo, DetailResponse>({
				path: `/stores/${storeId}/full`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Stores
		 * @name GetMyStores
		 * @summary Get My Stores
		 * @request GET:/stores/my
		 * @secure
		 */
		getMyStores: (params: RequestParams = {}) =>
			this.http.request<StoreShortInfo[], DetailResponse>({
				path: `/stores/my`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Internal
		 * @name StoresListByUserId
		 * @summary Stores List By User Id
		 * @request GET:/stores/by-owner-id
		 */
		storesListByUserId: (
			query: {
				/** @example "1522fd63-32d3-471c-9aa1-764e96dc0ef5" */
				userId: string;
			},
			params: RequestParams = {},
		) =>
			this.http.request<StoreIdModel[], any>({
				path: `/stores/by-owner-id`,
				method: 'GET',
				query: query,
				format: 'json',
				...params,
			}),
	};
	products = {
		/**
		 * No description
		 *
		 * @tags Products
		 * @name UpdateProductLogo
		 * @summary Update Product Logo
		 * @request PUT:/products/{product_id}/logo
		 * @secure
		 */
		updateProductLogo: (
			productId: string,
			data: {
				/**
				 * The logo image file (PNG, JPEG, SVG or WEBP) - max 10MB
				 * @format binary
				 */
				logo: File;
			},
			params: RequestParams = {},
		) =>
			this.http.request<LogoUpdatedResponse, DetailResponse>({
				path: `/products/${productId}/logo`,
				method: 'PUT',
				body: data,
				secure: true,
				type: ContentType.FormData,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Products
		 * @name GetProductList
		 * @summary Get Product List
		 * @request GET:/products
		 */
		getProductList: (
			query: {
				/** @example "507f1f77bcf86cd799439044" */
				storeId: string;
			},
			params: RequestParams = {},
		) =>
			this.http.request<ProductShortInfo[], DetailResponse>({
				path: `/products`,
				method: 'GET',
				query: query,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Products
		 * @name CreateProduct
		 * @summary Create Product
		 * @request POST:/products
		 * @secure
		 */
		createProduct: (
			query: {
				/** @example "507f1f77bcf86cd799439044" */
				storeId: string;
			},
			data: CreateProductModel,
			params: RequestParams = {},
		) =>
			this.http.request<ProductCreatedResponse, DetailResponse>({
				path: `/products`,
				method: 'POST',
				query: query,
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Products
		 * @name UpdateProduct
		 * @summary Update Product
		 * @request PATCH:/products/{product_id}
		 * @secure
		 */
		updateProduct: (productId: string, data: UpdateProductModel, params: RequestParams = {}) =>
			this.http.request<DetailResponse, DetailResponse>({
				path: `/products/${productId}`,
				method: 'PATCH',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Products
		 * @name GetProductInfoShort
		 * @summary Get Product Short Info
		 * @request GET:/products/{product_id}/short
		 */
		getProductInfoShort: (productId: string, params: RequestParams = {}) =>
			this.http.request<ProductShortInfo, DetailResponse>({
				path: `/products/${productId}/short`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Products
		 * @name GetProductInfoFull
		 * @summary Get Product Full Info
		 * @request GET:/products/{product_id}/full
		 */
		getProductInfoFull: (productId: string, params: RequestParams = {}) =>
			this.http.request<ProductFullInfo, DetailResponse>({
				path: `/products/${productId}/full`,
				method: 'GET',
				format: 'json',
				...params,
			}),
	};
}

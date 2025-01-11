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

/** CreateUserSellerRequestModel */
export interface CreateUserSellerRequestModel {
	/** Comment */
	comment?: string | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
	/** Detail */
	detail?: ValidationError[];
}

/** NewPasswordRequestModel */
export interface NewPasswordRequestModel {
	/**
	 * New Password
	 * @minLength 8
	 * @maxLength 64
	 */
	newPassword: string;
}

/** ReturnCreateUserSellerRequestModel */
export interface ReturnCreateUserSellerRequestModel {
	/**
	 * Id
	 * @format uuid4
	 */
	id: string;
}

/** ReturnDetailModel */
export interface ReturnDetailModel {
	/** Detail */
	detail: string;
}

/** ReturnFoundUserByIdModel */
export interface ReturnFoundUserByIdModel {
	/** Detail */
	detail: string;
	/** Is Seller */
	isSeller: boolean;
}

/** ReturnFoundUserModel */
export interface ReturnFoundUserModel {
	/** Detail */
	detail: string;
	/** Is Seller */
	isSeller: boolean;
	/**
	 * User Id
	 * @format uuid4
	 */
	userId: string;
}

/** SellerRequestStatus */
export enum SellerRequestStatus {
	NoData = 'no_data',
	Requested = 'requested',
	Rejected = 'rejected',
}

/** TgIdUpdateModel */
export interface TgIdUpdateModel {
	/**
	 * Tg Id
	 * @min 1
	 */
	tgId: number;
}

/** UserCreationModel */
export interface UserCreationModel {
	/**
	 * Birthdate
	 * @format date
	 */
	birthdate: string;
	/**
	 * Email
	 * @format email
	 */
	email: string;
	/**
	 * First Name
	 * @minLength 2
	 * @maxLength 30
	 */
	firstName: string;
	/**
	 * Last Name
	 * @minLength 2
	 * @maxLength 30
	 */
	lastName: string;
	/**
	 * Password
	 * @minLength 8
	 * @maxLength 64
	 */
	password: string;
}

/** UserInfoModel */
export interface UserInfoModel {
	/**
	 * Birthdate
	 * @format date
	 */
	birthdate: string;
	/**
	 * Created At
	 * Date when the user was created
	 * @format date-time
	 */
	createdAt: string;
	/**
	 * Email
	 * @format email
	 */
	email: string;
	/**
	 * First Name
	 * @minLength 2
	 * @maxLength 30
	 */
	firstName: string;
	/** Is Seller */
	isSeller: boolean;
	/**
	 * Last Name
	 * @minLength 2
	 * @maxLength 30
	 */
	lastName: string;
	/** Status of the request */
	sellerRequestStatus: SellerRequestStatus;
	/** Tg Id */
	tgId: number | null;
	/**
	 * Updated At
	 * Date when the user was last updated
	 */
	updatedAt: string | null;
	/** Vk Id */
	vkId: number | null;
}

/** UserPasswordUpdateModel */
export interface UserPasswordUpdateModel {
	/**
	 * New Password
	 * @minLength 8
	 * @maxLength 64
	 */
	newPassword: string;
	/**
	 * Old Password
	 * @minLength 8
	 * @maxLength 64
	 */
	oldPassword: string;
}

/** UserUpdateModel */
export interface UserUpdateModel {
	/** Birthdate */
	birthdate?: string | null;
	/** First Name */
	firstName?: string | null;
	/** Last Name */
	lastName?: string | null;
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

/** VkIdUpdateModel */
export interface VkIdUpdateModel {
	/**
	 * Vk Id
	 * @min 1
	 */
	vkId: number;
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
export class UserApi<SecurityDataType extends unknown> {
	http: HttpClient<SecurityDataType>;

	constructor(http: HttpClient<SecurityDataType>) {
		this.http = http;
	}

	users = {
		/**
		 * @description Registers a new user with the specified data and, if successful, sends an email to confirm the account
		 *
		 * @name PostCreateUser
		 * @summary Create User
		 * @request POST:/users
		 */
		postCreateUser: (data: UserCreationModel, params: RequestParams = {}) =>
			this.http.request<ReturnDetailModel, HTTPValidationError>({
				path: `/users`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @name PatchEditUser
		 * @summary Edit User Data
		 * @request PATCH:/users/edit
		 * @secure
		 */
		patchEditUser: (data: UserUpdateModel, params: RequestParams = {}) =>
			this.http.request<ReturnDetailModel, ReturnDetailModel | HTTPValidationError>({
				path: `/users/edit`,
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
		 * @name PatchEditUserPassword
		 * @summary Edit User Password
		 * @request PATCH:/users/edit-pass
		 * @secure
		 */
		patchEditUserPassword: (data: UserPasswordUpdateModel, params: RequestParams = {}) =>
			this.http.request<ReturnDetailModel, ReturnDetailModel | HTTPValidationError>({
				path: `/users/edit-pass`,
				method: 'PATCH',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * @description Searches for a registered user with a verified account by email and password
		 *
		 * @tags internal
		 * @name GetFindVerifiedUser
		 * @summary Find Verified User
		 * @request GET:/users/find
		 */
		getFindVerifiedUser: (
			query: {
				/**
				 * Email
				 * @format email
				 */
				email: string;
				/** Password */
				password: string;
			},
			params: RequestParams = {},
		) =>
			this.http.request<ReturnFoundUserModel, ReturnDetailModel | HTTPValidationError>({
				path: `/users/find`,
				method: 'GET',
				query: query,
				format: 'json',
				...params,
			}),

		/**
		 * @description Searches for a registered user with a verified account by id
		 *
		 * @tags internal
		 * @name GetFindVerifiedUserById
		 * @summary Find Verified User By Id
		 * @request GET:/users/find/{user_id}
		 */
		getFindVerifiedUserById: (userId: string, params: RequestParams = {}) =>
			this.http.request<ReturnFoundUserByIdModel, ReturnDetailModel | HTTPValidationError>({
				path: `/users/find/${userId}`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @name GetMeInfo
		 * @summary Get Current User Info
		 * @request GET:/users/me
		 * @secure
		 */
		getMeInfo: (params: RequestParams = {}) =>
			this.http.request<UserInfoModel, ReturnDetailModel>({
				path: `/users/me`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params,
			}),

		/**
		 * @description Sends an email to current user to reset the password
		 *
		 * @name PostSendResetPasswordEmailWithCode
		 * @summary Start Password Reset
		 * @request POST:/users/reset-password
		 */
		postSendResetPasswordEmailWithCode: (
			query: {
				/**
				 * Email
				 * @format email
				 */
				email: string;
			},
			params: RequestParams = {},
		) =>
			this.http.request<ReturnDetailModel, HTTPValidationError>({
				path: `/users/reset-password`,
				method: 'POST',
				query: query,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @name PostResetPasswordCompletionWithCode
		 * @summary Reset Password
		 * @request POST:/users/reset-password/{code}
		 */
		postResetPasswordCompletionWithCode: (
			code: string,
			data: NewPasswordRequestModel,
			params: RequestParams = {},
		) =>
			this.http.request<ReturnDetailModel, ReturnDetailModel | HTTPValidationError>({
				path: `/users/reset-password/${code}`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * @description Create a request to the admin for becoming a seller.This request will initiate the process of verifying and approving the user's seller status
		 *
		 * @tags seller status
		 * @name PostSellerStatus
		 * @summary Request Seller Status
		 * @request POST:/users/seller-status
		 * @secure
		 */
		postSellerStatus: (data: CreateUserSellerRequestModel, params: RequestParams = {}) =>
			this.http.request<
				ReturnCreateUserSellerRequestModel,
				ReturnDetailModel | HTTPValidationError
			>({
				path: `/users/seller-status`,
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
		 * @tags social links
		 * @name DeleteUserTgId
		 * @summary Delete Telegram Id
		 * @request DELETE:/users/social-links/tg
		 * @secure
		 */
		deleteUserTgId: (params: RequestParams = {}) =>
			this.http.request<ReturnDetailModel, ReturnDetailModel>({
				path: `/users/social-links/tg`,
				method: 'DELETE',
				secure: true,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags social links
		 * @name PatchUpdateUserTgId
		 * @summary Update Telegram Id
		 * @request PATCH:/users/social-links/tg
		 * @secure
		 */
		patchUpdateUserTgId: (data: TgIdUpdateModel, params: RequestParams = {}) =>
			this.http.request<ReturnDetailModel, ReturnDetailModel | HTTPValidationError>({
				path: `/users/social-links/tg`,
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
		 * @tags social links
		 * @name DeleteUserVkId
		 * @summary Delete Vk Id
		 * @request DELETE:/users/social-links/vk
		 * @secure
		 */
		deleteUserVkId: (params: RequestParams = {}) =>
			this.http.request<ReturnDetailModel, ReturnDetailModel>({
				path: `/users/social-links/vk`,
				method: 'DELETE',
				secure: true,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags social links
		 * @name PatchUpdateUserVkId
		 * @summary Update Vk Id
		 * @request PATCH:/users/social-links/vk
		 * @secure
		 */
		patchUpdateUserVkId: (data: VkIdUpdateModel, params: RequestParams = {}) =>
			this.http.request<ReturnDetailModel, ReturnDetailModel | HTTPValidationError>({
				path: `/users/social-links/vk`,
				method: 'PATCH',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * @description Finishes user registration. Verify email = verify user
		 *
		 * @name PostVerifyEmailWithCode
		 * @summary Verify Email
		 * @request POST:/users/verify-email/{code}
		 */
		postVerifyEmailWithCode: (code: string, params: RequestParams = {}) =>
			this.http.request<ReturnDetailModel, ReturnDetailModel | HTTPValidationError>({
				path: `/users/verify-email/${code}`,
				method: 'POST',
				format: 'json',
				...params,
			}),
	};
}

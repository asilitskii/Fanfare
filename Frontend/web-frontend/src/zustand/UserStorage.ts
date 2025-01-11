import { create } from 'zustand/react';
import { SellerRequestStatus, UserInfoModel } from '../api/UserApi';
import { produce } from 'immer';
import {
	DEFAULT_ERROR_MESSAGE,
	orderApi,
	storeApi,
	userApi,
	userApiNoRedirect,
	UserResponseCodes,
} from '../api/API';
import axios from 'axios';
import { StoreShortInfo } from '../api/StoreApi';
import { OrderInfoModel, UserOrdersModel } from '../api/OrderApi';

export type OrderInfoType = {
	orderDetails: OrderInfoModel;
	logoUrl?: string;
	storeName: string;
};

interface UserStorage {
	userData: UserInfoModel | null;
	userStores: Array<StoreShortInfo> | null;

	userActiveOrders: Array<OrderInfoType> | null;
	userArchiveOrders: Array<OrderInfoType> | null;

	setUserData: (data: UserInfoModel) => void;
	clearUserData: () => void;
	loadUserData: () => Promise<UserInfoModel | null>;
	loadUserDataNoRedirect: () => Promise<void>;
	telegramLogin: (telegramId: number) => Promise<string | null>;
	vkLogin: (telegramId: number) => Promise<string | null>;
	telegramLogout: () => Promise<void>;
	vkLogout: () => Promise<void>;
	changePassword: (oldPassword: string, newPassword: string) => Promise<string | null>;
	changeUserData: (
		firstName: string,
		lastName: string,
		birthdate: string,
	) => Promise<string | null>;
	requestSellerRights: (text: string) => Promise<void>;
	fetchStores: () => Promise<void>;

	fetchActiveOrders: () => Promise<UserOrdersModel | null>;
	fetchArchiveOrders: () => Promise<UserOrdersModel | null>;
	fetchStoreInfo: (storeId: string) => Promise<StoreShortInfo | null>;

	setUserArchiveOrders: (data: Array<OrderInfoType>) => void;
	setUserActiveOrders: (data: Array<OrderInfoType>) => void;
}

export const useUserStorage = create<UserStorage>()((set) => ({
	userData: null,
	userStores: null,
	userArchiveOrders: null,
	userActiveOrders: null,

	setUserData: (data: UserInfoModel) => {
		set((state) => ({
			...state,
			userData: data,
		}));
	},

	clearUserData: () => {
		set((state) => ({
			...state,
			userData: null,
		}));
	},

	telegramLogin: async (tgId: number) => {
		try {
			await userApi.users.patchUpdateUserTgId({ tgId });
			set(
				produce((state) => {
					state.userData.tgId = tgId;
				}),
			);
			return null;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.status === UserResponseCodes.TELEGRAM_ID_IS_USED) {
					return 'Данный ID уже используется';
				}
			}
			return DEFAULT_ERROR_MESSAGE;
		}
	},

	vkLogin: async (vkId: number) => {
		try {
			await userApi.users.patchUpdateUserVkId({ vkId });
			set(
				produce((state) => {
					state.userData.vkId = vkId;
				}),
			);
			return null;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.status === UserResponseCodes.VK_ID_IS_USED) {
					return 'Данный ID уже используется';
				}
			}
			return DEFAULT_ERROR_MESSAGE;
		}
	},

	telegramLogout: async () => {
		try {
			await userApi.users.deleteUserTgId();
			set(
				produce((state) => {
					state.userData.tgId = null;
				}),
			);
		} catch (ignored) {
			/* empty */
		}
	},

	vkLogout: async () => {
		try {
			await userApi.users.deleteUserVkId();
			set(
				produce((state) => {
					state.userData.vkId = null;
				}),
			);
		} catch (ignored) {
			/* empty */
		}
	},

	changePassword: async (oldPassword: string, newPassword: string) => {
		try {
			await userApi.users.patchEditUserPassword({ oldPassword, newPassword });
			return null;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.status === UserResponseCodes.WRONG_PASSWORD) {
					return 'Неправильный пароль';
				}
			}
			return DEFAULT_ERROR_MESSAGE;
		}
	},

	changeUserData: async (firstName: string, lastName: string, birthdate: string) => {
		try {
			await userApi.users.patchEditUser({
				firstName,
				lastName,
				birthdate,
			});

			set(
				produce((state) => {
					state.userData = { ...state.userData, firstName, lastName, birthdate };
				}),
			);
			return null;
		} catch (ignored) {
			return DEFAULT_ERROR_MESSAGE;
		}
	},

	requestSellerRights: async (text: string) => {
		try {
			await userApi.users.postSellerStatus({ comment: text });
			set(
				produce((state) => {
					state.userData.sellerRequestStatus = SellerRequestStatus.Requested;
				}),
			);
		} catch (e) {
			/* empty */
		}
	},

	loadUserData: async () => {
		try {
			const response = await userApi.users.getMeInfo();
			set((state) => ({ ...state, userData: response.data }));
			return response.data;
		} catch (ignored) {
			/* empty */
		}
		return null;
	},

	loadUserDataNoRedirect: async () => {
		try {
			const response = await userApiNoRedirect.users.getMeInfo();
			set((state) => ({ ...state, userData: response.data }));
		} catch (ignored) {
			/* empty */
		}
	},

	fetchStores: async () => {
		try {
			const response = await storeApi.stores.getMyStores();
			set((state) => ({ ...state, userStores: response.data }));
		} catch (e) {
			/* empty */
		}
	},

	fetchActiveOrders: async () => {
		try {
			const response = await orderApi.orders.getActiveOrders({
				orderedFrom: false,
				productLimit: 5,
			});
			return response.data;
		} catch (ignored) {
			return null;
		}
	},

	fetchArchiveOrders: async () => {
		try {
			const response = await orderApi.orders.getArchiveOrders({
				orderedFrom: false,
				productLimit: 5,
			});
			return response.data;
		} catch (ignored) {
			return null;
		}
	},

	fetchStoreInfo: async (storeId: string) => {
		try {
			const response = await storeApi.stores.getStoreInfoShort(storeId);
			return response.data;
		} catch (ignored) {
			return null;
		}
	},

	setUserArchiveOrders: (data: Array<OrderInfoType>) => {
		set((state) => ({ ...state, userArchiveOrders: data }));
	},

	setUserActiveOrders: (data: Array<OrderInfoType>) => {
		set((state) => ({ ...state, userActiveOrders: data }));
	},
}));

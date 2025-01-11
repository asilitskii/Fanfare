import { create } from 'zustand/react';
import {
	DEFAULT_ERROR_MESSAGE,
	orderApi,
	orderApiNoRedirect,
	storeApi,
	StoreResponseCodes,
	tgApi,
	tgApiNoRedirect,
} from '../api/API';
import { ProductShortInfo, StoreFullInfo, StoreShortInfo } from '../api/StoreApi';
import axios, { HttpStatusCode } from 'axios';
import noLogo from '../assets/no-logo.svg';
import { ResponseStoreExchangeRate } from '../api/TgApi';

export const SHOP_NOT_FOUND_ERROR_MSG = 'Магазин не найден';

interface StoreStorage {
	logo: string | null;
	shopData: StoreFullInfo | null;

	tgData: ResponseStoreExchangeRate | null;
	invoice: number | null;
	tgIsSubscribed: boolean;
	isOwner: boolean | null;

	products: Array<ProductShortInfo> | null;

	loadLogo: (storeId: string) => Promise<void>;
	loadSellerStores: () => Promise<StoreShortInfo[]>;
	loadProducts: (storeId: string) => Promise<void>;
	getTgInfo: (storeId: string) => Promise<void>;
	getInvoice: (storeId: string) => Promise<void>;
	getTgSubscribed: (storeId: string) => Promise<void>;
	tgSubscribe: (storeId: string, tgId: number) => Promise<void>;
	tgUnsubscribe: (storeId: string) => Promise<void>;
	getOwnerInfo: (storeId: string) => Promise<void>;
}

export const useStoreStorage = create<StoreStorage>()((set) => ({
	logo: null,
	products: null,
	tgData: null,
	invoice: null,
	tgIsSubscribed: false,
	shopData: null,
	isOwner: null,

	loadLogo: async (storeId: string) => {
		try {
			const response = await storeApi.stores.getStoreInfoFull(storeId);
			if (response.data.logoUrl == undefined) {
				set((state) => ({ ...state, logo: noLogo, shopData: response.data }));
				return;
			}
			set((state) => ({ ...state, logo: response.data.logoUrl, shopData: response.data }));
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.status === StoreResponseCodes.STORE_NOT_FOUND) {
					throw new Error(SHOP_NOT_FOUND_ERROR_MSG);
				}
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},

	loadSellerStores: async () => {
		let stores;
		try {
			const response = await storeApi.stores.getMyStores();
			stores = response.data;
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.status === StoreResponseCodes.NOT_SELLER) {
					throw new Error('Вы не продавец');
				}
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
		if (stores.length === 0) {
			throw new Error('У вас нет магазинов');
		}
		return stores;
	},

	loadProducts: async (storeId: string) => {
		try {
			const response = await storeApi.products.getProductList({ storeId: storeId });
			set((state) => ({ ...state, products: response.data }));
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.status === StoreResponseCodes.STORE_NOT_FOUND) {
					throw new Error();
				}
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},

	getTgInfo: async (storeId: string) => {
		try {
			const response = await tgApi.tg.getStoreExchangeRates(storeId);
			set((state) => ({ ...state, tgData: response.data }));
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.status === StoreResponseCodes.STORE_NOT_FOUND) {
					// Shop not register in tg activity
					return;
				}
				if (e.status === HttpStatusCode.Unauthorized) {
					return;
				}
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},

	getInvoice: async (storeId: string) => {
		try {
			const response = await orderApiNoRedirect.balances.getUserBalance({ storeId });
			set((state) => ({ ...state, invoice: response.data.balance }));
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.status === StoreResponseCodes.STORE_NOT_FOUND) {
					throw new Error(SHOP_NOT_FOUND_ERROR_MSG);
				}
				if (e.status === HttpStatusCode.Unauthorized) {
					return;
				}
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},

	getTgSubscribed: async (storeId: string) => {
		try {
			const response = await tgApiNoRedirect.tg.isSubscribe(storeId);
			set((state) => ({ ...state, tgIsSubscribed: response.data.isSubscribe }));
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.status === StoreResponseCodes.STORE_NOT_FOUND) {
					// Shop not register in tg activity
					set((state) => ({ ...state, tgIsSubscribed: false }));
					return;
				}
				if (e.status === HttpStatusCode.Unauthorized) {
					set((state) => ({ ...state, tgIsSubscribed: false }));
					return;
				}
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},

	tgSubscribe: async (storeId: string, tgId: number) => {
		try {
			await tgApi.tg.addChannelSubscription(storeId, { tgUserId: tgId });
			set((state) => ({ ...state, tgIsSubscribed: true }));
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.status === StoreResponseCodes.STORE_NOT_FOUND) {
					throw new Error(SHOP_NOT_FOUND_ERROR_MSG);
				}
				if (e.status === HttpStatusCode.Unauthorized) {
					return;
				}
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},

	tgUnsubscribe: async (storeId: string) => {
		try {
			await tgApi.tg.deleteChannelSubscription(storeId);
			set((state) => ({ ...state, tgIsSubscribed: false }));
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.status === StoreResponseCodes.STORE_NOT_FOUND) {
					throw new Error(SHOP_NOT_FOUND_ERROR_MSG);
				}
				if (e.status === HttpStatusCode.Unauthorized) {
					return;
				}
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},

	getOwnerInfo: async (storeId: string) => {
		try {
			const response = await storeApi.stores.isStoreOwner(storeId);
			set((state) => ({ ...state, isOwner: response.data.owner }));
		} catch (ignored) {
			set((state) => ({ ...state, isOwner: false }));
			/* empty */
		}
	},
}));

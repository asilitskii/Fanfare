import { create } from 'zustand/react';
import { DEFAULT_ERROR_MESSAGE, storeApi, StoreResponseCodes } from '../api/API';
import axios, { AxiosResponse } from 'axios';
import { produce } from 'immer';
import { StoreCreatedResponse } from '../api/StoreApi';

interface StoreCreationStorage {
	creationStoreId: string | null;
	logo: File | null;
	setLogo: (logo: File) => Promise<void>;
	createStore: (title: string, description: string) => Promise<string | null>;
	uploadStoreLogo: () => Promise<void>;
}

export const useStoreCreationStorage = create<StoreCreationStorage>()((set, get) => ({
	creationStoreId: null,
	logo: null,

	setLogo: async (logo: File) => {
		set((state) => ({
			...state,
			logo: logo,
		}));
	},

	createStore: async (title: string, description: string) => {
		let response: AxiosResponse<StoreCreatedResponse, unknown>;
		try {
			response = await storeApi.stores.createStore({
				title: title,
				description: description,
			});
			set(
				produce((state) => {
					state.creationStoreId = response.data.storeId;
				}),
			);
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.status === StoreResponseCodes.STORE_TITLE_BUSY) {
					throw new Error('Название магазина занято');
				} else if (e.status === StoreResponseCodes.NOT_SELLER) {
					throw new Error('Вы не продавец');
				}
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
		return response.data.storeId;
	},

	uploadStoreLogo: async () => {
		const logo = get().logo;
		const creationStoreId = get().creationStoreId;
		if (logo && creationStoreId) {
			try {
				await storeApi.stores.updateStoreLogo(creationStoreId, { logo });
			} catch (e) {
				if (axios.isAxiosError(e)) {
					if (e.status === StoreResponseCodes.STORE_NOT_FOUND) {
						throw new Error('Магазин не создался');
					} else if (e.status === StoreResponseCodes.NOT_OWNER) {
						throw new Error('Вы не владелец магазина');
					}
				} else {
					throw new Error(DEFAULT_ERROR_MESSAGE);
				}
			}
		}
	},
}));

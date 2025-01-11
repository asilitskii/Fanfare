import { create } from 'zustand/react';
import { DEFAULT_ERROR_MESSAGE, ProductResponseCodes, storeApi } from '../api/API';
import axios from 'axios';
import { z } from 'zod';
import productCreationSchema from '../components/formvalidation/ProductCreationFormSchema';

interface ProductCreationStorage {
	storeId: string | null;
	createdProductId: string | null;
	logo: File | null;
	setStoreId: (storeId: string) => void;
	setLogo: (logo: File) => Promise<unknown>;
	createProduct: (data: z.infer<typeof productCreationSchema>) => Promise<void>;
	uploadProductLogo: () => Promise<void>;
}

export const useProductCreationStorage = create<ProductCreationStorage>()((set, get) => ({
	storeId: null,
	creationProductId: null,
	createdProductId: null,
	logo: null,

	setStoreId: (storeId: string) => {
		set((state) => ({
			...state,
			storeId: storeId,
		}));
	},

	setLogo: async (logo: File) => {
		set((state) => ({
			...state,
			logo: logo,
		}));
	},

	createProduct: async (data: z.infer<typeof productCreationSchema>) => {
		const storeId = get().storeId;
		if (!storeId) {
			throw new Error('Магазин неизвестен');
		}
		try {
			const response = await storeApi.products.createProduct({ storeId }, data);
			set((state) => ({
				...state,
				createdProductId: response.data.productId,
			}));
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.status === ProductResponseCodes.NOT_STORE_OWNER) {
					throw new Error('Вы не можете добавить товар в чужой магазин');
				}
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},

	uploadProductLogo: async () => {
		const logo = get().logo;
		const createdProductId = get().createdProductId;
		if (!createdProductId) {
			throw new Error('Товар не создался');
		}
		if (logo) {
			try {
				await storeApi.products.updateProductLogo(createdProductId, { logo });
			} catch (e) {
				if (axios.isAxiosError(e)) {
					if (e.status === ProductResponseCodes.PRODUCT_NOT_FOUND) {
						throw new Error('Товар не создался');
					} else if (e.status === ProductResponseCodes.NOT_PRODUCT_OWNER) {
						throw new Error('Вы не владелец товара');
					}
				} else {
					throw new Error(DEFAULT_ERROR_MESSAGE);
				}
			}
		}
	},
}));

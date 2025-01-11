import { create } from 'zustand/react';
import { DEFAULT_ERROR_MESSAGE, ProductResponseCodes, storeApi } from '../api/API';
import { ProductFullInfo } from '../api/StoreApi';
import axios from 'axios';

interface ProductStorage {
	product: ProductFullInfo | null;
	loadProduct: (productId: string) => Promise<void>;
}

export const useProductStorage = create<ProductStorage>((set) => ({
	product: null,

	loadProduct: async (productId: string) => {
		try {
			const response = await storeApi.products.getProductInfoFull(productId);
			set((state) => ({
				...state,
				product: response.data,
			}));
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.status === ProductResponseCodes.PRODUCT_NOT_FOUND) {
					throw new Error('Товар не найден');
				}
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},
}));

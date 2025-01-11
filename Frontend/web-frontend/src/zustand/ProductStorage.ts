import { create } from 'zustand/react';
import { storeApi } from '../api/API';
import type { ProductType } from '../components/product/Product';

interface ProductState {
	isLoading: boolean;
	loadProduct: (productId: string) => Promise<ProductType>;
}

export const useProductStorage = create<ProductState>((set) => ({
	isLoading: false,
	error: null,
	loadProduct: async (productId: string) => {
		set({ isLoading: true });
		try {
			const response = await storeApi.products.getProductInfoFull(productId);
			set({ isLoading: false });
			return response.data;
		} catch (error) {
			set({ isLoading: false });
			throw new Error('Не удалось загрузить данные о товаре');
		}
	},
}));

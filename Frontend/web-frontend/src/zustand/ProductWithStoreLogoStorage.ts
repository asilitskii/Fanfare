import { create } from 'zustand/react';
import { storeApi } from '../api/API';
import defaultLogo from '../assets/no-logo.svg';

interface ProductWithStoreLogoState {
	logo: string | null;
	error: string | null;
	loadLogo: (productId: string) => Promise<void>;
	storeId: string | null;
}

export const useProductWithStoreLogoStorage = create<ProductWithStoreLogoState>((set) => ({
	logo: null,
	error: null,
	storeId: null,

	loadLogo: async (productId: string) => {
		set({ error: null });
		try {
			const productResponse = await storeApi.products.getProductInfoFull(productId);
			const storeResponse = await storeApi.stores.getStoreInfoShort(
				productResponse.data.storeId,
			);
			set({ storeId: productResponse.data.storeId });
			const logo = storeResponse.data.logoUrl ?? defaultLogo;
			set({ logo });
		} catch (error) {
			set({ error: 'Invalid link' });
		}
	},
}));

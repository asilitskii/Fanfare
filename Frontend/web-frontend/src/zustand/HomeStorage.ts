import { create } from 'zustand/react';
import { storeApi } from '../api/API';
import type { StoreType } from '../components/home/store/Store';

interface HomeStorage {
	stores: StoreType[];
	filteredStores: StoreType[];
	isLoading: boolean;
	error: string | null;
	searchQuery: string;
	fetchStores: () => Promise<void>;
	setSearchQuery: (query: string) => void;
	resetFilter: () => void;
}

export const useHomeStorage = create<HomeStorage>((set, get) => ({
	stores: [],
	filteredStores: [],
	isLoading: false,
	error: null,
	searchQuery: '',
	fetchStores: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await storeApi.stores.getStoreList();
			const stores = response.data.map((store) => ({
				id: store.storeId,
				name: store.title,
				logoUrl: store.logoUrl,
			}));
			set({ stores, filteredStores: stores, isLoading: false });
		} catch (error) {
			set({ error: 'Невозможно загрузить магазины', isLoading: false });
		}
	},
	setSearchQuery: (query: string) => {
		const filteredStores = get().stores.filter((store) =>
			store.name.toLowerCase().includes(query.toLowerCase()),
		);
		set({ searchQuery: query, filteredStores });
	},
	resetFilter: () => {
		set({ searchQuery: '', filteredStores: get().stores });
	},
}));

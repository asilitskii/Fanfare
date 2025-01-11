import axios from 'axios';
import { create } from 'zustand/react';
import { DEFAULT_ERROR_MESSAGE, orderApi, OrderResponseCodes } from '../api/API';
import { OrderCreationModel } from '../api/OrderApi';

interface OrderCreationStorage {
	balance: number | null;
	loadBalance: (storeId: string) => Promise<void>;
	createOrder: (data: OrderCreationModel) => Promise<string | null>;
}

export const useOrderCreationStorage = create<OrderCreationStorage>((set) => ({
	balance: null,

	loadBalance: async (storeId: string) => {
		try {
			const response = await orderApi.balances.getUserBalance({ storeId });
			set((state) => ({ ...state, balance: response.data.balance }));
		} catch (e) {
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},

	createOrder: async (data: OrderCreationModel) => {
		try {
			const response = await orderApi.orders.createOrder(data);
			return response.data.orderId;
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.status === OrderResponseCodes.BAD_STORE_OR_PRODUCT) {
					throw new Error('Товар не найден или принадлежит другому магазину');
				}
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},
}));

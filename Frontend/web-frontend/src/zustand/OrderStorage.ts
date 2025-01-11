import { create } from 'zustand/react';
import { DEFAULT_ERROR_MESSAGE, orderApi, storeApi, OrderResponseCodes } from '../api/API';
import { SingleOrderInfoModel, OrderInfoModel, OrderStatus } from '../api/OrderApi';
import axios, { HttpStatusCode } from 'axios';

interface OrderState {
	order: SingleOrderInfoModel | null;
	storeTitle: string;
	isLoading: boolean;
	fetchOrder: (orderId: string) => Promise<void>;
	loadOrders: () => Promise<{ activeOrders: OrderInfoModel[]; archivedOrders: OrderInfoModel[] }>;
	changeOrderStatus: (newStatus: OrderStatus) => Promise<void>;
	cancelOrder: () => void;
	proceedOrder: () => void;
}

export const useOrderStorage = create<OrderState>((set, get) => ({
	order: null,
	storeTitle: '',
	isLoading: false,

	fetchOrder: async (orderId: string) => {
		set({ isLoading: true });
		try {
			const response = await orderApi.orders.getOrderInfo(orderId);
			const storeResponse = await storeApi.stores.getStoreInfoShort(response.data.storeId);
			set({ order: response.data, storeTitle: storeResponse.data.title, isLoading: false });
		} catch (e) {
			set({ isLoading: false });
			if (axios.isAxiosError(e)) {
				if (
					e.status === OrderResponseCodes.NOT_ORDER_OWNER ||
					e.status === OrderResponseCodes.NOT_SELLER
				) {
					throw new Error('Вы не можете просматривать этот заказ');
				} else if (
					e.status === OrderResponseCodes.ORDER_NOT_FOUND ||
					e.status === HttpStatusCode.UnprocessableEntity
				) {
					throw new Error('Заказ не найден');
				}

				throw new Error(DEFAULT_ERROR_MESSAGE);
			} else {
				throw new Error(DEFAULT_ERROR_MESSAGE);
			}
		}
	},
	changeOrderStatus: async (newStatus: OrderStatus) => {
		const order = get().order;
		if (!order) {
			throw new Error('Заказ не найден');
		}

		try {
			await orderApi.orders.changeOrderStatus(order.orderId, { newStatus });
			set({ order: { ...order, status: newStatus } });
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.status === OrderResponseCodes.ORDER_NOT_FOUND) {
					throw new Error('Заказ не найден');
				}
			} else {
				throw new Error(DEFAULT_ERROR_MESSAGE);
			}
		}
	},
	loadOrders: async () => {
		try {
			const activeResponse = await orderApi.orders.getActiveOrders({ orderedFrom: true });
			const archivedResponse = await orderApi.orders.getArchiveOrders({ orderedFrom: true });
			return {
				activeOrders: activeResponse.data.orders,
				archivedOrders: archivedResponse.data.orders,
			};
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.status === OrderResponseCodes.NOT_SELLER) {
					throw new Error('Вы не продавец');
				}
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},
	cancelOrder: async () => {
		await get().changeOrderStatus(OrderStatus.Canceled);
	},
	proceedOrder: async () => {
		const { order, changeOrderStatus } = get();
		if (!order) {
			throw new Error('Заказ не найден');
		}

		const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
			[OrderStatus.Created]: OrderStatus.Assembly,
			[OrderStatus.Assembly]: OrderStatus.OnTheWay,
			[OrderStatus.OnTheWay]: order.isSeller
				? OrderStatus.AwaitingReceipt
				: OrderStatus.Received,
			[OrderStatus.AwaitingReceipt]: OrderStatus.Received,
			[OrderStatus.Received]: null,
			[OrderStatus.Canceled]: null,
		};

		const nextStatus = nextStatusMap[order.status];
		if (nextStatus) {
			await changeOrderStatus(nextStatus);
		} else {
			throw new Error('Невозможно изменить статус заказа');
		}
	},
}));

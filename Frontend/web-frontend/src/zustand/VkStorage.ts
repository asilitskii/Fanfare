import { create } from 'zustand/react';
import { z } from 'zod';
import { vkSchema } from '../components/formvalidation/StoreCreationFormSchema';
import { DEFAULT_ERROR_MESSAGE, NetworksResponseCodes, vkApi } from '../api/API';
import axios from 'axios';

interface VkStorage {
	createVkGroupActivity: (storeId: string, data: z.infer<typeof vkSchema>) => Promise<void>;
}

export const useVkStorage = create<VkStorage>(() => ({
	createVkGroupActivity: async (storeId: string, data: z.infer<typeof vkSchema>) => {
		try {
			await vkApi.activity.activityCreate({ storeId, ...data });
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.status === NetworksResponseCodes.NOT_STORE_OWNER) {
					throw new Error('Вы не владелец магазина');
				}
				if (e.status === NetworksResponseCodes.NETWORK_BUSY) {
					// считаем что нет ошибки, если соцсеть уже имеется,
					// чтобы дальше мог продолжаться процесс регистрации магазина.
					return;
				}
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},
}));

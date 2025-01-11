import { create } from 'zustand/react';
import { z } from 'zod';
import { tgSchema } from '../components/formvalidation/StoreCreationFormSchema';
import { DEFAULT_ERROR_MESSAGE, NetworksResponseCodes, tgApi } from '../api/API';
import axios from 'axios';

interface TgStorage {
	createTgChannelActivity: (storeId: string, data: z.infer<typeof tgSchema>) => Promise<void>;
}

export const useTgStorage = create<TgStorage>(() => ({
	createTgChannelActivity: async (storeId: string, data: z.infer<typeof tgSchema>) => {
		try {
			await tgApi.tg.createChannelActivity({ storeId, ...data });
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.status === NetworksResponseCodes.NOT_STORE_OWNER) {
					throw new Error('Вы не владелец магазина');
				}
				if (e.status === NetworksResponseCodes.NETWORK_BUSY) {
					throw new Error('Соцсеть уже добавлена к магазину');
				}
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},
}));

import { create } from 'zustand/react';
import { userApi } from '../api/API';

interface RegisterStorage {
	register: (
		firstName: string,
		lastName: string,
		email: string,
		birthdate: string,
		password: string,
	) => Promise<void>;
}

export const useRegisterStorage = create<RegisterStorage>()(() => ({
	register: async (
		firstName: string,
		lastName: string,
		email: string,
		birthdate: string,
		password: string,
	) => {
		try {
			await userApi.users.postCreateUser({
				firstName,
				lastName,
				email,
				password,
				birthdate,
			});
		} catch (ignored) {
			/* empty */
		}
		// error codes: 422. Never achieve
	},
}));

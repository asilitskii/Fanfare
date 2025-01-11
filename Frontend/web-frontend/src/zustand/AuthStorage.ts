import { create } from 'zustand/react';
import {
	ACCESS_TOKEN,
	authApi,
	AuthResponseCodes,
	DEFAULT_ERROR_MESSAGE,
	REFRESH_TOKEN,
	userApi,
} from '../api/API';
import axios from 'axios';

interface AuthStorage {
	login: (login: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	passwordResetRequest: (email: string) => Promise<void>;
	passwordResetConfirmation: (newPassword: string, code: string) => Promise<void>;
}

export const useAuthStorage = create<AuthStorage>()(() => ({
	login: async (login: string, password: string) => {
		try {
			const response = await authApi.auth.postLogin({ email: login, password });
			localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);
			localStorage.setItem(REFRESH_TOKEN, response.data.refreshToken);
			return;
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.status === AuthResponseCodes.WRONG_EMAIL_OR_PASSWORD) {
					throw new Error('Неправильный логин или пароль');
				}
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},

	logout: async () => {
		const token = localStorage.getItem(REFRESH_TOKEN);
		if (!token) {
			localStorage.removeItem(ACCESS_TOKEN);
			return;
		}
		try {
			await authApi.auth.postLogout({ refreshToken: token });
		} catch (ignored) {
			/* empty */
		}
		localStorage.removeItem(ACCESS_TOKEN);
		localStorage.removeItem(REFRESH_TOKEN);
	},
	passwordResetRequest: async (email: string) => {
		try {
			await userApi.users.postSendResetPasswordEmailWithCode({ email });
		} catch (ignored) {
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},
	passwordResetConfirmation: async (newPassword: string, code: string) => {
		try {
			await userApi.users.postResetPasswordCompletionWithCode(code, { newPassword });
		} catch (e) {
			if (axios.isAxiosError(e)) {
				throw new Error('Данная ссылка не актуальна');
			}
			throw new Error(DEFAULT_ERROR_MESSAGE);
		}
	},
}));

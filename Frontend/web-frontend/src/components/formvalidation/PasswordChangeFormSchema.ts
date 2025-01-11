import { z } from 'zod';
import { passwordZod } from './ZodTypes';

const passwordChangeFormSchema = z
	.object({
		password: passwordZod,
		newPassword: passwordZod,
		passwordConfirmation: z.string({ required_error: '*Заполните поле' }),
	})
	.superRefine((values, ctx) => {
		if (values.newPassword !== values.passwordConfirmation) {
			ctx.addIssue({
				code: 'custom',
				message: '*Пароли не совпадают',
				path: ['passwordConfirmation'],
			});
		}
	});

export default passwordChangeFormSchema;

import { z } from 'zod';
import loginSchema from './LoginFormSchema';
import { birthdateZod, firstNameZod, lastNameZod } from './ZodTypes';

const registerSchema = loginSchema
	.extend({
		firstName: firstNameZod,
		lastName: lastNameZod,
		birthdate: birthdateZod,
		passwordConfirmation: z.string({ required_error: '*Заполните поле' }),
		acceptTOS: z.boolean().refine((value) => value, {
			message: '*Необходимо согласие',
		}),
	})
	.superRefine((values, ctx) => {
		if (values.password !== values.passwordConfirmation) {
			ctx.addIssue({
				code: 'custom',
				message: '*Пароли не совпадают',
				path: ['passwordConfirmation'],
			});
		}
	});

export default registerSchema;

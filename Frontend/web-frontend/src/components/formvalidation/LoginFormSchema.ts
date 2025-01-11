import { z } from 'zod';
import { emailZod, passwordZod } from './ZodTypes';

const loginSchema = z.object({
	email: emailZod,
	password: passwordZod,
});

export default loginSchema;

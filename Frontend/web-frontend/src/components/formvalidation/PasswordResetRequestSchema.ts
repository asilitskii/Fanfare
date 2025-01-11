import { z } from 'zod';
import { emailZod } from './ZodTypes';

const passwordResetRequestSchema = z.object({
	email: emailZod,
});
export default passwordResetRequestSchema;

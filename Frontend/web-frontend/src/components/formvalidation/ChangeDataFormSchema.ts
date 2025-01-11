import { z } from 'zod';
import { birthdateZod, firstNameZod, lastNameZod } from './ZodTypes';

const changeDataFormSchema = z.object({
	firstName: firstNameZod,
	lastName: lastNameZod,
	birthdate: birthdateZod,
});

export default changeDataFormSchema;

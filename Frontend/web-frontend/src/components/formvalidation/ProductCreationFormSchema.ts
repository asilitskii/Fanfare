import { z } from 'zod';

const MAX_TITLE_LENGTH = 128;
const MAX_DESCRIPTION_LENGTH = 4096;

const MIN_PRICE = 0;
const MAX_PRICE = 9999999;

const MAX_CHARACTERISTIC_NAME_LENGTH = 64;
const MAX_CHARACTERISTIC_VALUE_LENGTH = 32;

const MAX_CHARACTERISTIC_POOL_SIZE = 128;

export const productCharacteristicSchema = z.object({
	name: z
		.string({ required_error: '*Заполните поле' })
		.max(MAX_CHARACTERISTIC_NAME_LENGTH, '*Слишком длинное название'),
	value: z
		.string({ required_error: '*Заполните поле' })
		.max(MAX_CHARACTERISTIC_VALUE_LENGTH, '*Слишком длинное значение'),
});

const productCreationSchema = z.object({
	title: z
		.string({ required_error: '*Заполните поле' })
		.max(MAX_TITLE_LENGTH, '*Слишком длинное название'),
	description: z
		.string({ required_error: '*Заполните поле' })
		.max(MAX_DESCRIPTION_LENGTH, '*Слишком длинное описание'),
	price: z.coerce
		.number({ required_error: '*Заполните поле', invalid_type_error: '*Введите число' })
		.int('*Введите целое число')
		.min(MIN_PRICE, `*Введите значение от ${MIN_PRICE} до ${MAX_PRICE}`)
		.max(MAX_PRICE, `*Введите значение от ${MIN_PRICE} до ${MAX_PRICE}`),
	characteristics: z
		.array(productCharacteristicSchema)
		.max(MAX_CHARACTERISTIC_POOL_SIZE, '*Слишком много характеристик'),
});

export default productCreationSchema;

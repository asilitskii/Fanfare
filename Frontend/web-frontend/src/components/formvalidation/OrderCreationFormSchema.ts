import { z } from 'zod';

const LASTFIRSTNAME_MIN_LENGTH = 5;
const LASTFIRSTNAME_MAX_LENGTH = 61;

const APARTMENT_MAX_LENGTH = 4;

const CITY_MIN_LENGTH = 2;
const CITY_MAX_LENGTH = 64;

const HOUSE_MAX_LENGTH = 7;

const POSTALCODE_LENGTH = 6;

const STREET_MIN_LENGTH = 2;
const STREET_MAX_LENGTH = 64;

export const contactInfoSchema = z.object({
	lastFirstName: z
		.string({ required_error: '*Заполните поле' })
		.min(LASTFIRSTNAME_MIN_LENGTH, `*Введите не менее ${LASTFIRSTNAME_MIN_LENGTH} символов`)
		.max(LASTFIRSTNAME_MAX_LENGTH, `*Введите не более ${LASTFIRSTNAME_MAX_LENGTH} символов`),
	phoneNumber: z
		.string({ required_error: '*Заполните поле' })
		.regex(/^\+7[0-9]{10}$/, '*Формат: +77777777777'),
});

export const deliveryAddressSchema = z.object({
	apartment: z
		.preprocess(
			(arg) => arg || null,
			z
				.string()
				.max(APARTMENT_MAX_LENGTH, `*Введите не более ${APARTMENT_MAX_LENGTH} символов`)
				.nullish(),
		)
		.transform((arg) => arg || null),
	city: z
		.string({ required_error: '*Заполните поле' })
		.min(CITY_MIN_LENGTH, `*Введите не менее ${CITY_MIN_LENGTH} символов`)
		.max(CITY_MAX_LENGTH, `*Введите не более ${CITY_MAX_LENGTH} символов`),
	house: z
		.string({ required_error: '*Заполните поле' })
		.max(HOUSE_MAX_LENGTH, `*Введите не более ${HOUSE_MAX_LENGTH} символов`),
	postalCode: z
		.string({ required_error: '*Заполните поле' })
		.length(POSTALCODE_LENGTH, `*Код должен состоять из ${POSTALCODE_LENGTH} цифр`)
		.regex(/^[0-9]+$/, '*Код должен состоять из цифр'),
	street: z
		.string({ required_error: '*Заполните поле' })
		.min(STREET_MIN_LENGTH, `*Введите не менее ${STREET_MIN_LENGTH} символов`)
		.max(STREET_MAX_LENGTH, `*Введите не более ${STREET_MAX_LENGTH} символов`),
});

export const orderCreationSchema = z.object({
	contactInfo: contactInfoSchema,
	deliveryAddress: deliveryAddressSchema,
});

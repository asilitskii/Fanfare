import { z } from 'zod';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 30;
const namesRegexp = new RegExp('^[A-Za-zА-Яа-яёЁ-]+$');
const MAX_EMAIL_LENGTH = 128;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

const MIN_ACTIVITY_TIME_WAIT = 0;
const MAX_ACTIVITY_TIME_WAIT = 168;
const ACTIVITY_TIME_WAIT_ERROR_MSG = `*Введите значение 
										от ${MIN_ACTIVITY_TIME_WAIT} 
										до ${MAX_ACTIVITY_TIME_WAIT} часов`;

const VK_MIN_PER_ACTIVITY_POINTS = 0.1;
const TG_MIN_PER_ACTIVITY_POINTS = 1;

export const firstNameZod = z
	.string({ required_error: '*Заполните поле' })
	.regex(namesRegexp, '*Используйте только латиницу, кириллицу или тире')
	.min(MIN_NAME_LENGTH, '*Слишком короткое имя')
	.max(MAX_NAME_LENGTH, '*Слишком длинное имя');

export const lastNameZod = z
	.string({ required_error: '*Заполните поле' })
	.regex(namesRegexp, '*Используйте только латиницу, кириллицу или тире')
	.min(MIN_NAME_LENGTH, '*Слишком короткая фамилия')
	.max(MAX_NAME_LENGTH, '*Слишком длинная фамилия');

export const birthdateZod = z
	.string({ required_error: '*Заполните поле' })
	.date()
	.refine(
		(value) => {
			const selectedDate = new Date(value);
			selectedDate.setDate(selectedDate.getDate() + 1); // ignore timezone
			const today = new Date();
			return selectedDate < today;
		},
		{
			message: '*Выберите корректную дату',
		},
	);

export const passwordZod = z
	.string({ required_error: '*Заполните поле' })
	.regex(/^[a-zA-Z0-9^_=!#$%&()*+-.:'/?@\\"`~<>;{},[\]|]*$/, '*Недопустимый символ')
	.regex(/[A-Z]/, '*Отсутствует большая буква')
	.regex(/[0-9]/, '*Отсутствует цифра')
	.min(MIN_PASSWORD_LENGTH, '*Слишком короткий пароль')
	.max(MAX_PASSWORD_LENGTH, '*Слишком длинный пароль');

export const emailZod = z
	.string({ required_error: '*Заполните поле' })
	.email('*Неправильный E-mail')
	.max(MAX_EMAIL_LENGTH, '*Слишком длинный E-mail');

export const activityTimeWaitZod = z.coerce
	.number({ required_error: '*Заполните поле' })
	.min(MIN_ACTIVITY_TIME_WAIT, ACTIVITY_TIME_WAIT_ERROR_MSG)
	.max(MAX_ACTIVITY_TIME_WAIT, ACTIVITY_TIME_WAIT_ERROR_MSG);

export const vkActivityPointsZod = z.coerce
	.number({ required_error: '*Заполните поле' })
	.min(VK_MIN_PER_ACTIVITY_POINTS, `*Введите значение от ${VK_MIN_PER_ACTIVITY_POINTS}`);

export const tgActivityPointsZod = z.coerce
	.number({ required_error: '*Заполните поле' })
	.min(TG_MIN_PER_ACTIVITY_POINTS, `*Введите значение от ${TG_MIN_PER_ACTIVITY_POINTS}`);

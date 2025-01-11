import { z } from 'zod';
import { activityTimeWaitZod, tgActivityPointsZod, vkActivityPointsZod } from './ZodTypes';

const MIN_TITLE_LENGTH = 2;
const MAX_TITLE_LENGTH = 32;
const MAX_DESCRIPTION_LENGTH = 600;

export enum Networks {
	tg = 'tg',
	vk = 'vk',
}

export const NetworksEnum = z.nativeEnum(Networks);

export const tgSchema = z.object({
	tgChatId: z.coerce.number({
		required_error: '*Заполните поле',
		invalid_type_error: '*Введите число',
	}),
	tgChannelId: z.coerce.number({
		required_error: '*Заполните поле',
		invalid_type_error: '*Введите число',
	}),
	commentTimeWait: activityTimeWaitZod,
	perCommentPoints: tgActivityPointsZod,
	boostTimeWait: activityTimeWaitZod,
	perBoostPoints: tgActivityPointsZod,
});

export const vkSchema = z.object({
	vkToken: z.string({ required_error: '*Заполните поле' }),
	commentTimeWait: activityTimeWaitZod,
	perCommentPoints: vkActivityPointsZod,
	likeTimeWait: activityTimeWaitZod,
	perLikePoints: vkActivityPointsZod,
});

const storeCreationSchema = z.object({
	title: z
		.string({ required_error: '*Заполните поле' })
		.min(MIN_TITLE_LENGTH, '*Слишком короткое название')
		.max(MAX_TITLE_LENGTH, '*Слишком длинное название')
		.regex(
			new RegExp('^[A-Za-zА-Яа-яёЁ !"#$%&\'()*+,-./:;<=>?@\\n]+$'),
			'*Используйте только латиницу, кириллицу, пробел, перенос строки или !"#$%&\'()*+,-./:;<=>?@',
		),
	description: z
		.string({ required_error: '*Заполните поле' })
		.min(0)
		.max(MAX_DESCRIPTION_LENGTH, '*Слишком длинное описание'),
});

export default storeCreationSchema;

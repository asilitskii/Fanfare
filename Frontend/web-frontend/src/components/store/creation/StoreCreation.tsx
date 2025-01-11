import React, { MutableRefObject, useMemo, useRef, useState } from 'react';
import style from './StoreCreation.module.scss';
import Logo from '../../assets/header/Logo';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { z } from 'zod';
import storeCreationSchema from '../../formvalidation/StoreCreationFormSchema';
import storeCreationFormSchema, {
	Networks,
	tgSchema,
	vkSchema,
} from '../../formvalidation/StoreCreationFormSchema';
import { Upload } from '../../assets/upload/Upload';
import { getNoun } from '../../../utils/utils';
import { Tip } from '../../assets/tip/Tip';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const VK_ACTIVITY_STEP = 0.1;

export type StoreCreationFormValues = z.infer<typeof storeCreationSchema>;

type TgFormValues = z.infer<typeof tgSchema>;
type VkFormValues = z.infer<typeof vkSchema>;

type StoreCreationPropsType = {
	creationStoreId: string | null;
	setLogo: (logo: File) => Promise<void>;
	createStore: (title: string, description: string) => Promise<string | null>;
	createTgChannelActivity: (storeId: string, data: TgFormValues) => Promise<void>;
	createVkGroupActivity: (storeId: string, data: VkFormValues) => Promise<void>;
	uploadStoreLogo: () => Promise<void>;
	onCancel: () => void;
};

const StoreCreation: React.FC<StoreCreationPropsType> = ({
	creationStoreId,
	setLogo,
	createStore,
	createTgChannelActivity,
	createVkGroupActivity,
	uploadStoreLogo,
	onCancel,
}) => {
	return (
		<div className={style.wrapper}>
			<Logo />
			<h2>Создание магазина</h2>
			<StoreCreationFrom
				creationStoreId={creationStoreId}
				setLogo={setLogo}
				createStore={createStore}
				createTgChannelActivity={createTgChannelActivity}
				createVkGroupActivity={createVkGroupActivity}
				uploadStoreLogo={uploadStoreLogo}
				onCancel={onCancel}
			/>
		</div>
	);
};

const StoreCreationFrom: React.FC<StoreCreationPropsType> = ({
	creationStoreId,
	setLogo,
	createStore,
	createTgChannelActivity,
	createVkGroupActivity,
	uploadStoreLogo,
	onCancel,
}) => {
	const [networks, setNetworks] = useState<Networks[]>([]);
	const [isFetching, setIsFetching] = useState(false);
	const navigator = useNavigate();

	const formikRef: MutableRefObject<FormikProps<StoreCreationFormValues> | null> =
		useRef<FormikProps<StoreCreationFormValues> | null>(null);

	const tgFormikRef: MutableRefObject<FormikProps<TgFormValues> | null> =
		useRef<FormikProps<TgFormValues> | null>(null);

	// const vkFormikRef: MutableRefObject<FormikProps<VkFormValues> | null> =
	// 	useRef<FormikProps<VkFormValues> | null>(null);

	const defaultValues = useMemo(
		() => ({
			title: '',
			description: '',
		}),
		[],
	);

	const renderTextInput = (name: keyof StoreCreationFormValues, placeholder: string) => {
		return (
			<div className={style.inputBox}>
				<ErrorMessage name={name} component="div" className={style.error} />
				<Field
					name={name}
					type="text"
					placeholder={placeholder}
					className={style.input}
					disabled={creationStoreId}
				/>
			</div>
		);
	};

	const renderTextAreaInput = (name: keyof StoreCreationFormValues, placeholder: string) => {
		return (
			<div className={style.inputTextAreaBox}>
				<ErrorMessage name={name} component="div" className={style.error} />
				<Field
					name={name}
					as="textarea"
					placeholder={placeholder}
					className={style.input}
					disabled={creationStoreId}
				/>
			</div>
		);
	};

	const handleNetworkChange = (network: Networks) => {
		setNetworks((prevState) => {
			if (prevState.includes(network)) {
				return prevState.filter((n) => n !== network);
			}
			return [...prevState, network];
		});
	};

	return (
		<Formik
			innerRef={(f) => (formikRef.current = f)}
			initialValues={defaultValues}
			onSubmit={async (values) => {
				if (networks.length === 0) {
					toast.error('Добавьте хотя бы одну социальную сеть');
					return;
				}

				// show errors on forms if they weren't touched
				tgFormikRef.current?.handleSubmit();
				// vkFormikRef.current?.handleSubmit();

				// check is tgForm has errors.
				if (
					networks.includes(Networks.tg) &&
					Object.keys((await tgFormikRef.current?.validateForm()) ?? {}).length !== 0
				) {
					return;
				}

				// if (
				// 	networks.includes(Networks.vk) &&
				// 	Object.keys((await vkFormikRef.current?.validateForm()) ?? {}).length !== 0
				// ) {
				// 	return;
				// }

				setIsFetching(true);

				if (!creationStoreId) {
					try {
						creationStoreId = await createStore(values.title, values.description);
					} catch (error) {
						if (error instanceof Error) {
							toast.error(error.message);
						}
						setIsFetching(false);
						return;
					}
				}
				if (creationStoreId) {
					if (networks.includes(Networks.tg) && tgFormikRef.current?.values) {
						try {
							await createTgChannelActivity(
								creationStoreId,
								tgFormikRef.current?.values,
							);
							tgFormikRef.current?.resetForm();
						} catch (error) {
							if (error instanceof Error) {
								toast.error(`TG: ${error.message}`);
							}
							setIsFetching(false);
							return;
						}
					}
					// if (networks.includes(Networks.vk) && vkFormikRef.current?.values) {
					// 	try {
					// 		await createVkGroupActivity(
					// 			creationStoreId,
					// 			vkFormikRef.current?.values,
					// 		);
					// 		vkFormikRef.current?.resetForm();
					// 	} catch (error) {
					// 		if (error instanceof Error) {
					// 			toast.error(`VK: ${error.message}`);
					// 		}
					// 		setIsFetching(false);
					// 		return;
					// 	}
					// }
					try {
						await uploadStoreLogo();
					} catch (error) {
						if (error instanceof Error) {
							toast.error(error.message);
						}
					}
				}
				setIsFetching(false);
				navigator(`/store/${creationStoreId}`);
			}}
			validationSchema={toFormikValidationSchema(storeCreationFormSchema)}
		>
			{() => (
				<Form>
					<div className={style.columns}>
						<div>
							{renderTextInput('title', 'Название')}
							{renderTextAreaInput('description', 'Описание')}

							<h3>Логотип</h3>
							<Upload
								onUpload={setLogo}
								placeholder="Загрузить логотип"
								maxSizeMB={10}
							/>
						</div>

						<div>
							<div style={{ display: 'flex' }}>
								<h3 style={{ margin: '0 0 2% 6%' }}>Социальные сети</h3>
								<ErrorMessage
									name="networks"
									component="span"
									className={style.error}
								/>
							</div>
							<div className={style.checkboxBox}>
								<label className={style.checkbox}>
									<input
										type="checkbox"
										checked={networks.includes(Networks.tg)}
										onChange={() => handleNetworkChange(Networks.tg)}
									/>
									<h3>Telegram</h3>
								</label>
							</div>
							{networks.find((network) => network === Networks.tg) && (
								<TgForm formikRef={tgFormikRef} />
							)}
							{/*<div className={style.checkboxBox}>*/}
							{/*	<label className={style.checkbox}>*/}
							{/*		<input*/}
							{/*			type="checkbox"*/}
							{/*			checked={networks.includes(Networks.vk)}*/}
							{/*			onChange={() => handleNetworkChange(Networks.vk)}*/}
							{/*		/>*/}
							{/*		<h3>Вконтакте</h3>*/}
							{/*	</label>*/}
							{/*</div>*/}
							{/*{networks.find((network) => network === Networks.vk) && (*/}
							{/*	<VkForm formikRef={vkFormikRef} />*/}
							{/*)}*/}
						</div>
					</div>

					<footer>
						<button type={'submit'} disabled={isFetching} className={style.createBtn}>
							Создать магазин
						</button>

						<button type={'button'} className={style.cancelBtn} onClick={onCancel}>
							Отмена
						</button>
					</footer>
				</Form>
			)}
		</Formik>
	);
};

type TgFormPropsType = {
	formikRef: MutableRefObject<FormikProps<TgFormValues> | null>;
};

type VkFormPropsType = {
	formikRef: MutableRefObject<FormikProps<VkFormValues> | null>;
};

const TgForm: React.FC<TgFormPropsType> = ({ formikRef }) => {
	const tgDefaultValues = useMemo(
		() => ({
			tgChatId: '' as unknown as number,
			tgChannelId: '' as unknown as number,
			commentTimeWait: 0,
			perCommentPoints: 1,
			boostTimeWait: 0,
			perBoostPoints: 1,
		}),
		[],
	);

	const renderNumericAsTextInput = (name: keyof TgFormValues, placeholder: string) => {
		return (
			<div className={style.inputBox}>
				<ErrorMessage name={name} component="div" className={style.error} />
				<Field
					name={name}
					type="number"
					placeholder={placeholder}
					className={style.noSpinner}
				/>
			</div>
		);
	};

	const renderNumericInput = (
		name: keyof TgFormValues,
		label: string,
		metrics: string | { one: string; few: string; others: string },
	) => {
		return (
			<div className={style.smallInputBox}>
				<ErrorMessage name={name} component="div" className={style.error} />
				<label>
					<span>{label}</span>
					<Field name={name}>
						{({ field }: FieldProps) => (
							<>
								<input className={style.input} type="number" {...field} />
								{typeof metrics === 'string'
									? metrics
									: (() => {
										return getNoun(
											field.value,
											metrics.one,
											metrics.few,
											metrics.others,
										);
									})()}
							</>
						)}
					</Field>
				</label>
			</div>
		);
	};

	return (
		<Formik
			innerRef={formikRef}
			initialValues={tgDefaultValues}
			onSubmit={() => undefined}
			validationSchema={toFormikValidationSchema(tgSchema)}
		>
			{() => (
				<div className={style.subform}>
					<div className={style.inputWithTip}>
						{renderNumericAsTextInput('tgChannelId', 'ID канала')}
						<Tip>
							<a
								target="_blank"
								href="https://docs.leadconverter.su/faq/populyarnye-voprosy/telegram/kak-uznat-id-telegram-kanala"
							>
								Инструкция
							</a>
						</Tip>
					</div>
					<div className={style.inputWithTip}>
						{renderNumericAsTextInput('tgChatId', 'ID чата')}
						<Tip>
							<a
								target="_blank"
								href="https://docs.leadconverter.su/faq/populyarnye-voprosy/telegram/kak-uznat-id-telegram-gruppy-chata"
							>
								Инструкция
							</a>
						</Tip>
					</div>
					{renderNumericInput('perCommentPoints', 'Стоимость комментария:', 'FanfCoin')}
					{renderNumericInput('commentTimeWait', 'Время ожидания комментария:', {
						one: 'час',
						few: 'часа',
						others: 'часов',
					})}
					{renderNumericInput('perBoostPoints', 'Стоимость буста:', 'FanfCoin')}
					{renderNumericInput('boostTimeWait', 'Время ожидания буста:', {
						one: 'час',
						few: 'часа',
						others: 'часов',
					})}
				</div>
			)}
		</Formik>
	);
};

const VkForm: React.FC<VkFormPropsType> = ({ formikRef }) => {
	const vkDefaultValues = useMemo(
		() => ({
			vkToken: '',
			commentTimeWait: 0,
			perCommentPoints: 0.1,
			likeTimeWait: 0,
			perLikePoints: 0.1,
		}),
		[],
	);

	const renderTextInput = (name: keyof VkFormValues, placeholder: string) => {
		return (
			<div className={style.inputBox}>
				<ErrorMessage name={name} component="div" className={style.error} />
				<Field name={name} type="text" placeholder={placeholder} className={style.input} />
			</div>
		);
	};

	const renderNumericInput = (
		name: keyof VkFormValues,
		label: string,
		metrics: string | { one: string; few: string; others: string },
		step?: number,
	) => {
		return (
			<div className={style.smallInputBox}>
				<ErrorMessage name={name} component="div" className={style.error} />
				<label>
					<span>{label}</span>
					<Field name={name}>
						{({ field }: FieldProps) => (
							<>
								<input
									className={style.input}
									type="number"
									step={step}
									{...field}
								/>
								{typeof metrics === 'string'
									? metrics
									: (() => {
										return getNoun(
											field.value,
											metrics.one,
											metrics.few,
											metrics.others,
										);
									})()}
							</>
						)}
					</Field>
				</label>
			</div>
		);
	};

	return (
		<Formik
			innerRef={formikRef}
			initialValues={vkDefaultValues}
			onSubmit={() => undefined}
			validationSchema={toFormikValidationSchema(vkSchema)}
		>
			{() => (
				<div className={style.subform}>
					<div className={style.inputWithTip}>
						{renderTextInput('vkToken', 'Токен')}
						<Tip>
							Откройте раздел «Управление сообществом» («Управление страницей», если у
							Вас публичная страница), выберите вкладку «Работа с API» и нажмите
							«Создать ключ доступа».
						</Tip>
					</div>
					{renderNumericInput(
						'perLikePoints',
						'Стоимость лайка:',
						'FanfCoin',
						VK_ACTIVITY_STEP,
					)}
					{renderNumericInput('likeTimeWait', 'Время ожидания лайка:', {
						one: 'час',
						few: 'часа',
						others: 'часов',
					})}
					{renderNumericInput(
						'perCommentPoints',
						'Стоимость комментария:',
						'FanfCoin',
						VK_ACTIVITY_STEP,
					)}
					{renderNumericInput('commentTimeWait', 'Время ожидания комментария:', {
						one: 'час',
						few: 'часа',
						others: 'часов',
					})}
				</div>
			)}
		</Formik>
	);
};

export default StoreCreation;

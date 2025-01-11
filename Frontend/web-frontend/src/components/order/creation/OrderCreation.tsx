import { ProductFullInfo } from '../../../api/StoreApi';
import { OrderCreationModel } from '../../../api/OrderApi';
import style from './OrderCreation.module.scss';
import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import {
	contactInfoSchema,
	deliveryAddressSchema,
	orderCreationSchema,
} from '../../formvalidation/OrderCreationFormSchema';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import noLogo from '../../../assets/no-logo.svg';
import { decoratePrice, logoFallback } from '../../../utils/utils';
import InputMask from 'react-input-mask';

type OrderCreationFormValues = z.infer<typeof orderCreationSchema>;
type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;
type DeliveryAddressFormValues = z.infer<typeof deliveryAddressSchema>;

type OrderCreationPropsType = {
	balance: number;
	product: ProductFullInfo;
	createOrder: (data: OrderCreationModel) => Promise<string | null>;
	onOrderCreated: (orderCreationId: string) => void;
	onCancel: () => void;
};

const OrderCreation: React.FC<OrderCreationPropsType> = ({
	balance,
	product,
	createOrder,
	onOrderCreated,
	onCancel,
}) => {
	return (
		<div className={style.wrapper}>
			<h2>Оформление заказа</h2>
			<OrderCreationForm
				balance={balance}
				product={product}
				createOrder={createOrder}
				onOrderCreated={onOrderCreated}
				onCancel={onCancel}
			/>
		</div>
	);
};

const OrderCreationForm: React.FC<OrderCreationPropsType> = ({
	balance,
	product,
	createOrder,
	onOrderCreated,
	onCancel,
}) => {
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const formikRef: MutableRefObject<FormikProps<OrderCreationFormValues> | null> =
		useRef<FormikProps<OrderCreationFormValues> | null>(null);

	useEffect(() => {
		if (balance < product.price) {
			setError('*Недостаточно средств');
			setIsFetching(true);
		}
	}, [balance, product.price]);

	const defaultValues = useMemo(
		() => ({
			contactInfo: {
				lastFirstName: '',
				phoneNumber: '',
			},
			deliveryAddress: {
				apartment: '' as string | null,
				city: '',
				house: '',
				postalCode: '',
				street: '',
			},
		}),
		[],
	);

	const renderTextInput = (
		group: keyof OrderCreationFormValues,
		name: keyof ContactInfoFormValues | keyof DeliveryAddressFormValues,
		placeholder: string,
	) => {
		return (
			<div className={style.inputBox}>
				<ErrorMessage name={`${group}.${name}`} component="div" className={style.error} />
				<Field
					name={`${group}.${name}`}
					type="text"
					placeholder={placeholder}
					className={style.input}
				/>
			</div>
		);
	};

	return (
		<Formik
			innerRef={(f) => (formikRef.current = f)}
			initialValues={defaultValues}
			onSubmit={(values) => {
				setIsFetching(true);
				createOrder({
					...values,
					products: [{ id: product.productId, count: 1 }],
					deliveryAddress: {
						...values.deliveryAddress,
						apartment: values.deliveryAddress.apartment || null,
					},
					storeId: product.storeId,
				})
					.then((creationOrderId) => {
						setIsFetching(false);
						onOrderCreated(creationOrderId || '');
					})
					.catch((error) => {
						if (error instanceof Error) {
							toast.error(error.message);
						}
						setIsFetching(false);
					});
			}}
			validationSchema={toFormikValidationSchema(orderCreationSchema)}
		>
			{() => (
				<Form>
					<div className={style.columns}>
						<div className={style.col}>
							<div className={style.smallBlock}>
								<h3>1. КОНТАКТНАЯ ИНФОРМАЦИЯ</h3>
								{renderTextInput('contactInfo', 'lastFirstName', 'Фамилия и имя')}
								<div className={style.inputBox}>
									<ErrorMessage
										name="contactInfo.phoneNumber"
										component="div"
										className={style.error}
									/>
									<Field name="contactInfo.phoneNumber">
										{({ field }: FieldProps) => (
											<InputMask
												{...field}
												type="text"
												mask="+79999999999"
												placeholder="Телефон"
												className={style.input}
											/>
										)}
									</Field>
								</div>
							</div>
							<div className={style.smallBlock}>
								<h3>2. СПОСОБ ПОЛУЧЕНИЯ</h3>
								{renderTextInput('deliveryAddress', 'city', 'Город')}
								{renderTextInput('deliveryAddress', 'street', 'Улица')}
								{renderTextInput('deliveryAddress', 'house', 'Дом')}
								{renderTextInput('deliveryAddress', 'apartment', 'Квартира')}
								{renderTextInput(
									'deliveryAddress',
									'postalCode',
									'Почтовый индекс',
								)}
							</div>
							<div className={style.smallBlock}>
								<h3>3. ОПЛАТА</h3>
								<span className={style.small}>
									Оплата будет проведена с помощью FanfCoins
								</span>
								<span className={style.small}>
									Ваш счет: {decoratePrice(balance)}
								</span>
								<span className={style.small}>
									Спишется: {decoratePrice(product.price)}
								</span>
							</div>
						</div>

						<div className={style.col}>
							<div className={style.largeBlock}>
								<h2>Ваш заказ</h2>
								<h3 className={style.productTitle}>{product.title}</h3>
								<img
									src={product.logoUrl || noLogo}
									onError={logoFallback}
									alt="no-logo"
								/>
								<div className={style.summaryRow}>
									<span className={style.tiny}>
										{decoratePrice(product.price)} ₽
									</span>
								</div>
								<hr />
								<div className={style.summaryRow}>
									<span>в FanfCoins</span>
									<span className={style.tiny}>
										{decoratePrice(product.price)}
									</span>
								</div>
								<hr />
								<div className={style.summaryRow}>
									<span className={style.large}>Итого</span>
									<span className={style.large}>
										{decoratePrice(product.price)}
									</span>
								</div>
								<hr />
								<footer>
									{error && <div className={style.error}>{error}</div>}

									<button
										type={'submit'}
										disabled={isFetching}
										className={style.createBtn}
									>
										Оформить заказ
									</button>

									<button
										type={'button'}
										className={style.cancelBtn}
										onClick={onCancel}
									>
										Отмена
									</button>
								</footer>
							</div>
						</div>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default OrderCreation;

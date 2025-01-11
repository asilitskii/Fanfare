import React, { MutableRefObject, useMemo, useRef, useState } from 'react';
import style from './ProductCreation.module.scss';
import Logo from '../../assets/header/Logo';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { ErrorMessage, Field, FieldArray, Form, Formik, FormikProps } from 'formik';
import { z } from 'zod';
import { PictureSizesType, Upload } from '../../assets/upload/Upload';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import productCreationFormSchema from '../../formvalidation/ProductCreationFormSchema';
import productCreationSchema from '../../formvalidation/ProductCreationFormSchema';

type ProductCreationFormValues = z.infer<typeof productCreationFormSchema>;

const PRODUCT_LOGO_SIZES: PictureSizesType = {
	minWidth: 128,
	minHeight: 128,
	maxWidth: 4320,
	maxHeight: 7680,
};

type StoreCreationPropsType = {
	storeId: string;
	setLogo: (logo: File) => Promise<unknown>;
	createProduct: (data: ProductCreationFormValues) => Promise<void>;
	uploadProductLogo: () => Promise<void>;
	onCancel: () => void;
};

const ProductCreation: React.FC<StoreCreationPropsType> = ({
	storeId,
	setLogo,
	createProduct,
	uploadProductLogo,
	onCancel,
}) => {
	return (
		<div className={style.wrapper}>
			<Logo />
			<h2>Создание товара</h2>
			<StoreCreationFrom
				storeId={storeId}
				setLogo={setLogo}
				createProduct={createProduct}
				uploadProductLogo={uploadProductLogo}
				onCancel={onCancel}
			/>
		</div>
	);
};

const StoreCreationFrom: React.FC<StoreCreationPropsType> = ({
	storeId,
	setLogo,
	createProduct,
	uploadProductLogo,
	onCancel,
}) => {
	const [isFetching, setIsFetching] = useState(false);
	const navigator = useNavigate();

	const formikRef: MutableRefObject<FormikProps<ProductCreationFormValues> | null> =
		useRef<FormikProps<ProductCreationFormValues> | null>(null);

	const defaultValues = useMemo(
		() => ({
			title: '',
			description: '',
			price: '' as unknown as number,
			characteristics: [] as { name: string; value: string }[],
		}),
		[],
	);

	const renderTextInput = (name: keyof ProductCreationFormValues, placeholder: string) => {
		return (
			<div className={style.inputBox}>
				<ErrorMessage name={name} component="div" className={style.error} />
				<Field name={name} type="text" placeholder={placeholder} className={style.input} />
			</div>
		);
	};

	const renderTextAreaInput = (name: keyof ProductCreationFormValues, placeholder: string) => {
		return (
			<div className={style.inputTextAreaBox}>
				<ErrorMessage name={name} component="div" className={style.error} />
				<Field
					name={name}
					as="textarea"
					placeholder={placeholder}
					className={style.input}
				/>
			</div>
		);
	};

	const renderPriceInput = () => {
		return (
			<div className={style.priceInputBox}>
				<ErrorMessage name="price" component="div" className={style.error} />
				<div className={style.priceWrapper}>
					<Field name="price" type="text" placeholder="Цена" className={style.input} />
					<span>₽</span>
				</div>
			</div>
		);
	};

	return (
		<Formik
			innerRef={(f) => (formikRef.current = f)}
			initialValues={defaultValues}
			onSubmit={async (values) => {
				setIsFetching(true);
				try {
					await createProduct({ ...values, price: Number(values.price) });
				} catch (e) {
					if (e instanceof Error) {
						toast.error(e.message);
						setIsFetching(false);
						return;
					}
				}
				try {
					await uploadProductLogo();
				} catch (e) {
					if (e instanceof Error) {
						toast.error(e.message);
					}
				}
				navigator(`/store/${storeId}`);
			}}
			validationSchema={toFormikValidationSchema(productCreationSchema)}
		>
			{({ values, errors }) => (
				<Form>
					<div className={style.columns}>
						<div>
							{renderTextInput('title', 'Название')}
							{renderPriceInput()}
							{renderTextAreaInput('description', 'Описание')}

							<h3>Изображение товара</h3>
							<Upload
								onUpload={setLogo}
								placeholder="Загрузить изображение товара"
								maxSizeMB={10}
								sizes={PRODUCT_LOGO_SIZES}
							/>
						</div>

						<FieldArray
							name="characteristics"
							render={({ insert, remove }) => (
								<div className={style.characteristicsWrapper}>
									<div className={style.addBtnWrapper}>
										{typeof errors.characteristics === 'string' && (
											<div className={style.error}>
												{errors.characteristics}
											</div>
										)}
										<button
											type="button"
											onClick={() =>
												insert(values.characteristics.length, {
													name: '',
													value: '',
												})
											}
										>
											Добавить характеристику
										</button>
									</div>
									<div className={style.characteristicsGrid}>
										{values.characteristics.map((characteristic, index) => (
											<div className={style.characteristic} key={index}>
												<div className={style.inputBox}>
													<ErrorMessage
														name={`characteristics.${index}.name`}
														component="div"
														className={style.error}
													/>
													<Field
														name={`characteristics.${index}.name`}
														type="text"
														placeholder="Название характеристики"
														className={style.input}
													/>
												</div>
												<div className={style.inputBox}>
													<ErrorMessage
														name={`characteristics.${index}.value`}
														component="div"
														className={style.error}
													/>
													<Field
														name={`characteristics.${index}.value`}
														type="text"
														placeholder="Значение характеристики"
														className={style.input}
													/>
												</div>
												<button
													type="button"
													className={style.removeBtn}
													onClick={() => remove(index)}
												>
													-
												</button>
											</div>
										))}
									</div>
								</div>
							)}
						/>
					</div>

					<footer>
						<button type={'submit'} disabled={isFetching} className={style.createBtn}>
							Добавить товар
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

export default ProductCreation;

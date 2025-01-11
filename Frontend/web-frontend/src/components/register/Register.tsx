import React, { MutableRefObject, useCallback, useMemo, useRef, useState } from 'react';
import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik';
import style from './register.module.scss';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import registerSchema from '../formvalidation/RegisterFormSchema';
import registerFormSchema from '../formvalidation/RegisterFormSchema';
import Logo from '../assets/header/Logo';
import { z } from 'zod';

type FormValues = z.infer<typeof registerFormSchema>;

export type RegisterFormPropsType = {
	onSuccessRegister: () => void;
	registerUser: (
		firstName: string,
		lastName: string,
		email: string,
		birthdate: string,
		password: string,
	) => Promise<void>;
};

type RegisterPropsType = RegisterFormPropsType;

const Register: React.FC<RegisterPropsType> = ({ registerUser, onSuccessRegister }) => {
	return (
		<div className={style.wrapper}>
			<Logo />
			<h2>Регистрация</h2>
			<RegisterForm registerUser={registerUser} onSuccessRegister={onSuccessRegister} />
		</div>
	);
},
	RegisterForm: React.FC<RegisterFormPropsType> = ({ registerUser, onSuccessRegister }) => {
		const [isFetching, setIsFetching] = useState(false);
		const formikRef: MutableRefObject<FormikProps<FormValues> | null> =
			useRef<FormikProps<FormValues> | null>(null);

		const defaultValues = useMemo(
			() => ({
				firstName: '',
				lastName: '',
				email: '',
				birthdate: '',
				password: '',
				passwordConfirmation: '',
				acceptTOS: false,
			}),
			[],
		);

		const renderInput = useCallback(
			(name: keyof FormValues, type: string, placeholder: string) => {
				return (
					<div className={style.inputBox}>
						<div>
							<ErrorMessage name={name} component="div" className={style.error} />
						</div>
						<div>
							<Field
								name={name}
								type={type}
								placeholder={placeholder}
								className={style.input}
							/>
						</div>
					</div>
				);
			},
			[],
		);

		return (
			<Formik
				innerRef={(f) => (formikRef.current = f)}
				initialValues={defaultValues}
				onSubmit={async (values, actions) => {
					actions.resetForm({
						values: defaultValues,
					});
					setIsFetching(true);
					await registerUser(
						values.firstName,
						values.lastName,
						values.email,
						values.birthdate,
						values.password,
					);
					setIsFetching(false);
					onSuccessRegister();
				}}
				validationSchema={toFormikValidationSchema(registerSchema)}
			>
				{() => (
					<Form>
						{renderInput('firstName', 'text', 'Имя')}
						{renderInput('lastName', 'text', 'Фамилия')}
						{renderInput('email', 'email', 'E-mail')}
						{renderInput('birthdate', 'date', 'Дата рождения')}
						{renderInput('password', 'password', 'Пароль')}
						{renderInput('passwordConfirmation', 'password', 'Повторите пароль')}

						<footer>
							<button
								type={'submit'}
								disabled={isFetching || !formikRef.current?.values.acceptTOS}
								className={style.registerBtn}
							>
								Продолжить
							</button>

							<div className={style.checkbox}>
								<div className={style.border}>
									<Field name="acceptTOS" type="checkbox" />
								</div>
								Согласен с условиями пользования площадкой
							</div>
						</footer>
					</Form>
				)}
			</Formik>
		);
	};

export default Register;

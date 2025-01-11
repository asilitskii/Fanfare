import React, { useCallback, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { NavLink } from 'react-router-dom';
import style from './login.module.scss';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import loginSchema from '../formvalidation/LoginFormSchema';
import Logo from '../assets/header/Logo';
import { z } from 'zod';

type FormValues = z.infer<typeof loginSchema>;

type LoginFormPropsType = {
	loginUser: (email: string, password: string) => Promise<void>;
	onSuccessLogin: () => void;
};

type LoginPropsType = {
	registerRedirectLink: string;
	resetPasswordRedirectLink: string;
} & LoginFormPropsType;

const Login: React.FC<LoginPropsType> = ({
	loginUser,
	registerRedirectLink,
	onSuccessLogin,
	resetPasswordRedirectLink,
}) => {
	return (
		<div className={style.wrapper}>
			<Logo />
			<h2>Вход</h2>
			<div className={style.formWrapper}>
				<LoginForm loginUser={loginUser} onSuccessLogin={onSuccessLogin} />
			</div>

			<div className={style.registerBtn}>
				<button>
					<NavLink to={registerRedirectLink}>Зарегистрироваться</NavLink>
				</button>
			</div>

			<div className={style.resetPassword}>
				<NavLink to={resetPasswordRedirectLink}>Забыли пароль?</NavLink>
			</div>
			<footer />
		</div>
	);
};
const LoginForm: React.FC<LoginFormPropsType> = ({ loginUser, onSuccessLogin }) => {
	const [isFetching, setIsFetching] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const renderInput = useCallback((name: keyof FormValues, type: string, placeholder: string) => {
		return (
			<div className={style.inputBox}>
				<div className={style.error}>
					<ErrorMessage name={name} component="div" />
				</div>
				<Field name={name} type={type} placeholder={placeholder} className={style.input} />
			</div>
		);
	}, []);

	return (
		<Formik
			initialValues={{ email: '', password: '' }}
			onSubmit={async (values, actions) => {
				actions.resetForm({
					values: {
						email: values.email,
						password: '',
					},
				});
				setIsFetching(true);
				try {
					await loginUser(values.email, values.password);
					setErrorMsg(null);
					onSuccessLogin();
				} catch (err) {
					const error = err as Error;
					setErrorMsg(error.message);
				}

				setIsFetching(false);
			}}
			validationSchema={toFormikValidationSchema(loginSchema)}
		>
			{() => (
				<Form>
					<div className={style.inputBlock}>
						{renderInput('email', 'email', 'E-mail')}
						{renderInput('password', 'password', 'Пароль')}
					</div>

					<div className={style.serverMsg}>{!errorMsg ? '' : `*${errorMsg}`}</div>

					<div className={style.loginBtn}>
						<button type={'submit'} disabled={isFetching}>
							Войти
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default Login;

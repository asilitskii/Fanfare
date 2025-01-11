import React, { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';
import passwordReset from '../formvalidation/PasswordReset';
import style from './PasswordReset.module.scss';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import Logo from '../assets/header/Logo';

type FormValues = z.infer<typeof passwordReset>;

type PropsType = {
	resetPassword: (newPassword: string) => Promise<void>;
	onSuccessReset: () => void;
};

type FormPropsType = PropsType;

const PasswordReset: React.FC<PropsType> = ({ resetPassword, onSuccessReset }) => {
	return (
		<div className={style.pageWrapper}>
			<div className={style.wrapper}>
				<div className={style.logo}>
					<Logo />
				</div>

				<h2>Сброс пароля</h2>

				<div className={style.formWrapper}>
					<PasswordForm resetPassword={resetPassword} onSuccessReset={onSuccessReset} />
				</div>
			</div>
		</div>
	);
};

const PasswordForm: React.FC<FormPropsType> = ({ resetPassword, onSuccessReset }) => {
	const [isFetching, setIsFetching] = useState(false);
	const initialValues = useMemo(
		() => ({
			newPassword: '',
			passwordConfirmation: '',
		}),
		[],
	);

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
			initialValues={initialValues}
			onSubmit={async (values) => {
				setIsFetching(true);
				try {
					await resetPassword(values.newPassword);
					toast.success('Пароль успешно сброшен');
					onSuccessReset();
				} catch (e) {
					const error = e as Error;
					toast.error(error.message);
				}
				setIsFetching(false);
			}}
			validationSchema={toFormikValidationSchema(passwordReset)}
		>
			{() => (
				<Form>
					<div className={style.inputBlock}>
						{renderInput('newPassword', 'password', 'Новый пароль')}
						{renderInput('passwordConfirmation', 'password', 'Повторите пароль')}
					</div>

					<div className={style.requestBtn}>
						<button type="submit" disabled={isFetching}>
							Сохранить
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default PasswordReset;

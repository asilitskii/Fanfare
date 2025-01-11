import React, { useCallback, useState } from 'react';
import style from './PasswordResetRequest.module.scss';
import Logo from '../assets/header/Logo';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { z } from 'zod';
import passwordResetRequestSchema from '../formvalidation/PasswordResetRequestSchema';
import { toast } from 'react-toastify';

type FormValues = z.infer<typeof passwordResetRequestSchema>;

type PasswordResetFormPropsType = {
	resetPasswordRequest: (email: string) => Promise<void>;
	onSuccessLogin: () => void;
};

type PropsType = PasswordResetFormPropsType;

const PasswordResetRequest: React.FC<PropsType> = ({ resetPasswordRequest, onSuccessLogin }) => {
	return (
		<div className={style.pageWrapper}>
			<div className={style.wrapper}>
				<div className={style.logo}>
					<Logo />
				</div>

				<h2>Сброс пароля</h2>

				<div className={style.formWrapper}>
					<PasswordResetForm
						resetPasswordRequest={resetPasswordRequest}
						onSuccessLogin={onSuccessLogin}
					/>
				</div>
			</div>
		</div>
	);
};

const PasswordResetForm: React.FC<PasswordResetFormPropsType> = ({
	resetPasswordRequest,
	onSuccessLogin,
}) => {
	const [isFetching, setIsFetching] = useState(false);

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
			initialValues={{ email: '' }}
			onSubmit={async (values, actions) => {
				actions.resetForm({
					values: {
						email: values.email,
					},
				});

				setIsFetching(true);

				try {
					await resetPasswordRequest(values.email);
					onSuccessLogin();
				} catch (err) {
					const error = err as Error;
					toast.error(error.message);
				}

				setIsFetching(false);
			}}
			validationSchema={toFormikValidationSchema(passwordResetRequestSchema)}
		>
			{() => (
				<Form>
					<div className={style.inputBlock}>
						{renderInput('email', 'email', 'E-mail')}
					</div>

					<div className={style.requestBtn}>
						<button type={'submit'} disabled={isFetching}>
							Сбросить
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default PasswordResetRequest;

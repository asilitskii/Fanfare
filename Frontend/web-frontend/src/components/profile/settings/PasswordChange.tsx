import React, { useCallback, useMemo, useState } from 'react';
import style from './PasswordChange.module.scss';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import Logo from '../../assets/header/Logo';
import passwordChangeFormSchema from '../../formvalidation/PasswordChangeFormSchema';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

type FormValues = z.infer<typeof passwordChangeFormSchema>;

type PropsType = {
	changePassword: (password: string, newPassword: string) => Promise<string | null>;
};

type FormPropsType = PropsType;

const PasswordChange: React.FC<PropsType> = ({ changePassword }) => {
	return (
		<div className={style.wrapper}>
			<div className={style.logo}>
				<Logo />
			</div>
			<div className={style.header}>Редактирование пароля</div>

			<div className={style.form}>
				<PasswordForm changePassword={changePassword} />
				<footer />
			</div>
		</div>
	);
};

const PasswordForm: React.FC<FormPropsType> = ({ changePassword }) => {
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [isFetching, setIsFetching] = useState(false);
	const navigator = useNavigate();
	const initialValues = useMemo(
		() => ({
			password: '',
			newPassword: '',
			passwordConfirmation: '',
		}),
		[],
	);

	const renderInput = useCallback(
		(name: keyof FormValues, type: string, placeholder: string, blockName: string) => {
			return (
				<div className={style.inputBlock}>
					<div className={style.name}>{blockName}</div>
					<div>
						<Field
							name={name}
							type={type}
							placeholder={placeholder}
							className={style.input}
						/>
					</div>
					<div>
						<ErrorMessage name={name} component="div" className={style.error} />
					</div>
				</div>
			);
		},
		[],
	);

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={async (values) => {
				setIsFetching(true);
				const result = await changePassword(values.password, values.newPassword);
				if (!result) {
					toast.success('Пароль успешно изменен');
					setErrorMsg(null);
					navigator('/profile');
				} else {
					setErrorMsg(result);
				}
				setIsFetching(false);
			}}
			validationSchema={toFormikValidationSchema(passwordChangeFormSchema)}
		>
			{() => (
				<Form>
					<div className={style.dataBlock}>
						{renderInput('password', 'password', '', 'Старый пароль')}
						{renderInput('newPassword', 'password', '', 'Новый пароль')}
						{renderInput('passwordConfirmation', 'password', '', 'Повторите пароль')}
					</div>

					<div className={style.serverError}>{errorMsg ? `*${errorMsg}` : ''}</div>

					<div className={style.submitButton}>
						<button type="submit" disabled={isFetching}>
							Сохранить
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default PasswordChange;

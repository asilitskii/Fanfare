import React, { useCallback, useMemo, useState } from 'react';
import style from './ProfileSettings.module.scss';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import changeDataFormSchema from '../../formvalidation/ChangeDataFormSchema';
import Modal from '../../assets/modal/Modal';
import PasswordChangeContainer from './PasswordChangeContainer';
import LogoutContainer from '../logout/LogoutContainer';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

type FormValues = z.infer<typeof changeDataFormSchema>;

type PropsType = {
	createdAt: string;
	email: string;
} & FormPropsType;

type FormPropsType = {
	firstName: string;
	lastName: string;
	birthdate: string;
	changeData: (firstName: string, lastName: string, birthdate: string) => Promise<string | null>;
};

const ProfileSettings: React.FC<PropsType> = ({
	createdAt,
	email,
	firstName,
	lastName,
	birthdate,
	changeData,
}) => {
	const [logoutModalActive, setLogoutModalActive] = useState(false);
	const [passwordChangeModalActive, setPasswordChangeModalActive] = useState(false);

	const stripTime = (date: string) => {
		const delimiterPos = date.indexOf('T');
		if (delimiterPos < 0) {
			return date;
		}
		return date.substring(0, delimiterPos);
	};

	const onLogoutModalClick = (): void => {
		setLogoutModalActive(true);
	};

	const onPasswordChangeModalClick = () => {
		setPasswordChangeModalActive(true);
	};

	const onCancelClick = () => {
		setLogoutModalActive(false);
	};

	return (
		<div className={style.wrapper}>
			<div className={style.header}>Настройки профиля</div>
			<div className={style.content}>
				<div className={style.formWrapper}>
					<div
						className={style.registrationDate}
					>{`Дата регистрации: ${stripTime(createdAt)}`}</div>
					<div className={style.email}>
						<span className={style.emailSpan}>E-mail: </span>
						<span>{email}</span>
					</div>
					<div className={style.form}>
						<DataForm
							firstName={firstName}
							lastName={lastName}
							birthdate={birthdate}
							changeData={changeData}
						/>
					</div>

					<div className={style.formFooter}>
						<button
							className={style.passwordChangeButton}
							onClick={onPasswordChangeModalClick}
						>
							Изменить пароль
						</button>
						<button className={style.logoutButton} onClick={onLogoutModalClick}>
							Выйти из аккаунта
						</button>
					</div>

					<footer />

					<Modal active={logoutModalActive} setActive={setLogoutModalActive}>
						<LogoutContainer onCancelClick={onCancelClick} />
					</Modal>

					<Modal
						active={passwordChangeModalActive}
						setActive={setPasswordChangeModalActive}
					>
						<PasswordChangeContainer />
					</Modal>
				</div>
			</div>
		</div>
	);
};

const DataForm: React.FC<FormPropsType> = ({ firstName, lastName, birthdate, changeData }) => {
	const [isFetching, setIsFetching] = useState(false);
	const navigator = useNavigate();

	const initialValues = useMemo(
		() => ({
			firstName: firstName,
			lastName: lastName,
			birthdate: birthdate,
		}),
		[birthdate, firstName, lastName],
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
				const msg = await changeData(values.firstName, values.lastName, values.birthdate);
				if (!msg) {
					toast.success('Данные успешно изменены');
					navigator('/profile');
				} else {
					toast.error(msg);
				}
				setIsFetching(false);
			}}
			validationSchema={toFormikValidationSchema(changeDataFormSchema)}
		>
			{() => (
				<Form>
					<div className={style.dataBlock}>
						{renderInput('firstName', 'text', '', 'Имя')}
						{renderInput('birthdate', 'date', 'дд.мм.гггг', 'Дата рождения')}
						{renderInput('lastName', 'text', '', 'Фамилия')}
					</div>

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

export default ProfileSettings;

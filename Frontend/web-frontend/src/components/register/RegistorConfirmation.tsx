import React from 'react';
import style from './register.module.scss';
import Logo from '../assets/header/Logo';

const RegisterConfirmation: React.FC = () => {
	return (
		<div className={style.confirmPage}>
			<Logo />

			<p>
				Проверьте вашу почту для подтверждения аккаунта. Если в течение продолжительного
				времени письмо не придёт, восстановите пароль.
			</p>
		</div>
	);
};

export default RegisterConfirmation;

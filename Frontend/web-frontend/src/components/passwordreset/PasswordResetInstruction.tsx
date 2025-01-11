import React from 'react';
import style from './PasswordResetInstruction.module.scss';
import Logo from '../assets/header/Logo';

const PasswordResetInstruction: React.FC = () => {
	return (
		<div className={style.wrapper}>
			<div className={style.logo}>
				<Logo />
			</div>
			<div className={style.text}>
				Проверьте вашу почту для сброса пароля. Если в течение продолжительного времени
				письмо не придёт, попробуйте еще раз, либо аккаунт с такой почтой не существует.
			</div>
		</div>
	);
};

export default PasswordResetInstruction;

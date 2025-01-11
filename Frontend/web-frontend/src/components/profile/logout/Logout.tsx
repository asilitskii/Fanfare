import React from 'react';
import style from './Logout.module.scss';
import Logo from '../../assets/header/Logo';

type PropsType = {
	onLogoutClick: () => void;
	onCancelClick: () => void;
};

const Logout: React.FC<PropsType> = ({ onLogoutClick, onCancelClick }) => {
	return (
		<div className={style.wrapper}>
			<div className={style.logo}>
				<Logo />
			</div>
			<div className={style.text}>Вы уверенны, что хотите выйти?</div>

			<div className={style.buttonsWrapper}>
				<div className={style.confirm}>
					<button onClick={onLogoutClick}>Выйти</button>
				</div>
				<div className={style.reject}>
					<button onClick={onCancelClick}>Отмена</button>
				</div>
			</div>
		</div>
	);
};

export default Logout;

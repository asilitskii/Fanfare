import React, { FC } from 'react';
import style from '../MainHeader.module.scss';
import person_circle from '../../../assets/profile.svg';

type PropsType = {
	isAuth: boolean;
	onProfileClick: () => void;
	onLoginClick: () => void;
};

const LoginOrProfile: FC<PropsType> = ({ isAuth, onLoginClick, onProfileClick }) => {
	return (
		<div className={style.profileButton} onClick={isAuth ? onProfileClick : onLoginClick}>
			<img src={person_circle} alt="profile" />
			<div>{isAuth ? 'Профиль' : 'Войти'}</div>
		</div>
	);
};

export default LoginOrProfile;

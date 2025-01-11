import React from 'react';
import style from './ProductPageHeader.module.scss';
import personCircle from '../../assets/profile.svg';
import { useNavigate } from 'react-router-dom';
import { logoFallback } from '../../utils/utils';

type PropsType = {
	isAuth: boolean;
	logoUrl: string;
	onLogoClick: () => void;
};

type CardPropsType = {
	text: string;
	logoUrl: string;
	onClick?: () => void;
};

const Card: React.FC<CardPropsType> = ({ text, logoUrl, onClick }) => {
	return (
		<div className={style.item} onClick={onClick}>
			<div className={style.picture}>
				<img src={logoUrl} onError={logoFallback} alt={'logo'} />
			</div>
			<div className={style.text}>{text}</div>
		</div>
	);
};

const ProductPageHeader: React.FC<PropsType> = ({ isAuth, logoUrl, onLogoClick }) => {
	const navigator = useNavigate();

	const handleNavigateProfile = () => {
		navigator('/profile');
	};

	const handleNavigateLogin = () => {
		navigator('/login');
	};

	return (
		<div className={style.wrapper}>
			<div className={style.logo}>
				<img src={logoUrl} onError={logoFallback} alt="Store_logo" onClick={onLogoClick} />
			</div>

			<div className={style.menuBlock}>
				{isAuth ? (
					<Card text={'Профиль'} logoUrl={personCircle} onClick={handleNavigateProfile} />
				) : (
					<Card text={'Войти'} logoUrl={personCircle} onClick={handleNavigateLogin} />
				)}
			</div>
		</div>
	);
};

export default ProductPageHeader;

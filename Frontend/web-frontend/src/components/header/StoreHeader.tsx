import React from 'react';
import style from './StoreHeader.module.scss';
import personCircle from '../../assets/profile.svg';
import userInvoice from '../../assets/user-invoice.svg';
import { logoFallback } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';

type PropsType = {
	isAuth: boolean;
	logoUrl: string;
	onInvoiceClick: () => void;
};

const StoreHeader: React.FC<PropsType> = ({ isAuth, logoUrl, onInvoiceClick }) => {
	const navigate = useNavigate();
	const onProfileClick = () => {
		if (isAuth) {
			navigate('/profile');
		} else {
			navigate('/login');
		}
	};

	return (
		<div className={style.wrapper}>
			<div className={style.logo}>
				<img src={logoUrl} onError={logoFallback} alt="store_logo" />
			</div>

			<div className={style.menuBlock}>
				{isAuth ? (
					<Card text={'Профиль'} logoUrl={personCircle} onClick={onProfileClick} />
				) : (
					<Card text={'Войти'} logoUrl={personCircle} onClick={onProfileClick} />
				)}
				<Card text={'Мой счёт'} logoUrl={userInvoice} onClick={onInvoiceClick} />
			</div>
		</div>
	);
};

export default StoreHeader;

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

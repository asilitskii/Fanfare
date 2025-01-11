import React from 'react';
import style from './SellerCard.module.scss';
import storeLogo from '../../../../../assets/store.svg';
import ordersLogo from '../../../../../assets/order-completed.svg';
import { logoFallback } from '../../../../../utils/utils';

type PropsType = {
	onViewOrdersClick: () => void;
	onStoreClick: () => void;
};

const SellerCard: React.FC<PropsType> = ({ onViewOrdersClick, onStoreClick }) => {
	return (
		<div className={style.wrapper}>
			<div className={style.element} onClick={onStoreClick}>
				<div className={style.text}>Мой магазин</div>
				<div className={style.image}>
					<img src={storeLogo} onError={logoFallback} alt={'store_logo'} />
				</div>
			</div>
			<div className={style.element} onClick={onViewOrdersClick}>
				<div className={style.text}>Заказы покупателей</div>
				<div className={style.image}>
					<img src={ordersLogo} onError={logoFallback} alt={'orders_logo'} />
				</div>
			</div>
		</div>
	);
};

export default SellerCard;

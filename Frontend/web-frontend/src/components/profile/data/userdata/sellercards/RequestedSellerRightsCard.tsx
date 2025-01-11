import React from 'react';
import style from './RequestedSellerRightsCard.module.scss';
import picture from '../../../../../assets/exclamation-mark-in-a-circle.svg';

const RequestedSellerRightsCard: React.FC = () => {
	return (
		<div className={style.wrapper}>
			<div className={style.inscriptionBlock}>
				<div>Вы запросили статус продавца.</div>
				<div>Заявка будет рассмотрена в ближайшее время.</div>
			</div>
			<div className={style.imgBlock}>
				<img src={picture} alt={'seller_request_logo'} />
			</div>
		</div>
	);
};

export default RequestedSellerRightsCard;

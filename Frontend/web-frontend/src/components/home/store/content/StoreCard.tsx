import React from 'react';
import style from './StoreCard.module.scss';
import noLogo from '../../../../assets/no-logo.svg';
import { logoFallback } from '../../../../utils/utils';

interface StoreCardProps {
	name: string;
	logoUrl?: string;
	onClick?: () => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ name, logoUrl, onClick }) => {
	return (
		<div className={style.storeCard} onClick={onClick}>
			<div className={style.storeImage}>
				<img src={logoUrl || noLogo} onError={logoFallback} alt={name} />
			</div>
			<div className={style.storeName}>{name}</div>
		</div>
	);
};

export default StoreCard;

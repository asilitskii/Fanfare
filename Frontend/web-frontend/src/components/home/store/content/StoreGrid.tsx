import React from 'react';
import StoreCard from './StoreCard';
import style from './StoreGrid.module.scss';
import type { StoreType } from '../Store';
import { useNavigate } from 'react-router-dom';

type StoreGridPropsType = {
	stores: StoreType[];
};

const StoreGrid: React.FC<StoreGridPropsType> = ({ stores }) => {
	const navigate = useNavigate();

	const onStoreClick = (storeId: string) => {
		navigate('/store/' + storeId);
	};

	return (
		<div className={style.storeGrid}>
			{stores.map((store) => (
				<StoreCard
					key={store.id}
					name={store.name}
					logoUrl={store.logoUrl}
					onClick={() => onStoreClick(store.id)}
				/>
			))}
		</div>
	);
};

export default StoreGrid;

import React, { useEffect } from 'react';
import Store from './Store';
import { useHomeStorage } from '../../../zustand/HomeStorage';
import Preloader from '../../assets/preloader/Preloader';
import { toast } from 'react-toastify';
import style from './Store.module.scss';

const StoreContainer: React.FC = () => {
	const { filteredStores, isLoading, error, searchQuery, fetchStores, setSearchQuery } =
		useHomeStorage();

	useEffect(() => {
		fetchStores();
	}, [fetchStores]);

	useEffect(() => {
		if (!isLoading && searchQuery) {
			setSearchQuery(searchQuery);
		}
	}, [isLoading, searchQuery, setSearchQuery]);

	if (isLoading) {
		return (
			<div className={style.preloader}>
				<Preloader />
			</div>
		);
	}

	if (error) {
		toast.error(error);
		return <></>;
	}

	return <Store stores={filteredStores} />;
};

export default StoreContainer;

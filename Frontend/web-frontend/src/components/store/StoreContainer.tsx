import React, { useEffect } from 'react';
import Store from './Store';
import style from './Store.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { SHOP_NOT_FOUND_ERROR_MSG, useStoreStorage } from '../../zustand/StoreStorage';
import Preloader from '../assets/preloader/Preloader';
import { toast } from 'react-toastify';
import { useUserStorage } from '../../zustand/UserStorage';

const StoreContainer: React.FC = () => {
	const { storeId } = useParams() as { storeId: string };
	const {
		loadProducts,
		products,
		tgIsSubscribed,
		tgSubscribe,
		shopData,
		isOwner,
		getOwnerInfo,
		tgUnsubscribe,
	} = useStoreStorage();
	const { userData, loadUserDataNoRedirect } = useUserStorage();
	const navigate = useNavigate();

	const loadFunction = async () => {
		if (!userData) {
			await loadUserDataNoRedirect();
		}

		try {
			await loadProducts(storeId);
			await getOwnerInfo(storeId);
		} catch (e) {
			const error = e as Error;
			if (!error.message) {
				navigate('/404');
			} else {
				toast.error(error.message);
			}
		}
	};

	useEffect(() => {
		loadFunction().then();
	}, [storeId, loadProducts, navigate]);

	if (!products || isOwner == null) {
		return (
			<div className={style.preloader}>
				<Preloader />
			</div>
		);
	}

	if (!shopData) {
		navigate('/404');
		return <></>;
	}

	const onTgSubscribeClick = async () => {
		if (userData?.tgId) {
			try {
				await tgSubscribe(storeId, userData.tgId);
			} catch (e) {
				const error = e as Error;
				if (error.message === SHOP_NOT_FOUND_ERROR_MSG) {
					toast.error('Данный магазин не принимает подписки');
					return;
				}
				toast.error(error.message);
				return;
			}
		} else {
			toast.error('Вы не авторизованы в telegram');
		}
	};

	const onTgUnsubscribe = async () => {
		if (!userData?.tgId) {
			toast.error('Вы не авторизованы в telegram');
			return;
		}

		try {
			await tgUnsubscribe(storeId);
		} catch (e) {
			const error = e as Error;
			if (error.message === SHOP_NOT_FOUND_ERROR_MSG) {
				toast.error('Данный магазин не принимает подписки');
				return;
			}
			toast.error(error.message);
		}
	};

	const onAddProductClick = () => {
		navigate(`/item/new`);
	};

	return (
		<Store
			products={products}
			onAddProductClick={onAddProductClick}
			tgSubscribe={onTgSubscribeClick}
			tgIsSubscribed={tgIsSubscribed}
			shopData={shopData}
			isSeller={isOwner}
			tgUnsubscribe={onTgUnsubscribe}
		/>
	);
};

export default StoreContainer;

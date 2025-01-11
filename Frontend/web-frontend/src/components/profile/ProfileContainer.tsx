import React, { useEffect, useState } from 'react';
import Profile from './Profile';
import { OrderInfoType, useUserStorage } from '../../zustand/UserStorage';
import Preloader from '../assets/preloader/Preloader';
import style from './Profile.module.scss';
import { useNavigate } from 'react-router-dom';
import { SocNetworkType } from './data/userdata/UserData';
import { UserCardDataType } from './data/userdata/cards/UserCard';
import { SellerRequestStatus } from '../../api/UserApi';
import noLogo from '../../assets/no-logo.svg';

const ProfileContainer: React.FC = () => {
	const {
		setUserData,
		userData,
		telegramLogin,
		telegramLogout,
		vkLogin,
		vkLogout,
		requestSellerRights,
		loadUserData,
		fetchStores,
		userStores,
		fetchArchiveOrders,
		fetchActiveOrders,
		fetchStoreInfo,
		setUserArchiveOrders,
		setUserActiveOrders,
		userArchiveOrders,
		userActiveOrders,
	} = useUserStorage();

	const navigator = useNavigate();
	const [isFetching, setIsFetching] = useState(true);

	const fetchFunc = async () => {
		if (!userData) {
			const response = await loadUserData();
			if (!response) {
				return; // 404
			}
			if (response.isSeller) {
				await fetchStores();
			}
		} else {
			if (userData.isSeller) {
				await fetchStores();
			}
		}

		const activeOrders = await fetchActiveOrders();
		if (!activeOrders) {
			return; // 500 || 422
		}
		const archiveOrders = await fetchArchiveOrders();
		if (!archiveOrders) {
			return; // 500 || 422
		}

		const activeOrdersWithStoreInfo: Array<OrderInfoType> = activeOrders.orders.map(
			(order) => ({ orderDetails: order, storeName: '' }),
		);

		const archiveOrdersWithStoreInfo: Array<OrderInfoType> = archiveOrders.orders.map(
			(order) => ({ orderDetails: order, storeName: '' }),
		);

		let isFailed = false;

		for (const value of activeOrdersWithStoreInfo) {
			const response = await fetchStoreInfo(value.orderDetails.storeId);
			if (!response) {
				isFailed = true;
				return;
			}

			value.storeName = response.title;
			value.logoUrl = response.logoUrl ?? noLogo;
		}

		for (const value of archiveOrdersWithStoreInfo) {
			const response = await fetchStoreInfo(value.orderDetails.storeId);
			if (!response) {
				isFailed = true;
				return;
			}

			value.storeName = response.title;
			value.logoUrl = response.logoUrl ?? noLogo;
		}

		if (isFailed) {
			return;
		}

		setUserArchiveOrders(archiveOrdersWithStoreInfo);
		setUserActiveOrders(activeOrdersWithStoreInfo);
	};

	useEffect(() => {
		fetchFunc().then(() => setIsFetching(false));
	}, [setUserData, fetchStores]);

	if (!userData || isFetching) {
		return (
			<div className={style.preloader}>
				<Preloader />
			</div>
		);
	}

	const onStoreClick = () => {
		if (!userData.isSeller || !userStores) {
			return;
		}
		if (userStores?.length === 0) {
			navigator('/store/new');
			return;
		}
		const store = userStores[userStores.length - 1];
		navigator(`/store/${store.storeId}`);
	};

	const onEditProfileClick = () => {
		navigator('/profile/settings');
	};

	const tgData: SocNetworkType = {
		id: userData.tgId,
		login: telegramLogin,
		logout: telegramLogout,
	};

	const vkData: SocNetworkType = {
		id: userData.vkId,
		login: vkLogin,
		logout: vkLogout,
	};

	const userDataCard: UserCardDataType = {
		firstName: userData.firstName,
		lastName: userData.lastName,
		email: userData.email,
	};

	const onViewOrdersClick = () => {
		navigator('/order/all');
	};

	return (
		<Profile
			userData={userDataCard}
			isSeller={userData.isSeller}
			requestedSeller={userData.sellerRequestStatus === SellerRequestStatus.Requested}
			requestSellerRights={requestSellerRights}
			onEditProfileClick={onEditProfileClick}
			tgData={tgData}
			vkData={vkData}
			onViewOrdersClick={onViewOrdersClick}
			onStoreClick={onStoreClick}
			userArchiveOrders={userArchiveOrders ?? []}
			userActiveOrders={userActiveOrders ?? []}
		/>
	);
};

export default ProfileContainer;

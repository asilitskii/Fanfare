import React from 'react';
import style from './Profile.module.scss';
import UserData, { SocNetworkType } from './data/userdata/UserData';
import OrderCard from './data/order/OrderCard';
import { UserCardDataType } from './data/userdata/cards/UserCard';
import { OrderInfoType } from '../../zustand/UserStorage';
import noLogo from '../../assets/no-logo.svg';

type PropsType = {
	userData: UserCardDataType;
	requestedSeller: boolean;
	isSeller: boolean;
	onEditProfileClick: () => void;
	requestSellerRights: (text: string) => Promise<void>;
	tgData: SocNetworkType;
	vkData: SocNetworkType;
	onViewOrdersClick: () => void;
	onStoreClick: () => void;
	userActiveOrders: Array<OrderInfoType>;
	userArchiveOrders: Array<OrderInfoType>;
};

const Profile: React.FC<PropsType> = ({
	userData,
	isSeller,
	requestedSeller,
	requestSellerRights,
	onEditProfileClick,
	tgData,
	vkData,
	onViewOrdersClick,
	onStoreClick,
	userArchiveOrders,
	userActiveOrders,
}) => {
	return (
		<div className={style.wrapper}>
			<div className={style.content}>
				<UserData
					vkData={vkData}
					telegramData={tgData}
					isSeller={isSeller}
					requestedSeller={requestedSeller}
					requestSellerRights={requestSellerRights}
					onEditProfileClick={onEditProfileClick}
					userData={userData}
					onViewOrdersClick={onViewOrdersClick}
					onStoreClick={onStoreClick}
				/>
				<div className={style.ordersHeader}>Заказы</div>

				{userActiveOrders.length > 0 && (
					<div className={style.activeOrdersHeader}>Активные</div>
				)}

				{userActiveOrders.map((order, id) => (
					<div className={style.cardWrapper} key={id}>
						<OrderCard
							orderNumber={order.orderDetails.orderId}
							date={order.orderDetails.orderCreationTimestamp}
							shopLogo={order.logoUrl ?? noLogo}
							shopName={order.storeName}
							status={order.orderDetails.status}
							price={order.orderDetails.totalPrice}
							products={order.orderDetails.products}
							gotDate={null}
							shopId={order.orderDetails.storeId}
						/>
					</div>
				))}

				{userArchiveOrders.length > 0 && (
					<div className={style.activeOrdersHeader}>Архив</div>
				)}

				{userArchiveOrders.map((order, id) => (
					<div className={style.cardWrapper} key={id}>
						<OrderCard
							orderNumber={order.orderDetails.orderId}
							date={order.orderDetails.orderCreationTimestamp}
							shopLogo={order.logoUrl ?? noLogo}
							shopName={order.storeName}
							status={order.orderDetails.status}
							price={order.orderDetails.totalPrice}
							products={order.orderDetails.products}
							gotDate={order.orderDetails.orderReceptionTimestamp}
							shopId={order.orderDetails.storeId}
						/>
					</div>
				))}

				<footer></footer>
			</div>
		</div>
	);
};

export default Profile;

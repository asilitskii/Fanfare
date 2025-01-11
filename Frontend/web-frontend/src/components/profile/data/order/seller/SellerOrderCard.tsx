import React from 'react';
import style from './SellerOrderCard.module.scss';
import { OrderInfoModel } from '../../../../../api/OrderApi';
import noLogo from '../../../../../assets/no-logo.svg';
import { logoFallback, translateOrderStatus } from '../../../../../utils/utils';

type PropsType = Omit<
	OrderInfoModel,
	keyof { storeId: string; orderReceptionTimestamp: string | null }
> & {
	onOrderClick: (orderId: string) => void;
};

const SellerOrderCard: React.FC<PropsType> = ({
	contactInfo,
	deliveryAddress,
	orderId,
	orderCreationTimestamp,
	products,
	totalPrice,
	status,
	onOrderClick,
}) => {
	return (
		<div className={style.wrapper} onClick={() => onOrderClick(orderId)}>
			<div className={style.header}>
				<div className={style.orderHeaderDataBlock}>
					<div className={style.orderNumber}>{`Заказ ${orderId}`}</div>
					<div
						className={style.date}
					>{`От ${new Date(orderCreationTimestamp).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}`}</div>
				</div>
				<div className={style.status}>Статус: {translateOrderStatus(status)}</div>
			</div>
			<div className={style.orderDataMainWrapper}>
				<div className={style.orderDataWrapper}>
					<div>
						<div className={style.receiverData}>
							<b>
								{`${contactInfo.lastFirstName}, 
								${contactInfo.phoneNumber}, 
								${deliveryAddress.city}, 
								ул. ${deliveryAddress.street}
								${deliveryAddress.house}`}
							</b>
						</div>
					</div>

					<div className={style.price}>{`${totalPrice} ₽`}</div>
				</div>
				<div className={style.products}>
					{products.map((product, id) => (
						<img
							src={product.logoUrl || noLogo}
							onError={logoFallback}
							alt={'product'}
							key={id}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default SellerOrderCard;

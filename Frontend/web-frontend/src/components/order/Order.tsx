import React from 'react';
import ProductGrid from './product/ProductGrid';
import style from './Order.module.scss';
import LoginOrProfile from '../header/templates/LoginOrProfile';
import MainHeaderContainer from '../header/MainHeaderContainer';
import { SingleOrderInfoModel } from '../../api/OrderApi';

interface OrderProps {
	order: SingleOrderInfoModel;
	storeName: string;
	isAuth: boolean;
	onProfileClick: () => void;
	onLoginClick: () => void;
	onCancelOrder: () => void;
	onProceedOrder: () => void;
}

const Order: React.FC<OrderProps> = ({
	order,
	storeName,
	isAuth,
	onProfileClick,
	onLoginClick,
	onCancelOrder,
	onProceedOrder,
}) => {
	const headerContent = (
		<LoginOrProfile
			isAuth={isAuth}
			onProfileClick={onProfileClick}
			onLoginClick={onLoginClick}
		/>
	);

	const formatDate = (dateString: string) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
		return new Date(dateString).toLocaleDateString('ru-RU', options).replace(' г.', '');
	};

	const statusMap: Record<string, string> = {
		created: 'создан',
		assembly: 'в сборке',
		on_the_way: 'в пути',
		awaiting_receipt: 'доставлен',
		received: 'получен',
		canceled: 'отменён',
	};

	return (
		<>
			<header>
				<MainHeaderContainer content={headerContent} />
			</header>
			<div className={style.wrapper}>
				{!order.isSeller && (
					<>
						<h2>{storeName}</h2>
						{['created', 'assembly'].includes(order.status) && (
							<button onClick={onCancelOrder}>Отменить заказ</button>
						)}
						{['on_the_way', 'awaiting_receipt'].includes(order.status) && (
							<button onClick={onProceedOrder}>Я получил заказ</button>
						)}
						<h3>Заказ от {formatDate(order.orderCreationTimestamp)}:</h3>
						<div className={style.orderInfo}>
							<p>
								<span>Номер заказа: {order.orderId}</span>
							</p>
							<div className={`${style.bigOrderText} ${style.firstBlock}`}>
								<p>
									Статус: <b>{statusMap[order.status]}</b>
								</p>
								<p>
									Общая стоимость: <b>{order.totalPrice} ₽</b>
								</p>
							</div>
							<p>{`${order.contactInfo.lastFirstName} ${order.contactInfo.phoneNumber}`}</p>
							<p>{`${order.deliveryAddress.city}, ул. ${order.deliveryAddress.street} ${order.deliveryAddress.house}, 
							Кв. ${order.deliveryAddress.apartment || '-'}, Почтовый индекс: ${order.deliveryAddress.postalCode}`}</p>
						</div>
					</>
				)}

				{order.isSeller && (
					<>
						{order.status === 'created' && (
							<>
								<button onClick={onProceedOrder}>В сборку</button>
								<button onClick={onCancelOrder}>Отменить заказ</button>
							</>
						)}
						{order.status === 'assembly' && (
							<>
								<button onClick={onProceedOrder}>Отправить</button>
								<button onClick={onCancelOrder}>Отменить заказ</button>
							</>
						)}
						{order.status === 'on_the_way' && (
							<>
								<button onClick={onProceedOrder}>Известить о доставке</button>
								<button onClick={onCancelOrder}>Отменить заказ</button>
							</>
						)}
						{order.status === 'awaiting_receipt' && (
							<>
								<button onClick={onCancelOrder}>Отменить заказ</button>
							</>
						)}
						<h3>Заказ от {formatDate(order.orderCreationTimestamp)}:</h3>
						<div className={style.orderInfo}>
							<p>
								<span>Номер заказа: {order.orderId}</span>
							</p>
							<div className={style.firstBlock}>
								<p>{`${order.contactInfo.lastFirstName} ${order.contactInfo.phoneNumber}`}</p>
								<p>{`${order.deliveryAddress.city}, ул. ${order.deliveryAddress.street} ${order.deliveryAddress.house}, 
							Кв. ${order.deliveryAddress.apartment || '-'}, Почтовый индекс: ${order.deliveryAddress.postalCode}`}</p>
							</div>
							<div className={style.orderText}>
								<p>
									Статус: <b>{statusMap[order.status]}</b>
								</p>
								<p>
									Общая стоимость: <b>{order.totalPrice} ₽</b>
								</p>
							</div>
						</div>
					</>
				)}

				<h3>Товары:</h3>
				<ProductGrid products={order.products} />
			</div>
		</>
	);
};

export default Order;

import OrderList from './OrderList';
import { useOrderStorage } from '../../../../../../zustand/OrderStorage';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { OrderInfoModel } from '../../../../../../api/OrderApi';
import { useNavigate } from 'react-router-dom';
import style from '../../../../Profile.module.scss';
import Preloader from '../../../../../assets/preloader/Preloader';

const OrderListContainer: React.FC = () => {
	const { loadOrders } = useOrderStorage();
	const [activeOrders, setActiveOrders] = useState<OrderInfoModel[] | null>(null);
	const [archivedOrders, setArchivedOrders] = useState<OrderInfoModel[] | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		loadOrders()
			.then((data) => {
				setActiveOrders(data.activeOrders);
				setArchivedOrders(data.archivedOrders);
			})
			.catch((error) => {
				if (error instanceof Error) {
					toast.error(error.message);
					navigate('/profile');
				}
			});
	}, [loadOrders, navigate]);

	const handleOrderClick = (orderId: string) => {
		navigate(`/order/${orderId}`);
	};

	if (!activeOrders || !archivedOrders) {
		return (
			<div className={style.preloader}>
				<Preloader />
			</div>
		);
	}

	return (
		<OrderList
			activeOrders={activeOrders}
			archivedOrders={archivedOrders}
			onOrderClick={handleOrderClick}
		/>
	);
};

export default OrderListContainer;

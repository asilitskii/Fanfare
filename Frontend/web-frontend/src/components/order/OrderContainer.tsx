import React, { useEffect, useState } from 'react';
import { useOrderStorage } from '../../zustand/OrderStorage';
import { useNavigate, useParams } from 'react-router-dom';
import { ACCESS_TOKEN, DEFAULT_ERROR_MESSAGE, REFRESH_TOKEN } from '../../api/API';
import { toast } from 'react-toastify';
import style from './Order.module.scss';
import Preloader from '../assets/preloader/Preloader';
import Order from './Order';
import CancelOrder from './cancel/CancelOrder';
import Modal from '../assets/modal/Modal';

const OrderContainer: React.FC = () => {
	const isAuth =
		localStorage.getItem(ACCESS_TOKEN) != null && localStorage.getItem(REFRESH_TOKEN) != null;
	const { order, storeTitle, isLoading, fetchOrder, cancelOrder, proceedOrder } =
		useOrderStorage();
	const [isModalOpen, setModalOpen] = useState(false);
	const { orderId } = useParams<{ orderId: string }>();
	const navigator = useNavigate();

	useEffect(() => {
		if (orderId) {
			fetchOrder(orderId)
				.then()
				.catch((error) => {
					if (error instanceof Error) {
						toast.error(error.message);
						if (error.message !== DEFAULT_ERROR_MESSAGE) {
							navigator('/404');
						}
					}
				});
		}
	}, [orderId, fetchOrder]);

	const handleNavigateToProfile = () => navigator('/profile');
	const handleNavigateToLogin = () => navigator('/login');

	const handleCancelOrder = () => setModalOpen(true);
	const handleCloseModal = () => setModalOpen(false);
	const handleConfirmCancel = () => {
		cancelOrder();
		setModalOpen(false);
	};

	if (isLoading) {
		return (
			<div className={style.preloader}>
				<Preloader />
			</div>
		);
	}

	if (!order) {
		return <></>;
	}

	return (
		<>
			<Order
				order={order}
				storeName={storeTitle}
				isAuth={isAuth}
				onProfileClick={handleNavigateToProfile}
				onLoginClick={handleNavigateToLogin}
				onCancelOrder={handleCancelOrder}
				onProceedOrder={proceedOrder}
			/>
			<Modal active={isModalOpen} setActive={setModalOpen}>
				<CancelOrder onClose={handleCloseModal} onConfirm={handleConfirmCancel} />
			</Modal>
		</>
	);
};

export default OrderContainer;

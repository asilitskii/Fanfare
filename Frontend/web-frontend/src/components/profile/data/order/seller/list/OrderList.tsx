import style from './OrderList.module.scss';
import React, { useState } from 'react';
import { OrderInfoModel } from '../../../../../../api/OrderApi';
import SellerOrderCard from '../SellerOrderCard';

type TabType = 'active' | 'archived';

type PropsType = {
	activeOrders: OrderInfoModel[];
	archivedOrders: OrderInfoModel[];
	onOrderClick: (orderId: string) => void;
};

const OrderList: React.FC<PropsType> = ({ activeOrders, archivedOrders, onOrderClick }) => {
	const [activeTab, setActiveTab] = useState<TabType>('active');

	const handleTabChange = (tab: TabType) => {
		setActiveTab(tab);
	};

	return (
		<div className={style.wrapper}>
			<div className={style.content}>
				<h1>Заказы</h1>

				<div className={style.tabs}>
					<button
						onClick={() => handleTabChange('active')}
						disabled={activeTab === 'active'}
					>
						Активные
					</button>
					<button
						onClick={() => handleTabChange('archived')}
						disabled={activeTab === 'archived'}
					>
						Архивные
					</button>
				</div>

				{activeTab === 'active' && (
					<>
						{activeOrders.length === 0 && (
							<div className={style.placeholder}>Нет активных заказов</div>
						)}

						{activeOrders.map((order, id) => (
							<div className={style.cardWrapper} key={id}>
								<SellerOrderCard {...order} onOrderClick={onOrderClick} />
							</div>
						))}
					</>
				)}

				{activeTab === 'archived' && (
					<>
						{archivedOrders.length === 0 && (
							<div className={style.placeholder}>Нет архивных заказов</div>
						)}

						{archivedOrders.map((order, id) => (
							<div className={style.cardWrapper} key={id}>
								<SellerOrderCard {...order} onOrderClick={onOrderClick} />
							</div>
						))}
					</>
				)}
			</div>
		</div>
	);
};

export default OrderList;

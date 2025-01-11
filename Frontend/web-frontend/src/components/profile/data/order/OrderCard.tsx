import React from 'react';
import style from './OrderCard.module.scss';
import { logoFallback } from '../../../../utils/utils';
import { OrderStatus, ProductModel } from '../../../../api/OrderApi';
import noLogo from '../../../../assets/no-logo.svg';
import { useNavigate } from 'react-router-dom';

type PropsType = {
	orderNumber: string;
	date: string;
	shopLogo: string;
	shopName: string;
	status: OrderStatus;
	gotDate: string | null;
	price: number;
	products: Array<ProductModel>;
	shopId: string;
};

const OrderCard: React.FC<PropsType> = ({
	orderNumber,
	date,
	shopLogo,
	shopName,
	status,
	gotDate,
	price,
	products,
	shopId,
}) => {
	const navigator = useNavigate();

	const decorateDate = (date: string) => {
		const delimiterPos = date.indexOf('T');
		return date.substring(0, delimiterPos);
	};

	const decorateStatus = (status: OrderStatus) => {
		switch (status) {
		case OrderStatus.Assembly:
			return 'В сборке';
		case OrderStatus.AwaitingReceipt:
			return 'Ожидает получения';
		case OrderStatus.Canceled:
			return 'Отменен';
		case OrderStatus.Created:
			return 'Создан';
		case OrderStatus.OnTheWay:
			return 'В пути';
		case OrderStatus.Received:
			return 'Получен';
		}
	};

	return (
		<div className={style.wrapper}>
			<div className={style.header}>
				<div className={style.orderHeaderDataBlock}>
					<div
						className={style.orderNumber}
						onClick={() => navigator(`/order/${orderNumber}`)}
					>{`Заказ ${orderNumber}`}</div>
					<div className={style.date}>{`От ${decorateDate(date)}`}</div>
				</div>

				<div className={style.shopNameAndLogoWrapper}>
					<div className={style.logo}>
						<img src={shopLogo} onError={logoFallback} alt={'logo'} />
					</div>
					<div className={style.shopName} onClick={() => navigator(`/store/${shopId}`)}>
						<span>{shopName}</span>
					</div>
				</div>
			</div>
			<div className={style.orderDataMainWrapper}>
				<div className={style.orderDataWrapper}>
					<div>
						<div className={style.status}>Статус: {decorateStatus(status)}</div>

						{gotDate && (
							<div
								className={style.statusGot}
							>{`Получен: ${decorateDate(gotDate)}`}</div>
						)}
					</div>

					<div className={style.price}>{`${price} ₽`}</div>
				</div>
				<div className={style.products}>
					{products.map((product, id) => (
						<img
							src={product.logoUrl ?? noLogo}
							onError={logoFallback}
							alt={'product'}
							key={id}
							onClick={() => navigator(`/item/${product.id}`)}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default OrderCard;

import React, { useState } from 'react';
import style from './Store.module.scss';
import noLogo from '../../assets/no-logo.svg';
import { ProductShortInfo, StoreFullInfo } from '../../api/StoreApi';
import { logoFallback } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';
import checkImg from '../../assets/check.svg';

type PropsType = {
	products: Array<ProductShortInfo>;
	tgSubscribe: () => Promise<void>;
	tgUnsubscribe: () => Promise<void>;
	onAddProductClick: () => void;
	tgIsSubscribed: boolean;
	shopData: StoreFullInfo;
	isSeller: boolean;
};

const Store: React.FC<PropsType> = ({
	products,
	onAddProductClick,
	tgSubscribe,
	tgIsSubscribed,
	shopData,
	isSeller,
	tgUnsubscribe,
}) => {
	const navigator = useNavigate();
	const [isFetching, setIsFetching] = useState(false);

	const onProductClick = (productId: string) => {
		navigator('/item/' + productId);
	};

	const onTgSubscribeClick = async () => {
		setIsFetching(true);
		await tgSubscribe();
		setIsFetching(false);
	};

	const onTgUnsubscribeClick = async () => {
		setIsFetching(true);
		await tgUnsubscribe();
		setIsFetching(false);
	};

	return (
		<div className={style.pageWrapper}>
			<div className={style.wrapper}>
				{!isSeller && (
					<div className={style.manageBlock}>
						{tgIsSubscribed ? (
							<div>
								<button onClick={onTgUnsubscribeClick} disabled={isFetching}>
									Отписаться от магазина
								</button>
							</div>
						) : (
							<div>
								<button onClick={onTgSubscribeClick} disabled={isFetching}>
									Подписаться на магазин
								</button>
								<p>
									Ваша активность в соцсетях этого магазина будет отслеживаться
									только после того, как вы подпишетесь
								</p>
							</div>
						)}
					</div>
				)}

				{isSeller && (
					<div className={style.manageBlock}>
						<button onClick={onAddProductClick}>Добавить товар</button>
					</div>
				)}

				<div className={style.shopName}>
					<h2>{shopData.title}</h2>
					<p>{shopData.description}</p>
				</div>

				{products.length > 0 && <div className={style.productsLabel}>Товары</div>}

				<div className={style.products}>
					{products.map((item: ProductShortInfo) => (
						<ProductCard
							price={item.price}
							name={item.title}
							logoUrl={item.logoUrl}
							onClick={() => onProductClick(item.productId)}
							key={item.productId}
						/>
					))}
				</div>
			</div>
			<footer />
		</div>
	);
};

export default Store;

type ProductCardType = {
	logoUrl?: string;
	price: number;
	name: string;
	onClick?: () => void;
};

const ProductCard: React.FC<ProductCardType> = ({ logoUrl, price, name, onClick }) => {
	const decoratePrice = (price: number): string => {
		return new Intl.NumberFormat('ru-RU').format(price);
	};

	return (
		<div className={style.product}>
			<div className={style.card} onClick={onClick}>
				<div className={style.image}>
					<img src={logoUrl ?? noLogo} onError={logoFallback} alt={'product_logo'} />
				</div>
				<div className={style.price}>{`${decoratePrice(price)} ₽`}</div>
				<div className={style.name}>{name}</div>
			</div>
		</div>
	);
};

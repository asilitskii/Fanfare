import React from 'react';
import style from './ProductCard.module.scss';
import noLogo from '../../../assets/no-logo.svg';
import { ProductModel } from '../../../api/OrderApi';
import { logoFallback } from '../../../utils/utils';

interface ProductCardProps {
	product: ProductModel;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
	return (
		<div className={style.productCard}>
			<div className={style.imageFrame}>
				<img src={product.logoUrl ?? noLogo} onError={logoFallback} alt={product.title} />
			</div>
			<div className={style.textWrapper}>
				<p className={style.productPrice}>
					{product.price} <span>₽</span>
				</p>
				<p className={style.productName}>{product.title}</p>
			</div>
		</div>
	);
};

export default ProductCard;

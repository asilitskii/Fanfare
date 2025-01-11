import React from 'react';
import style from './ProductGrid.module.scss';
import ProductCard from './ProductCard';
import { ProductModel } from '../../../api/OrderApi';

interface ProductGridProps {
	products: ProductModel[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
	return (
		<div className={style.productGrid}>
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
};

export default ProductGrid;

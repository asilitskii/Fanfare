import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Product, { ProductType } from './Product';
import Preloader from '../assets/preloader/Preloader';
import style from './Product.module.scss';
import { toast } from 'react-toastify';
import { useProductStorage } from '../../zustand/ProductStorage';
import { useCookies } from 'react-cookie';

const ProductContainer: React.FC = () => {
	const [showFullDescription, setShowFullDescription] = useState(false);
	const [cookies, setCookie] = useCookies(['itemId']);
	const navigate = useNavigate();
	const { isLoading, loadProduct } = useProductStorage();
	const [product, setProduct] = useState<ProductType | null>(null);
	const { itemId } = useParams<{ itemId: string }>();

	useEffect(() => {
		if (itemId) {
			loadProduct(itemId)
				.then((product) => setProduct(product))
				.catch((error) => {
					if (error instanceof Error) {
						toast.error(error.message);
					}
				});
		}
	}, [itemId, loadProduct]);

	const handleBuyNow = () => {
		if (product) {
			setCookie('itemId', product.productId);
			navigate(`/order/new`);
		}
	};

	const toggleDescription = () => {
		setShowFullDescription((prevState) => !prevState);
	};

	if (isLoading) {
		return (
			<div className={style.preloader}>
				<Preloader />
			</div>
		);
	}

	if (!product) {
		return <></>;
	}

	return (
		<Product
			product={product}
			showFullDescription={showFullDescription}
			toggleDescriptionMode={toggleDescription}
			onBuyNowClick={handleBuyNow}
		/>
	);
};

export default ProductContainer;

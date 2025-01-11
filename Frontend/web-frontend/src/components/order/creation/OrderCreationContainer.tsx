import OrderCreation from './OrderCreation';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Preloader from '../../assets/preloader/Preloader';
import style from './OrderCreation.module.scss';
import { useProductStorage } from '../../../zustand/ProductStorage';
import { useOrderCreationStorage } from '../../../zustand/OrderCreationStorage';
import { useCookies } from 'react-cookie';
import { ProductType } from '../../product/Product';

const OrderCreationContainer: React.FC = () => {
	const [cookies] = useCookies(['itemId']);
	const { balance, loadBalance, createOrder } = useOrderCreationStorage();
	const { loadProduct } = useProductStorage();
	const [product, setProduct] = useState<ProductType | null>(null);
	const navigate = useNavigate();

	const itemId = useMemo(() => cookies.itemId, [cookies]);

	useEffect(() => {
		if (itemId) {
			loadProduct(itemId)
				.then((product) => {
					setProduct(product);
					loadBalance(product.storeId).catch((error) => {
						if (error instanceof Error) {
							toast.error(error.message);
						}
					});
				})
				.catch((error) => {
					if (error instanceof Error) {
						toast.error(error.message);
					}
				});
		}
	}, [loadProduct, itemId, loadBalance]);

	const handleOrderCreated = (creationOrderId: string) => navigate(`/order/${creationOrderId}`);

	const handleCancel = () => navigate(`/item/${itemId}`);

	return (
		<>
			{typeof balance === 'number' && product ? (
				<OrderCreation
					balance={balance}
					product={product}
					createOrder={createOrder}
					onOrderCreated={handleOrderCreated}
					onCancel={handleCancel}
				/>
			) : (
				<div className={style.preloader}>
					<Preloader />
				</div>
			)}
		</>
	);
};

export default OrderCreationContainer;

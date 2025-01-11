import React, { useEffect } from 'react';
import ProductCreation from './ProductCreation';
import { useNavigate } from 'react-router-dom';
import { useProductCreationStorage } from '../../../zustand/ProductCreationStorage';
import Preloader from '../../assets/preloader/Preloader';
import { useStoreStorage } from '../../../zustand/StoreStorage';
import { toast } from 'react-toastify';
import style from './ProductCreation.module.scss';

const ProductCreationContainer: React.FC = () => {
	const { storeId, setStoreId, setLogo, createProduct, uploadProductLogo } =
		useProductCreationStorage();
	const { loadSellerStores } = useStoreStorage();

	const navigator = useNavigate();

	useEffect(() => {
		loadSellerStores()
			.then((stores) => {
				const store = stores.pop();
				if (store) {
					setStoreId(store.storeId);
				}
			})
			.catch((e) => {
				if (e instanceof Error) {
					toast.error(e.message);
					navigator('/profile');
				}
			});
	}, [loadSellerStores, navigator, setStoreId]);

	const handleCancel = () => navigator(`/store/${storeId}`);

	return (
		<>
			{storeId ? (
				<ProductCreation
					storeId={storeId}
					setLogo={setLogo}
					createProduct={createProduct}
					uploadProductLogo={uploadProductLogo}
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

export default ProductCreationContainer;

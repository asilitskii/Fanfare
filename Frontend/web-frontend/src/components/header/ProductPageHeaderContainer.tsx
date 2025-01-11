import React from 'react';
import ProductPageHeader from './ProductPageHeader';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../api/API';
import { useNavigate } from 'react-router-dom';

type PropsType = {
	logo: string;
	storeId: string;
};

const ProductPageHeaderContainer: React.FC<PropsType> = ({ logo, storeId }) => {
	const isAuth =
		localStorage.getItem(ACCESS_TOKEN) != null && localStorage.getItem(REFRESH_TOKEN) != null;
	const navigator = useNavigate();

	const onLogoClick = () => {
		navigator(`/store/${storeId}`);
	};

	return <ProductPageHeader isAuth={isAuth} logoUrl={logo} onLogoClick={onLogoClick} />;
};

export default ProductPageHeaderContainer;

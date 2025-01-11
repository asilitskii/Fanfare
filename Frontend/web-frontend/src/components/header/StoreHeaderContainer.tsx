import React from 'react';
import StoreHeader from './StoreHeader';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../api/API';

type PropsType = {
	logo: string;
	onInvoiceClick: () => void;
};

const StoreHeaderContainer: React.FC<PropsType> = ({ logo, onInvoiceClick }) => {
	const isAuth =
		localStorage.getItem(ACCESS_TOKEN) != null && localStorage.getItem(REFRESH_TOKEN) != null;
	return <StoreHeader isAuth={isAuth} logoUrl={logo} onInvoiceClick={onInvoiceClick} />;
};

export default StoreHeaderContainer;

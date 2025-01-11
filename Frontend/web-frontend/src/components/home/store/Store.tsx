import React from 'react';
import StoreGrid from './content/StoreGrid';

export type StoreType = {
	id: string;
	name: string;
	logoUrl?: string;
};

type StorePropsType = {
	stores: StoreType[];
};

const Store: React.FC<StorePropsType> = ({ stores }) => {
	return <StoreGrid stores={stores} />;
};

export default Store;

import React from 'react';
import MainHeader from './MainHeader';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHomeStorage } from '../../zustand/HomeStorage';

type PropsType = {
	content?: JSX.Element;
};

const MainHeaderContainer: React.FC<PropsType> = ({ content }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { resetFilter, setSearchQuery, searchQuery } = useHomeStorage();

	const onHomeClick = () => {
		resetFilter();
		navigate('/home');
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		if (location.pathname !== '/home') {
			navigate('/home');
		}
	};

	return (
		<MainHeader
			onHomeClick={onHomeClick}
			onSearch={handleSearch}
			searchQuery={searchQuery}
			content={content}
		/>
	);
};

export default MainHeaderContainer;

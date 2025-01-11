import React from 'react';
import Home from './Home';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../api/API';

const HomeContainer: React.FC = () => {
	const isAuth =
		localStorage.getItem(ACCESS_TOKEN) != null && localStorage.getItem(REFRESH_TOKEN) != null;

	const navigator = useNavigate();

	const handleNavigateToProfile = () => {
		navigator('/profile');
	};

	const handleNavigateToLogin = () => {
		navigator('/login');
	};

	return (
		<Home
			isAuth={isAuth}
			onProfileClick={handleNavigateToProfile}
			onLoginClick={handleNavigateToLogin}
		/>
	);
};

export default HomeContainer;

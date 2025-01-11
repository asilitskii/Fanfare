import React from 'react';
import { useAuthStorage } from '../../zustand/AuthStorage';
import Login from './Login';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../api/API';
import { Navigate, useNavigate } from 'react-router-dom';

const LoginContainer = () => {
	const { login } = useAuthStorage();
	const navigator = useNavigate();
	if (localStorage.getItem(ACCESS_TOKEN) != null && localStorage.getItem(REFRESH_TOKEN) != null) {
		return <Navigate to={'/profile'} />;
	}

	const onSuccessLogin = () => {
		navigator('/profile');
	};

	return (
		<Login
			loginUser={login}
			registerRedirectLink={'/register'}
			resetPasswordRedirectLink={'/password-reset'}
			onSuccessLogin={onSuccessLogin}
		/>
	);
};

export default LoginContainer;

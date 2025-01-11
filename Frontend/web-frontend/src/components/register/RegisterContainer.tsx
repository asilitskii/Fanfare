import React from 'react';
import { useRegisterStorage } from '../../zustand/RegisterStorage';
import Register from './Register';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../api/API';
import { Navigate, useNavigate } from 'react-router-dom';

export const RegisterContainer: React.FC = () => {
	const { register } = useRegisterStorage();
	const navigator = useNavigate();

	if (localStorage.getItem(ACCESS_TOKEN) != null && localStorage.getItem(REFRESH_TOKEN) != null) {
		return <Navigate to={'/profile'} />;
	}

	const onSuccessRegister = () => {
		navigator('/confirm');
	};

	return <Register registerUser={register} onSuccessRegister={onSuccessRegister} />;
};

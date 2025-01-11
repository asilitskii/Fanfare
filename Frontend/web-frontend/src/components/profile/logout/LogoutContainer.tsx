import React from 'react';
import Logout from './Logout';
import { useNavigate } from 'react-router-dom';
import { useAuthStorage } from '../../../zustand/AuthStorage';
import { useUserStorage } from '../../../zustand/UserStorage';

type PropsType = {
	onCancelClick: () => void;
};

const LogoutContainer: React.FC<PropsType> = ({ onCancelClick }) => {
	const { logout } = useAuthStorage();
	const { clearUserData } = useUserStorage();
	const navigator = useNavigate();

	const onLogoutClick = async () => {
		await logout();
		clearUserData();
		navigator('/login');
	};

	return <Logout onCancelClick={onCancelClick} onLogoutClick={onLogoutClick} />;
};

export default LogoutContainer;

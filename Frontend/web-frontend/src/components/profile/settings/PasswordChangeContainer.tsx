import React from 'react';
import PasswordChange from './PasswordChange';
import { useUserStorage } from '../../../zustand/UserStorage';

const PasswordChangeContainer: React.FC = () => {
	const { changePassword } = useUserStorage();
	return <PasswordChange changePassword={changePassword} />;
};

export default PasswordChangeContainer;

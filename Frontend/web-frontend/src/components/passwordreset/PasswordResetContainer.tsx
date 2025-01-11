import React from 'react';
import PasswordReset from './PasswordReset';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStorage } from '../../zustand/AuthStorage';

const PasswordResetContainer: React.FC = () => {
	const { code } = useParams() as { code: string };

	const { passwordResetConfirmation } = useAuthStorage();
	const navigate = useNavigate();

	const resetPassword = async (newPassword: string) => {
		await passwordResetConfirmation(newPassword, code);
	};

	const onSuccessReset = () => {
		navigate('/login');
	};

	return <PasswordReset resetPassword={resetPassword} onSuccessReset={onSuccessReset} />;
};

export default PasswordResetContainer;

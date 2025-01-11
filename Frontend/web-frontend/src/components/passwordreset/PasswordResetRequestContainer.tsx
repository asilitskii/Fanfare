import React from 'react';
import PasswordResetRequest from './PasswordResetRequest';
import { useNavigate } from 'react-router-dom';
import { useAuthStorage } from '../../zustand/AuthStorage';

const PasswordResetRequestContainer: React.FC = () => {
	const { passwordResetRequest } = useAuthStorage();
	const navigate = useNavigate();

	const onSuccessRequest = () => {
		navigate('/password-reset/instruction');
	};

	return (
		<PasswordResetRequest
			resetPasswordRequest={passwordResetRequest}
			onSuccessLogin={onSuccessRequest}
		/>
	);
};

export default PasswordResetRequestContainer;

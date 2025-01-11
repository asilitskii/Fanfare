import EmailVerification from './EmailVerification';
import { useParams } from 'react-router-dom';
import { userApi, UserResponseCodes } from '../../api/API';
import axios from 'axios';

const EmailVerificationContainer: React.FC = () => {
	const { code } = useParams() as { code: string };

	const verifyEmail = async (code: string) => {
		try {
			await userApi.users.postVerifyEmailWithCode(code);
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.response?.status === UserResponseCodes.EMAIL_VERIFY_FAILED) {
					return false;
				}
			}
			// here when thrown 422 or not axios error
			return false;
		}

		return true;
	};

	return (
		<EmailVerification
			code={code}
			verifyEmail={verifyEmail}
			toFallbackPath={'/login'}
			toRegisterPagePath={'/home'}
		/>
	);
};

export default EmailVerificationContainer;

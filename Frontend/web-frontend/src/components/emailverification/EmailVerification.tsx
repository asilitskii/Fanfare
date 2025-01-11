import { useEffect, useState } from 'react';
import Preloader from '../assets/preloader/Preloader';
import style from './emailVerification.module.scss';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/header/Logo';

type PropsType = {
	code: string;
	verifyEmail: (code: string) => Promise<boolean>;
	toFallbackPath: string;
	toRegisterPagePath: string;
};

const EmailVerification: React.FC<PropsType> = ({
	code,
	verifyEmail,
	toFallbackPath,
	toRegisterPagePath,
}) => {
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	useEffect(() => {
		verifyEmail(code).then((isSuccess) => {
			if (isSuccess) {
				setIsSuccess(true);
			} else {
				setIsError(true);
			}
		});
	}, [code, verifyEmail]);

	if (!isSuccess && !isError) {
		return (
			<div className={style.wrapper}>
				<Logo />

				<div className={style.preloader}>
					<Preloader />
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className={style.wrapper}>
				<Logo />

				<div className={style.msg}>
					<p>Ссылка, которая привела вас сюда, скорее всего устарела.</p>
					<div>
						<NavLink to={toRegisterPagePath}>
							<button className={style.buttonStyle}>На главную</button>
						</NavLink>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={style.wrapper}>
			<Logo />

			<div className={style.msg}>
				<p>Аккаунт успешно подтвержден</p>
				<div>
					<NavLink to={toFallbackPath}>
						<button className={style.buttonStyle}>Войти</button>
					</NavLink>
				</div>
			</div>
		</div>
	);
};

export default EmailVerification;

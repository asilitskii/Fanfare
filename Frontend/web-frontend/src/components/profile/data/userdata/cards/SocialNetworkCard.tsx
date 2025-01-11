import React, { useState } from 'react';
import style from './SocialNetworkCard.module.scss';

type PropsType = {
	socNetworkName: string;
	id: string | number | null;
	logout: () => Promise<void>;
};

const SocialNetworkCard: React.FC<PropsType> = ({ socNetworkName, id, logout }) => {
	const [isFetching, setIsFetching] = useState(false);

	const onLogoutClick = async () => {
		setIsFetching(true);
		await logout();
		setIsFetching(false);
	};

	return (
		<div className={style.wrapper}>
			<div className={style.name}>{socNetworkName}</div>
			<div className={style.userNameWrapper}>
				<div className={style.userName}>{id ? `ID: ${id}` : ''}</div>
			</div>

			<div className={style.logout}>
				<button onClick={onLogoutClick} disabled={isFetching}>
					Выйти
				</button>
			</div>
		</div>
	);
};

export default SocialNetworkCard;

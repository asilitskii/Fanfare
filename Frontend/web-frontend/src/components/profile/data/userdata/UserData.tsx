import React, { useState } from 'react';
import style from './UserData.module.scss';
import SocialNetworkCard from './cards/SocialNetworkCard';
import UnauthorizedSocialNetworkCard from './cards/UnauthorizedSocialNetworkCard';
import UserCard, { UserCardDataType } from './cards/UserCard';
import Modal from '../../../assets/modal/Modal';
import RequestSellerRights from './sellercards/RequestSellerRights';
import RequestedSellerRightsCard from './sellercards/RequestedSellerRightsCard';
import SellerCard from './sellercards/SellerCard';

export type SocNetworkType = {
	id?: number | null;
	login: (id: number) => Promise<string | null>;
	logout: () => Promise<void>;
};

type PropsType = {
	vkData: SocNetworkType;
	telegramData: SocNetworkType;
	isSeller: boolean;
	requestedSeller: boolean;
	requestSellerRights: (text: string) => Promise<void>;
	onEditProfileClick: () => void;
	userData: UserCardDataType;
	onViewOrdersClick: () => void;
	onStoreClick: () => void;
};

const UserData: React.FC<PropsType> = ({
	vkData,
	telegramData,
	isSeller,
	requestSellerRights,
	requestedSeller,
	onEditProfileClick,
	userData,
	onViewOrdersClick,
	onStoreClick,
}) => {
	const [requestSellerRightModalActive, setRequestSellerRightModalActive] = useState(false);

	const onRequestSellerRightClick = () => {
		setRequestSellerRightModalActive(true);
	};

	const disableModal = () => {
		setRequestSellerRightModalActive(false);
	};

	return (
		<div className={style.wrapper}>
			<div className={style.userCardWrapper}>
				<div className={style.card}>
					<UserCard data={userData} onEditProfileClick={onEditProfileClick} />
				</div>

				<Modal
					active={requestSellerRightModalActive}
					setActive={setRequestSellerRightModalActive}
				>
					<RequestSellerRights
						disableModal={disableModal}
						request={requestSellerRights}
					/>
				</Modal>

				{}

				{isSeller ? (
					<SellerCard onViewOrdersClick={onViewOrdersClick} onStoreClick={onStoreClick} />
				) : requestedSeller ? (
					<RequestedSellerRightsCard />
				) : (
					<div className={style.sellerButton}>
						<button onClick={onRequestSellerRightClick}>
							Запросить статус продавца
						</button>
					</div>
				)}
			</div>

			<div className={style.socNetworks}>
				<div className={style.cardPaddingWrapper}>
					<div className={style.socNetCard}>
						{telegramData.id ? (
							<SocialNetworkCard
								socNetworkName={'Telegram'}
								id={telegramData.id}
								logout={telegramData.logout}
							/>
						) : (
							<UnauthorizedSocialNetworkCard
								socNetworkName={'Telegram'}
								login={telegramData.login}
							/>
						)}
					</div>
				</div>
				{/*<div className={style.socNetCard}>
					{vkData.id ? (
						<SocialNetworkCard
							socNetworkName={'ВКонтакте'}
							id={vkData.id}
							logout={vkData.logout}
						/>
					) : (
						<UnauthorizedSocialNetworkCard
							socNetworkName={'ВКонтакте'}
							login={vkData.login}
						/>
					)}
				</div>*/}
			</div>
		</div>
	);
};

export default UserData;

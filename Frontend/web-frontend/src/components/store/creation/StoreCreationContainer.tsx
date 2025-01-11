import React, { useEffect } from 'react';
import StoreCreation from './StoreCreation';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../../api/API';
import { useUserStorage } from '../../../zustand/UserStorage';
import { useStoreCreationStorage } from '../../../zustand/StoreCreationStorage';
import { useTgStorage } from '../../../zustand/TgStorage';
import { useVkStorage } from '../../../zustand/VkStorage';

const StoreCreationContainer: React.FC = () => {
	const { userData, setUserData } = useUserStorage();
	const { creationStoreId, setLogo, createStore, uploadStoreLogo } = useStoreCreationStorage();
	const { createTgChannelActivity } = useTgStorage();
	const { createVkGroupActivity } = useVkStorage();
	const navigator = useNavigate();

	useEffect(() => {
		if (!userData) {
			userApi.users.getMeInfo().then(({ data }) => {
				setUserData(data);
				if (!data.isSeller) {
					navigator('/profile');
				}
			});
		} else if (!userData.isSeller) {
			navigator('/profile');
		}
	}, [navigator, setUserData, userData]);

	const handleCancel = () => navigator('/profile');

	return (
		<StoreCreation
			creationStoreId={creationStoreId}
			setLogo={setLogo}
			createStore={createStore}
			createTgChannelActivity={createTgChannelActivity}
			createVkGroupActivity={createVkGroupActivity}
			uploadStoreLogo={uploadStoreLogo}
			onCancel={handleCancel}
		/>
	);
};

export default StoreCreationContainer;

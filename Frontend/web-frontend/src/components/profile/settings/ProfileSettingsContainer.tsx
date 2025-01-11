import React, { useEffect } from 'react';
import ProfileSettings from './ProfileSettings';
import { useUserStorage } from '../../../zustand/UserStorage';
import Preloader from '../../assets/preloader/Preloader';
import { userApi } from '../../../api/API';
import style from './ProfileSettings.module.scss';

const ProfileSettingsContainer: React.FC = () => {
	const { userData, setUserData, changeUserData } = useUserStorage();

	useEffect(() => {
		if (userData == null) {
			userApi.users
				.getMeInfo()
				.then((response) => {
					setUserData(response.data);
				})
				.catch(() => ({}));
		}
	}, [setUserData, userData]);

	if (!userData) {
		return (
			<div className={style.preloader}>
				<Preloader />
			</div>
		);
	}

	const changeData = async (firstName: string, lastName: string, birthdate: string) => {
		if (
			userData.lastName === lastName &&
			userData.firstName === firstName &&
			userData.birthdate === birthdate
		) {
			return 'Нечего изменять';
		}

		return await changeUserData(firstName, lastName, birthdate);
	};

	return <ProfileSettings {...userData} changeData={changeData} />;
};

export default ProfileSettingsContainer;

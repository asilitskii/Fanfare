import React from 'react';
import style from './Home.module.scss';
import StoreContainer from './store/StoreContainer';
import LoginOrProfile from '../header/templates/LoginOrProfile';
import MainHeaderContainer from '../header/MainHeaderContainer';

type HomePropsType = {
	isAuth: boolean;
	onProfileClick: () => void;
	onLoginClick: () => void;
};

const Home: React.FC<HomePropsType> = ({ isAuth, onProfileClick, onLoginClick }) => {
	const content = (
		<LoginOrProfile
			isAuth={isAuth}
			onProfileClick={onProfileClick}
			onLoginClick={onLoginClick}
		/>
	);
	return (
		<div className={style.wrapper}>
			<header>
				<MainHeaderContainer content={content} />
			</header>
			<StoreContainer />
		</div>
	);
};

export default Home;

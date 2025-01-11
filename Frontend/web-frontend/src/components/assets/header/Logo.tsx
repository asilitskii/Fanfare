import style from './logo.module.scss';
import React from 'react';

const Logo: React.FC = () => {
	return (
		<div className={style.logo}>
			<h1>FANFARE</h1>
		</div>
	);
};

export default Logo;

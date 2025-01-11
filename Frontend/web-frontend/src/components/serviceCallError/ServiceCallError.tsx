import React from 'react';
import style from './ServiceCallError.module.scss';

const ServiceCallError: React.FC = () => {
	return (
		<div className={style.wrapper}>
			<h1>500</h1>
			<p className={style.errorName}>Ошибка обращения к сервису</p>
			<p>
				Приносим свои извинения за временные неудобства. Попробуйте обновить страницу через
				некоторое время.
			</p>
		</div>
	);
};

export default ServiceCallError;

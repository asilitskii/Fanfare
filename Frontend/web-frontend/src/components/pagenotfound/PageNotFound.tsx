import React from 'react';
import style from './PageNotFount.module.scss';

const PageNotFound: React.FC = () => {
	return (
		<div className={style.wrapper}>
			<h1>404</h1>
			<p className={style.errorName}>Страница не найдена</p>
			<p>Неправильно набран адресс, или такой страницы больше не существует.</p>
		</div>
	);
};

export default PageNotFound;

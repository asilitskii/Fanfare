import React from 'react';
import style from './Modal.module.scss';

type PropsType = {
	active: boolean;
	setActive: (active: boolean) => void;
	children?: JSX.Element;
};

const Modal: React.FC<PropsType> = ({ active, setActive, children }) => {
	return (
		<div
			className={active ? style.wrapper + ' ' + style.active : style.wrapper}
			onClick={() => setActive(false)}
		>
			<div
				className={active ? style.content + ' ' + style.contentActive : style.content}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
};

export default Modal;

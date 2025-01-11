import React from 'react';
import style from './CancelOrder.module.scss';

interface CancelOrderProps {
	onClose: () => void;
	onConfirm: () => void;
}

const CancelOrder: React.FC<CancelOrderProps> = ({ onClose, onConfirm }) => {
	return (
		<div className={style.modalContent}>
			<h1>FANFARE</h1>
			<p>Вы уверенны, что хотите отменить заказ?</p>
			<div className={style.buttons}>
				<button onClick={onConfirm}>Да, хочу отменить</button>
				<button onClick={onClose}>Вернуться назад</button>
			</div>
		</div>
	);
};

export default CancelOrder;

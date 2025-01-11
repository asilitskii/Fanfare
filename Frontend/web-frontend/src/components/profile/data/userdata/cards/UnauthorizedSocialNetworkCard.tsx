import React, { useState } from 'react';
import style from './UnauthorizedSocialNetworkCard.module.scss';
import { toast } from 'react-toastify';

const MAX_INPUT_LENGTH = 12;

type PropsType = {
	socNetworkName: string;
	login: (id: number) => Promise<string | null>;
};

const UnauthorizedSocialNetworkCard: React.FC<PropsType> = ({ socNetworkName, login }) => {
	const [inputData, setInputData] = useState('');
	const [isFetching, setIsFetching] = useState(false);

	const onInputDataChange = (e: React.FormEvent<HTMLInputElement>) => {
		const numericValue = e.currentTarget.value
			.replace(/[^0-9]/g, '')
			.replace(/^0+/, '')
			.substring(0, MAX_INPUT_LENGTH);
		setInputData(numericValue);
	};

	const onConfirmClick = async () => {
		if (!inputData || inputData.length === 0) {
			toast.error('Введите ID');
			return;
		}

		setIsFetching(true);
		const response = await login(parseInt(inputData));
		if (response != null) {
			toast.error(response);
		}
		setIsFetching(false);

		setInputData('');
	};

	return (
		<div className={style.wrapper}>
			<div className={style.name}>{socNetworkName}</div>
			<div className={style.idInput}>
				<input
					placeholder={'Введите ваш ID'}
					onChange={onInputDataChange}
					value={inputData}
				/>
			</div>
			<div className={style.submitBtn}>
				<button onClick={onConfirmClick} disabled={isFetching}>
					Подтвердить
				</button>
			</div>
		</div>
	);
};

export default UnauthorizedSocialNetworkCard;

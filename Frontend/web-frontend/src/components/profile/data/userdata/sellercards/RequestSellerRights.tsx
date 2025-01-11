import React, { useState } from 'react';
import style from './RequestSellerRights.module.scss';
import Logo from '../../../../assets/header/Logo';
import { toast } from 'react-toastify';

type PropsType = {
	request: (text: string) => Promise<void>;
	disableModal: () => void;
};

const RequestSellerRights: React.FC<PropsType> = ({ request, disableModal }) => {
	const [text, setText] = useState('');
	const [isFetching, setIsFetching] = useState(false);

	const onTextChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
		setText(e.currentTarget.value);
	};

	const onButtonClick = async () => {
		if (text.length === 0) {
			toast.error('Заполните поле');
			return;
		}
		setIsFetching(true);
		await request(text); // No exceptions
		setIsFetching(false);
		disableModal();
	};

	return (
		<div className={style.wrapper}>
			<div className={style.logo}>
				<Logo />
			</div>
			<div className={style.content}>
				<div className={style.inputBlock}>
					<div className={style.name}>Комментарий</div>
					<div className={style.input}>
						<textarea onChange={onTextChange} />
					</div>
				</div>

				<div className={style.buttonBlock}>
					<button disabled={isFetching} onClick={onButtonClick}>
						Отправить
					</button>
				</div>
			</div>
		</div>
	);
};

export default RequestSellerRights;

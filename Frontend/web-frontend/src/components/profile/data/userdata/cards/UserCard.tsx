import React from 'react';
import style from './UserCard.module.scss';
import pencil from '../../../../../assets/pencil.svg';

export type UserCardDataType = {
	email: string;
	firstName: string;
	lastName: string;
};

type PropsType = {
	data: UserCardDataType;
	onEditProfileClick: () => void;
};

const UserCard: React.FC<PropsType> = ({ data, onEditProfileClick }) => {
	const decorateEmail = (email: string): string => {
		const loginLen = email.indexOf('@');

		if (loginLen < 0) {
			return '';
		}
		if (loginLen === 1) {
			return `*...*${email.substring(loginLen)}`;
		}
		return `${email[0]}*...*${email.substring(loginLen)}`;
	};

	return (
		<div className={style.wrapper}>
			<div className={style.nameAndLetterWrapper}>
				<div className={style.letterBlock}>
					<div className={style.numberInCircle}>{data.firstName[0]}</div>
				</div>

				<div className={style.nameBlock}>
					<div className={style.noOverflow}>{data.firstName}</div>
					<div className={style.noOverflow}>{data.lastName}</div>
				</div>
			</div>

			<div className={style.dataBlock}>
				<div className={style.emailBlock}>
					<span className={style.emailSpan}>E-mail:</span>
					<span>{decorateEmail(data.email)}</span>
				</div>

				<div className={style.editBlock}>
					<div>Настройки профиля</div>
					<div>
						<img src={pencil} alt={pencil} onClick={onEditProfileClick} />{' '}
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserCard;

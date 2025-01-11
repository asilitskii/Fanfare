import React from 'react';
import style from './InvoiceCard.module.scss';

type PropsType = {
	invoiceValue: number | null;
	tgCommentCost?: number;
	tgBoostCost?: number;
	tgIsSubscribed: boolean;
};

const InvoiceCard: React.FC<PropsType> = ({
	invoiceValue,
	tgCommentCost,
	tgBoostCost,
	tgIsSubscribed,
}) => {
	if (invoiceValue == null && tgCommentCost != null && tgBoostCost != null) {
		return (
			<div className={style.wrapper}>
				<div className={style.subscribeText}>
					Авторизуйтесь, чтобы отслеживать вашу активность
				</div>
				<footer />
			</div>
		);
	}

	return (
		<div className={style.wrapper}>
			{/*<div className={style.networkBlock}>
				<div className={style.name}>ВКонтакте</div>
				<div className={style.item}>{`1 комментарий = ${vkCommentCost} FanfCoin's`}</div>
				<div className={style.item}>{`1 лайк = ${vkLikeCost} FanfCoin's`}</div>
			</div>*/}

			{tgCommentCost && tgBoostCost && (
				<>
					<div className={style.networkBlock}>
						<div className={style.name}>Telegram</div>
						<div
							className={style.item}
						>{`1 комментарий = ${tgCommentCost} FanfCoin's`}</div>
						<div className={style.item}>{`1 буст = ${tgBoostCost} FanfCoin's`}</div>
					</div>
					<div className={style.lineBlock} />
				</>
			)}

			{tgIsSubscribed ? (
				<div className={style.checkWrapper}>
					<div className={style.text}>Ваш счёт:</div>
					<div className={style.value}>{invoiceValue}</div>
				</div>
			) : (
				<div className={style.subscribeText}>
					Подпишитесь, чтобы отслеживать вашу активность
				</div>
			)}
			<footer />
		</div>
	);
};

export default InvoiceCard;

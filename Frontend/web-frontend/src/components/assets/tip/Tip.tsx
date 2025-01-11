import * as HoverCard from '@radix-ui/react-hover-card';
import style from './tip.module.scss';
import question from '../../../assets/question.svg';
import { PropsWithChildren } from 'react';

export const Tip: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<HoverCard.Root>
			<HoverCard.Trigger asChild>
				<img className={style.trigger} src={question} alt="???"></img>
			</HoverCard.Trigger>
			<HoverCard.Portal>
				<HoverCard.Content side="top" align="end" asChild>
					<div className={style.card}>{children}</div>
				</HoverCard.Content>
			</HoverCard.Portal>
		</HoverCard.Root>
	);
};

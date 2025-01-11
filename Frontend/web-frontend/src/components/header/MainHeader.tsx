import React, { useState } from 'react';
import style from './MainHeader.module.scss';
import search from '../../assets/search.svg';
import { useLocation } from 'react-router-dom';

type HeaderPropsType = {
	onHomeClick: () => void;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	content?: JSX.Element;
	onSearch: (query: string) => void;
	searchQuery: string;
};

const MainHeader: React.FC<HeaderPropsType> = ({
	onHomeClick,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	content,
	onSearch,
	searchQuery,
}) => {
	const [searchInput, setSearchInput] = useState(searchQuery);
	const location = useLocation();

	const handleSearch = () => {
		if (searchInput.trim() === '' && location.pathname == '/home') {
			return;
		}
		onSearch(searchInput.trim());
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleSearch();
		}
	};

	return (
		<div className={style.header}>
			<div className={style.nameBlock}>
				<h1 onClick={onHomeClick}>FANFARE</h1>
			</div>

			<div className={style.searchWrapper}>
				<input
					type="text"
					placeholder="Поиск магазина"
					value={searchInput}
					onKeyDown={handleKeyDown}
					onChange={(e) => setSearchInput(e.target.value)}
				/>
				<button onClick={handleSearch}>
					<img src={search} alt="search" />
				</button>
			</div>

			<div className={style.content}>{content}</div>
		</div>
	);
};

export default MainHeader;

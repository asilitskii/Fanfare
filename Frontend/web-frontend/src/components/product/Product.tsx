import styles from './Product.module.scss';
import { Characteristic } from '../../api/StoreApi';
import defaultLogo from '../../assets/no-logo.svg';
import { logoFallback } from '../../utils/utils';

export type ProductType = {
	title: string;
	description: string;
	price: number;
	characteristics: Characteristic[];
	productId: string;
	logoUrl?: string;
	storeId: string;
};

interface ProductProps {
	product: ProductType;
	showFullDescription: boolean;
	toggleDescriptionMode: () => void;
	onBuyNowClick: () => void;
}

const Product: React.FC<ProductProps> = ({
	product,
	showFullDescription,
	toggleDescriptionMode,
	onBuyNowClick,
}) => {
	const { title, description, price, characteristics, logoUrl } = product;

	const productLogoUrl = logoUrl || defaultLogo;

	const renderCharacteristic = (name: string, value: string) => {
		return (
			<li key={name}>
				<p className={styles.charTitle}>{name}</p>
				<p className={styles.dots}></p>
				<p className={styles.charValue}>{value}</p>
			</li>
		);
	};

	return (
		<div className={styles.wrapper}>
			<h1>{title}</h1>

			<div className={styles.contentBlock}>
				<div className={styles.imageBox}>
					<img src={productLogoUrl} onError={logoFallback} alt={title} />
				</div>
				<div className={styles.characteristics}>
					<h2>О товаре: </h2>
					<ul>
						{characteristics.map((char) => renderCharacteristic(char.name, char.value))}
					</ul>
				</div>
			</div>

			<p className={styles.price}>{price} ₽</p>
			<div className={styles.buttonGroup}>
				<button onClick={onBuyNowClick}>Купить сейчас</button>
				<button onClick={toggleDescriptionMode}>
					{showFullDescription ? 'Скрыть полное описание' : 'Показать полное описание'}
				</button>
			</div>
			{showFullDescription && (
				<div className={styles.bottomBlock}>
					<h2>Описание</h2>
					<p className={styles.description}>{description}</p>
					<h2>Все характеристики</h2>
					<ul>
						{characteristics.map((char) => renderCharacteristic(char.name, char.value))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Product;

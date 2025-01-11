import React, { useCallback, useState } from 'react';
import upload from '../../../assets/upload.svg';
import style from './upload.module.scss';

export type PictureSizesType = {
	minWidth: number;
	minHeight: number;
	maxWidth: number;
	maxHeight: number;
};

interface UploadButtonProps {
	onUpload: (file: File) => void;
	placeholder?: string;
	maxSizeMB?: number;
	sizes?: PictureSizesType;
}

const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];

export const Upload: React.FC<UploadButtonProps> = ({
	onUpload,
	placeholder,
	maxSizeMB,
	sizes,
}) => {
	const [filename, setFilename] = useState(placeholder);
	const [error, setError] = useState<string>();

	const handleUpload = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files && e.target.files[0];
			if (!file) {
				return;
			}

			setFilename('');
			// eslint-disable-next-line @typescript-eslint/no-magic-numbers
			if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
				setError('Слишком большой файл');
				return;
			} else if (!validImageTypes.includes(file.type)) {
				setError('Недопустимый формат');
				return;
			} else if (sizes) {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function (e) {
					const image = new Image();
					image.src = e.target?.result as string;
					image.onload = function () {
						const height = image.height;
						const width = image.width;
						if (
							height < sizes.minHeight ||
							width < sizes.minWidth ||
							height > sizes.maxHeight ||
							width > sizes.maxWidth
						) {
							setError(
								`Размер должен быть от ${sizes.minWidth}x${sizes.minHeight} до ${sizes.maxWidth}x${sizes.maxHeight}`,
							);
							return;
						}
					};
				};
			}

			setFilename('Идет загрузка...');
			try {
				onUpload(file);
				setFilename(file.name);
				setError(undefined);

				// allow to upload the same file again
				e.target.value = '';
			} catch (e) {
				setFilename('Ошибка загрузки');
			}
		},
		[maxSizeMB, onUpload, sizes],
	);

	return (
		<div className={style.wrapper}>
			<label className={style.inputBox}>
				<input
					type="file"
					name="file"
					hidden
					onChange={handleUpload}
					accept={validImageTypes.join(', ')}
				></input>
				<img className={style.icon} src={upload} alt="" />
				{error && (
					<span className={style.error} role="alert">
						{error}
					</span>
				)}
				{filename && <span title={filename}>{filename}</span>}
			</label>
			<span>
				{`Допустимые форматы: JPEG, PNG, WEBP, SVG. ${maxSizeMB ? `Максимальный размер файла: ${maxSizeMB} МБ` : ''} ${sizes ? `Размер изображения от ${sizes.minWidth}x${sizes.minHeight} до ${sizes.maxWidth}x${sizes.maxHeight}` : ''}`}
			</span>
		</div>
	);
};

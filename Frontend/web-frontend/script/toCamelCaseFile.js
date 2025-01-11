const fs = require('fs');

function snakeToCamel(snakeStr) {
	return snakeStr.replace(/(_\w)/g, (matches) => matches[1].toUpperCase());
}

function transformFileContent(content) {
	const transformedContent = content.replace(/(\w+)\??:\s*\w+/g, (match) => {
		const [key, ...rest] = match.split(':');
		const transformedKey = snakeToCamel(key.trim().replace(/\?$/, ''));
		const questionMark = key.trim().endsWith('?') ? '?' : '';
		return `${transformedKey}${questionMark}: ${rest.join(':').trim()}`;
	});
	return transformedContent;
}

function processFile(inputFilePath, outputFilePath) {
	fs.readFile(inputFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error('Error reading file:', err);
			return;
		}
		const transformedData = transformFileContent(data);
		fs.writeFile(outputFilePath, transformedData, (err) => {
			if (err) {
				console.error('Error writing file:', err);
				return;
			}
			console.log('File transformed and saved successfully.');
		});
	});
}

const filePath = process.argv[2]; // путь к сгенерированному файлу
processFile(filePath, filePath);

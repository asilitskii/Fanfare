import fs from 'fs';

const file_name = 'tests/reusable_data.json'

export function readFromReusableDataFile() {
    return JSON.parse(fs.readFileSync(file_name, 'utf-8'))
}

export function writeToReusableDataFile(buf) {
    fs.writeFileSync(file_name, JSON.stringify(buf, null, 2) , 'utf-8')
}
import memorizeOne from 'memorize-one';

export const callFunctionAsMemorized = (func, ...params) =>
    memorizeOne((...params) => func(...params))(...params)

export const decimalRound = (num, decimalDigits = 2) => {
    const tens = (10 ** decimalDigits);
    return Math.round(num * tens) / tens;
}

export const shortFileSize = bytes => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'EB'];
    for (var i = 0; i < units.length && bytes >= 1024; bytes /= 1024, i++);
    return `${decimalRound(bytes)} ${units[i]}`;
}

export const getFileExtension = filename => {
    let extension = '';
    for (let i = filename.length - 1; i > 0; i--) {
        if (filename[i] === '.')
            return extension.toLowerCase();
        extension = filename[i] + extension;
    }
    return null;
}

export const trunctuate = (text, maxLength = 20) => text.length < maxLength ? text.slice(0, maxLength) : text;

export function timestampToDate(timestamp) {
    const time = new Date(timestamp)
    return time.toLocaleString();
}

export function capitalize (str = '') {
    return typeof str !== 'string'
        ? ''
        : str[0].toUpperCase() + str.slice(1)
}
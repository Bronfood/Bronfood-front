export const formatStringToDate = (string: string) => {
    const arr = string.split('-');
    const year = arr[0];
    const month = parseInt(arr[1]) - 1;
    const day = arr[2];
    return new Date(year, month, day);
};

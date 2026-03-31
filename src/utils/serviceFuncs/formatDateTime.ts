export const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const monthName = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    const month = monthName[date.getMonth()];
    return `${day} ${month} ${date.getFullYear()}, ${hours}:${minutes}`;
};

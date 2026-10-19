// Массивы названий и функции для работы с датами

export const MONTHS_NOMINATIVE = [
    "январь", "февраль", "март", "апрель",
    "май", "июнь", "июль", "август",
    "сентябрь", "октябрь", "ноябрь", "декабрь"
];

export const MONTHS_GENITIVE = [
    "января", "февраля", "марта", "апреля",
    "мая", "июня", "июля", "августа",
    "сентября", "октября", "ноября", "декабря"
];

export const DAYS_OF_WEEK = [
    "Воскресенье", "Понедельник", "Вторник",
    "Среда", "Четверг", "Пятница", "Суббота"
];

export function compareDates(date1, date2) {
    const first = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const second = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    if (first < second) return -1;
    if (first > second) return 1;
    return 0;
}

export function isDateSelectable(day, month, year, currentDate) {
    const date = new Date(year, month, day);
    return compareDates(date, currentDate) >= 0;
}

export function buildCalendarGrid(year, month) {
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = firstDay.getDay();
    const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    const cells = [];

    for (let i = 0; i < offset; i++) {
        cells.push({ day: null, otherMonth: true });
    }
    for (let day = 1; day <= daysInMonth; day++) {
        cells.push({ day, otherMonth: false });
    }

    const totalCells = Math.ceil(cells.length / 7) * 7;
    while (cells.length < totalCells) {
        cells.push({ day: null, otherMonth: true });
    }

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
        weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
}
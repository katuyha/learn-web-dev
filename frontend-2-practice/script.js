// JavaScript для страницы выбора даты и времени.
//
// ЗАДАНИЕ
// ========
// Оживить свою свёрстанную страницу. Скорее всего на ней будет работать:
//   1. При открытии страницы выбрать день по умолчанию.
//   2. По клику на день — день становится выбранным,
//      слоты обновляются.
//   3. По клику на слот — время становится выбранным,
//      попадает в нижнюю панель.
//   4. Стрелки «‹» и «›» листают месяцы.
//   5. Дни раньше «сегодня» нельзя выбрать.
//   6. Нижняя панель обновляется при выборе дня и времени.
//
// ГДЕ ЖИВУТ ДАННЫЕ
// ----------------
// Слотов пока нет с сервера. Захардкодьте массив в этом файле.
// Формат слота: { time: "10:00", available: true }.
// «Сегодня» можно взять из new Date() или захардкодить —
// как удобнее для проверки.
//
// СТРУКТУРА КОДА
// --------------
// Разделите код на смысловые части комментариями:
//   1. Данные (слоты, «сегодня»).
//   2. Состояние (месяц, день, время, слоты).
//   3. Чистые функции (для работы с датами).
//   4. Отрисовка и обработчики.
//   5. Инициализация.
//
// ЧИСТЫЕ ФУНКЦИИ
// --------------
// Если понадобится строить сетку календаря — вот функция,
// которую можно использовать. Она не зависит от DOM,
// просто принимает год и месяц и возвращает массив недель.
//
// function buildCalendarGrid(year, month) {
//   const firstDay = new Date(year, month, 1);
//   const lastDay = new Date(year, month + 1, 0);
//   const daysInMonth = lastDay.getDate();
//   const startDayOfWeek = firstDay.getDay();
//   const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
//   const prevMonthLastDay = new Date(year, month, 0).getDate();
//
//   const cells = [];
//
//   for (let i = offset - 1; i >= 0; i--) {
//     cells.push({ day: prevMonthLastDay - i, otherMonth: true });
//   }
//   for (let d = 1; d <= daysInMonth; d++) {
//     cells.push({ day: d, otherMonth: false });
//   }
//   const totalCells = Math.ceil(cells.length / 7) * 7;
//   let nextDay = 1;
//   while (cells.length < totalCells) {
//     cells.push({ day: nextDay, otherMonth: true });
//     nextDay++;
//   }
//
//   const weeks = [];
//   for (let i = 0; i < cells.length; i += 7) {
//     weeks.push(cells.slice(i, i + 7));
//   }
//   return weeks;
// }

// Начните писать код здесь.

// Данные
const MONTHS_NOMINATIVE = [
    "январь", "февраль", "март", "апрель",
    "май", "июнь", "июль", "август",
    "сентябрь", "октябрь", "ноябрь", "декабрь"
];

const MONTHS_GENITIVE = [
    "января", "февраля", "марта", "апреля",
    "мая", "июня", "июля", "августа",
    "сентября", "октября", "ноября", "декабря"
];

const DAYS_OF_WEEK = [
    "Воскресенье", "Понедельник", "Вторник",
    "Среда", "Четверг", "Пятница", "Суббота"
];

// Слоты для чётных дней: занято 12:00 и 16:00.
const SLOTS_EVEN_DAY = [
    { time: "10:00", available: true },
    { time: "11:30", available: true },
    { time: "12:00", available: false },
    { time: "13:00", available: true },
    { time: "14:30", available: true },
    { time: "16:00", available: false },
    { time: "17:30", available: true },
    { time: "19:00", available: true }
];

// Слоты для нечётных дней: занято 11:30 и 14:30.
const SLOTS_ODD_DAY = [
    { time: "10:00", available: true },
    { time: "11:30", available: false },
    { time: "12:00", available: true },
    { time: "13:00", available: true },
    { time: "14:30", available: false },
    { time: "16:00", available: true },
    { time: "17:30", available: true },
    { time: "19:00", available: true }
];

const today = new Date();
today.setHours(0, 0, 0, 0);

// Состояние
const state = {
    currentMonth: today.getMonth(),
    currentYear: today.getFullYear(),
    selectedDay: today.getDate(),
    selectedTime: null
};

let currentSlots = [];

// Элементы страницы
const calendarDays = document.querySelector(".calendar__days");
const calendarMonth = document.querySelector(".calendar__month");
const calendarArrows = document.querySelectorAll(".calendar__arrow");
const calendarRefresh = document.querySelector(".calendar__refresh");
const timeSlots = document.querySelector(".time__slots");
const timeTitle = document.querySelector(".time__title");
const bookingSummary = document.querySelector(".booking__summary");

// Функции работы с датами
function compareDates(date1, date2) {
    const first = new Date(
        date1.getFullYear(),
        date1.getMonth(),
        date1.getDate()
    );

    const second = new Date(
        date2.getFullYear(),
        date2.getMonth(),
        date2.getDate()
    );

    if (first < second) return -1;
    if (first > second) return 1;
    return 0;
}

function isDateSelectable(day, month, year, currentDate) {
    const date = new Date(year, month, day);
    return compareDates(date, currentDate) >= 0;
}

function buildCalendarGrid(year, month) {
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

function getFirstSelectableDay() {
    const daysInMonth = new Date(
        state.currentYear,
        state.currentMonth + 1,
        0
    ).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        if (
            isDateSelectable(
                day,
                state.currentMonth,
                state.currentYear,
                today
            )
        ) {
            return day;
        }
    }

    return null;
}

// Слоты на конкретный день: чётные один набор, нечётные другой.
function getSlotsForDay(day, month, year) {
    const isEven = day % 2 === 0;
    const slots = isEven ? SLOTS_EVEN_DAY : SLOTS_ODD_DAY;
    return { day: day, month: month, year: year, slots: slots };
}

// Отрисовка календаря
function renderCalendar() {
    if (!calendarDays || !calendarMonth) return;

    calendarMonth.textContent =
        `${MONTHS_NOMINATIVE[state.currentMonth].toUpperCase()} ${state.currentYear}`;

    let html = "";

    buildCalendarGrid(state.currentYear, state.currentMonth)
        .forEach(week => {
            week.forEach(cell => {
                if (cell.day === null) {
                    html += '<span class="calendar__empty"></span>';
                    return;
                }

                const day = cell.day;
                const selectable = isDateSelectable(
                    day,
                    state.currentMonth,
                    state.currentYear,
                    today
                );

                const classes = ["day"];

                if (day === state.selectedDay && selectable) {
                    classes.push("day--selected");
                }

                html += `
                    <button
                        class="${classes.join(" ")}"
                        type="button"
                        data-day="${day}"
                        ${selectable ? "" : "disabled"}
                    >${day}</button>
                `;
            });
        });

    calendarDays.innerHTML = html;

    calendarDays.querySelectorAll(".day:not(:disabled)")
        .forEach(button => {
            button.addEventListener("click", onDayClick);
        });
}

function onDayClick(event) {
    state.selectedDay = Number(event.currentTarget.dataset.day);
    state.selectedTime = null;

    currentSlots = getSlotsForDay(
        state.selectedDay,
        state.currentMonth,
        state.currentYear
    ).slots;

    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
}

// Отрисовка и выбор времени
function renderTimeSlots() {
    if (!timeSlots) return;

    timeSlots.innerHTML = currentSlots.map(slot => {
        const classes = ["slot"];

        if (!slot.available) {
            classes.push("slot--busy");
        }

        if (slot.time === state.selectedTime && slot.available) {
            classes.push("slot--selected");
        }

        return `
            <button
                class="${classes.join(" ")}"
                type="button"
                data-time="${slot.time}"
                ${slot.available ? "" : "disabled"}
            >
                <span>${slot.time}</span>
                ${slot.available ? "" : "<small>ЗАНЯТО</small>"}
            </button>
        `;
    }).join("");

    timeSlots.querySelectorAll(".slot:not(:disabled)")
        .forEach(button => {
            button.addEventListener("click", onTimeSlotClick);
        });
}

function onTimeSlotClick(event) {
    state.selectedTime = event.currentTarget.dataset.time;

    renderTimeSlots();
    updateBottomBar();
}

// Переключение месяцев
function changeMonth(direction) {
    const nextDate = new Date(
        state.currentYear,
        state.currentMonth + direction,
        1
    );

    const firstAllowedMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );

    if (compareDates(nextDate, firstAllowedMonth) < 0) {
        return;
    }

    state.currentMonth = nextDate.getMonth();
    state.currentYear = nextDate.getFullYear();
    state.selectedDay = getFirstSelectableDay();
    state.selectedTime = null;

    currentSlots = getSlotsForDay(
        state.selectedDay,
        state.currentMonth,
        state.currentYear
    ).slots;

    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
}

function setupMonthNavigation() {
    if (calendarArrows.length >= 2) {
        calendarArrows[0].addEventListener("click", () => {
            changeMonth(-1);
        });

        calendarArrows[1].addEventListener("click", () => {
            changeMonth(1);
        });
    }

    if (calendarRefresh) {
        calendarRefresh.addEventListener("click", () => {
            if (state.selectedDay !== null) {
                currentSlots = getSlotsForDay(
                    state.selectedDay,
                    state.currentMonth,
                    state.currentYear
                ).slots;
                state.selectedTime = null;
            }

            renderCalendar();
            renderTimeSlots();
            updateBottomBar();
        });
    }
}

// Нижняя панель
function updateBottomBar() {
    const hasDate = state.selectedDay !== null;
    const hasTime = state.selectedTime !== null;

    if (hasDate) {
        const date = new Date(
            state.currentYear,
            state.currentMonth,
            state.selectedDay
        );

        const dateText =
            `${DAYS_OF_WEEK[date.getDay()]}, ` +
            `${state.selectedDay} ` +
            `${MONTHS_GENITIVE[state.currentMonth]} ` +
            `${state.currentYear}`;

        if (timeTitle) {
            timeTitle.textContent =
                `${DAYS_OF_WEEK[date.getDay()]}, ` +
                `${state.selectedDay} ${MONTHS_GENITIVE[state.currentMonth]}`;
        }

        if (bookingSummary) {
            bookingSummary.textContent = hasTime
                ? `Выбрано: ${dateText} · ${state.selectedTime} · Алина · 90 минут`
                : `Выбрано: ${dateText} · время не выбрано · Алина · 90 минут`;
        }
    } else {
        if (timeTitle) {
            timeTitle.textContent = "Нет доступных дат";
        }

        if (bookingSummary) {
            bookingSummary.textContent = "Нет доступных дат для записи";
        }
    }
}

// Инициализация
function init() {
    state.selectedDay = getFirstSelectableDay();

    currentSlots = getSlotsForDay(
        state.selectedDay,
        state.currentMonth,
        state.currentYear
    ).slots;

    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
    setupMonthNavigation();
}

document.addEventListener("DOMContentLoaded", init);

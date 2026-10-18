// App — корневой компонент приложения.
//
// ЗАДАНИЕ
// --------
// Перенесите свою страницу выбора даты и времени из нативного JS
// на React. У вас уже есть:
//   - готовая вёрстка (HTML);
//   - готовые стили (CSS);
//   - рабочий код на нативном JS (валидация дат, рендер календаря,
//     обработчики кликов, выбор слота).
//
// Теперь нужно то же самое сделать в React.
//
// ЧТО НУЖНО СДЕЛАТЬ
// ------------------
// 1. Разбить страницу на компоненты. Как именно — решайте сами.
//    Обычно выделяют: шапку, подвал, календарь, сетку слотов,
//    нижнюю панель.
//
// 2. Перенести вёрстку из HTML в JSX. Стили оставить как есть,
//    просто положить их в тот же проект (например, в src/styles/
//    или рядом с компонентами).
//
// 3. Заменить нативное состояние (переменные + прямые манипуляции
//    с DOM) на useState. Какие именно данные должны жить в состоянии —
//    подумайте сами. Скорее всего: текущий месяц, выбранный день,
//    выбранное время, массив слотов.
//
// 4. Рендер календаря и слотов делать через JSX и .map(),
//    без innerHTML и querySelector.
//
// 5. Обработчики кликов — через onClick прямо в JSX,
//    без addEventListener.
//
// 6. Функции для работы с датами, которые вы уже написали
//    на нативном JS (построение сетки календаря, сравнение дат,
//    проверка «не раньше сегодня»), можно переиспользовать.
//    Они чистые — не зависят от React. Создайте файл
//    src/utils/date.js и перенесите их туда.
//
//
// ПОДСКАЗКА
// ---------
// Если что-то не работает или непонятно, как перевести нативный
// код на React — вернитесь к лекции. Там разбирались все
// основные приёмы: состояние, пропсы, рендер списков, колбэки.
//
// Ниже — пустой каркас. Здесь можно начать писать.

import { useState } from "react";
import Header from "./components/Header";
import Steps from "./components/Steps";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import Summary from "./components/Summary";
import Footer from "./components/Footer";
import { today, getSlotsForDay, isDateSelectable } from "./data/date";

function App() {
  // Начальное состояние
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedTime, setSelectedTime] = useState(null);

  // Ищем первый доступный день для текущего месяца
  const getFirstSelectableDay = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      if (isDateSelectable(day, currentMonth, currentYear, today)) {
        return day;
      }
    }
    return null;
  };

  const [selectedDay, setSelectedDay] = useState(getFirstSelectableDay());
  const [slots, setSlots] = useState(getSlotsForDay(getFirstSelectableDay()));

  // Обработчики
  const handleDayClick = (day) => {
    setSelectedDay(day);
    setSelectedTime(null); // Сброс времени
    setSlots(getSlotsForDay(day));
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handlePrevMonth = () => {
    let nextMonth = currentMonth - 1;
    let nextYear = currentYear;

    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear -= 1;
    }

    // Проверка, чтобы не уйти в прошлое
    const firstAllowedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextDate = new Date(nextYear, nextMonth, 1);
    if (nextDate < firstAllowedMonth) return;

    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);
    
    // При смене месяца выбираем первый доступный день
    let newDay = null;
    const daysInMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
        if (isDateSelectable(d, nextMonth, nextYear, today)) {
            newDay = d;
            break;
        }
    }
    
    setSelectedDay(newDay);
    setSelectedTime(null);
    setSlots(getSlotsForDay(newDay));
  };

  const handleNextMonth = () => {
    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;

    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }

    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);

    let newDay = null;
    const daysInMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
        if (isDateSelectable(d, nextMonth, nextYear, today)) {
            newDay = d;
            break;
        }
    }
    
    setSelectedDay(newDay);
    setSelectedTime(null);
    setSlots(getSlotsForDay(newDay));
  };

  const handleRefresh = () => {
    if (selectedDay !== null) {
      setSlots(getSlotsForDay(selectedDay));
      setSelectedTime(null);
    }
  };

  return (
    <div className="page">
      <Header />
      <main className="main">
        <Steps />
        <section className="booking">
          <div className="booking__inner">
            <div className="booking__heading">
              <span className="booking__eyebrow">03 / ДАТА И ВРЕМЯ</span>
              <h1 className="booking__title">Найдём ваше окошко</h1>
              <p className="booking__description">Алина · «Стрижка и уход» (90 минут).</p>
            </div>

            <div className="booking__content">
              <Calendar 
                currentMonth={currentMonth}
                currentYear={currentYear}
                selectedDay={selectedDay}
                onDayClick={handleDayClick}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onRefresh={handleRefresh}
              />
              <TimeSlots 
                selectedDay={selectedDay}
                currentMonth={currentMonth}
                selectedTime={selectedTime}
                slots={slots}
                onTimeClick={handleTimeClick}
              />
            </div>

            <Summary 
              selectedDay={selectedDay}
              currentMonth={currentMonth}
              currentYear={currentYear}
              selectedTime={selectedTime}
            />

            <div className="booking__actions">
              <button className="back-button" type="button">← Назад</button>
              <button className="next-button" type="button">Это время →</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;

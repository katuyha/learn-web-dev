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

import { useState, useEffect } from "react"; // Добавлен useEffect
import Header from "./components/Header";
import Steps from "./components/Steps";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import Summary from "./components/Summary";
import Footer from "./components/Footer";
import { isDateSelectable } from "./data/date"; 
import { fetchToday, fetchSlots } from "./api"; // Подключен API

function App() {
  const [today, setToday] = useState(null);
  const [loadingToday, setLoadingToday] = useState(true);
  const [errorToday, setErrorToday] = useState(null);

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState(null);

  // Начальное состояние
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Загрузка "Сегодня" при старте
  useEffect(() => {
    async function loadToday() {
      try {
        setLoadingToday(true);
        setErrorToday(null);
        const data = await fetchToday();
        setToday(data);
        
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
        setSelectedDay(data.day);
      } catch (err) {
        setErrorToday("Не удалось загрузить расписание. Проверьте интернет или попробуйте позже.");
      } finally {
        setLoadingToday(false);
      }
    }
    loadToday();
  }, []);

  // Загрузка слотов при смене дня
  useEffect(() => {
    if (!today || selectedDay === null || currentMonth === null || currentYear === null) return;

    let isActual = true; 

    async function loadSlots() {
      try {
        setLoadingSlots(true);
        setErrorSlots(null);
        const response = await fetchSlots({
          day: selectedDay,
          month: currentMonth,
          year: currentYear
        });
        
        if (isActual) setSlots(response.slots);
      } catch (err) {
        if (isActual) setErrorSlots("Не удалось загрузить слоты времени. Попробуйте выбрать другой день или проверить соединение с интернетом.");
      } finally {
        if (isActual) setLoadingSlots(false);
      }
    }
    
    loadSlots();
    return () => { isActual = false; };
  }, [selectedDay, currentMonth, currentYear, today]);

  // Ищем первый доступный день для текущего месяца
  const getFirstSelectableDay = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const todayDate = new Date(today.year, today.month, today.day); 
    for (let day = 1; day <= daysInMonth; day++) {
      if (isDateSelectable(day, currentMonth, currentYear, todayDate)) {
        return day;
      }
    }
    return null;
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setSelectedTime(null); // Сброс времени
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

    const firstAllowedMonth = new Date(today.year, today.month, 1);
    const nextDate = new Date(nextYear, nextMonth, 1);
    if (nextDate < firstAllowedMonth) return;

    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);
    
    let newDay = null;
    const daysInMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
    const todayDate = new Date(today.year, today.month, today.day);
    for (let d = 1; d <= daysInMonth; d++) {
        if (isDateSelectable(d, nextMonth, nextYear, todayDate)) {
            newDay = d;
            break;
        }
    }
    
    setSelectedDay(newDay);
    setSelectedTime(null);
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
    const todayDate = new Date(today.year, today.month, today.day);
    for (let d = 1; d <= daysInMonth; d++) {
        if (isDateSelectable(d, nextMonth, nextYear, todayDate)) {
            newDay = d;
            break;
        }
    }
    
    setSelectedDay(newDay);
    setSelectedTime(null);
  };

  const handleRefresh = () => {
    if (selectedDay !== null) {
      setSelectedDay(null);
      setTimeout(() => setSelectedDay(selectedDay), 0);
      setSelectedTime(null);
    }
  };

  if (loadingToday) {
    return (
      <div className="page">
        <Header />
        <main className="main">
          <Steps />
          <section className="booking">
            <div className="booking__inner" style={{ textAlign: "center", padding: "50px" }}>
              <h2>Загрузка...</h2>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (errorToday) {
    return (
      <div className="page">
        <Header />
        <main className="main">
          <Steps />
          <section className="booking">
            <div className="booking__inner" style={{ textAlign: "center", padding: "50px", color: "red" }}>
              <h2>Ошибка: {errorToday}</h2>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

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
                todayDate={new Date(today.year, today.month, today.day)} 
              />
              <TimeSlots 
                selectedDay={selectedDay}
                currentMonth={currentMonth}
                selectedTime={selectedTime}
                slots={slots}
                onTimeClick={handleTimeClick}
                loading={loadingSlots} 
                error={errorSlots} 
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

// Календарь
import { MONTHS_NOMINATIVE, buildCalendarGrid, isDateSelectable } from "../data/date";

// Добавляем todayDate 
export default function Calendar({ currentMonth, currentYear, selectedDay, onDayClick, onPrevMonth, onNextMonth, onRefresh, todayDate }) {
  const weeks = buildCalendarGrid(currentYear, currentMonth);

  return (
    <section className="calendar">
      <div className="calendar__header">
        <h2 className="calendar__month">
          {MONTHS_NOMINATIVE[currentMonth].toUpperCase()} {currentYear}
        </h2>
        <div className="calendar__arrows">
          <button className="calendar__arrow" type="button" onClick={onPrevMonth} aria-label="Предыдущий месяц">‹</button>
          <button className="calendar__arrow" type="button" onClick={onNextMonth} aria-label="Следующий месяц">›</button>
        </div>
      </div>

      <div className="calendar__week">
        <span className="calendar__weekday">Пн</span>
        <span className="calendar__weekday">Вт</span>
        <span className="calendar__weekday">Ср</span>
        <span className="calendar__weekday">Чт</span>
        <span className="calendar__weekday">Пт</span>
        <span className="calendar__weekday">Сб</span>
        <span className="calendar__weekday">Вс</span>
      </div>

      <div className="calendar__days">
        {weeks.map((week, weekIndex) => (
          week.map((cell, cellIndex) => {
            if (cell.day === null) {
              return <span className="calendar__empty" key={`empty-${weekIndex}-${cellIndex}`}></span>;
            }

            const selectable = isDateSelectable(cell.day, currentMonth, currentYear, todayDate);
            const isSelected = cell.day === selectedDay && selectable;
            
            let classes = "day";
            if (isSelected) classes += " day--selected";

            return (
              <button
                key={`day-${weekIndex}-${cellIndex}`}
                className={classes}
                type="button"
                disabled={!selectable}
                onClick={() => onDayClick(cell.day)}
              >
                {cell.day}
              </button>
            );
          })
        ))}
      </div>

      <button className="calendar__refresh" type="button" onClick={onRefresh}>
        ↻ Обновить расписание
      </button>
    </section>
  );
}
// Слоты времени
import { DAYS_OF_WEEK, MONTHS_GENITIVE } from "../data/date";

export default function TimeSlots({ selectedDay, currentMonth, selectedTime, slots, onTimeClick }) {
  let titleText = "Нет доступных дат";
  if (selectedDay !== null) {
    const date = new Date(new Date().getFullYear(), currentMonth, selectedDay);
    titleText = `${DAYS_OF_WEEK[date.getDay()]}, ${selectedDay} ${MONTHS_GENITIVE[currentMonth]}`;
  }

  return (
    <section className="time">
      <h2 className="time__title">{titleText}</h2>
      <p className="time__hint">Выберите удобный интервал</p>
      
      <div className="time__slots">
        {slots.map(slot => {
          let classes = "slot";
          if (!slot.available) classes += " slot--busy";
          if (slot.time === selectedTime && slot.available) classes += " slot--selected";

          return (
            <button
              key={slot.time}
              className={classes}
              type="button"
              disabled={!slot.available}
              onClick={() => onTimeClick(slot.time)}
            >
              <span>{slot.time}</span>
              {!slot.available && <small>ЗАНЯТО</small>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
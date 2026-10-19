// Слоты времени
import { DAYS_OF_WEEK, MONTHS_GENITIVE } from "../data/date";

export default function TimeSlots({ selectedDay, currentMonth, selectedTime, slots, onTimeClick, loading, error }) {
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
        {/* Показываем заглушку, если идет загрузка */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px", width: "100%", gridColumn: "1 / -1" }}>
            Загрузка слотов...
          </div>
        ) : error ? (
          // Показываем ошибку, если она есть 
          <div style={{ textAlign: "center", padding: "20px", width: "100%", color: "red", gridColumn: "1 / -1" }}>
            {error}
          </div>
        ) : slots.length === 0 ? (
          // Если слотов нет 
          <div style={{ textAlign: "center", padding: "20px", width: "100%", gridColumn: "1 / -1" }}>
            В этот день нет доступного времени
          </div>
        ) : (
          // Иначе показываем слоты 
          slots.map(slot => {
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
          })
        )}
      </div>
    </section>
  );
}
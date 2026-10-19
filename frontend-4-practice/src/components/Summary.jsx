// Нижняя панель записи
import { DAYS_OF_WEEK, MONTHS_GENITIVE } from "../data/date";

export default function Summary({ selectedDay, currentMonth, currentYear, selectedTime }) {
  let summaryText = "Нет доступных дат для записи";

  if (selectedDay !== null) {
    const date = new Date(currentYear, currentMonth, selectedDay);
    const dateText = `${DAYS_OF_WEEK[date.getDay()]}, ${selectedDay} ${MONTHS_GENITIVE[currentMonth]} ${currentYear}`;
    summaryText = selectedTime 
      ? `Выбрано: ${dateText} · ${selectedTime} · Алина · 90 минут`
      : `Выбрано: ${dateText} · время не выбрано · Алина · 90 минут`;
  }

  return (
    <div className="booking__summary">
      {summaryText}
    </div>
  );
}
// Индикатор шагов
export default function Steps() {
  return (
    <section className="steps">
      <div className="steps__inner">
        <div className="steps__title">
          <span className="steps__caption">ВАША ЗАПИСЬ</span>
          <strong className="steps__counter">Шаг 3 / 5</strong>
        </div>
        <div className="steps__list">
          <div className="step step--done">
            <span className="step__circle">✓</span>
            <span className="step__text">Мастер</span>
          </div>
          <div className="step step--done">
            <span className="step__circle">✓</span>
            <span className="step__text">Услуга</span>
          </div>
          <div className="step step--active">
            <span className="step__circle">3</span>
            <span className="step__text">Дата и время</span>
          </div>
          <div className="step">
            <span className="step__circle">4</span>
            <span className="step__text">Контакты</span>
          </div>
          <div className="step">
            <span className="step__circle">5</span>
            <span className="step__text">Проверка</span>
          </div>
        </div>
      </div>
    </section>
  );
}
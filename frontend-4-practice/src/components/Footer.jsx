// Подвал
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <strong className="footer__logo">лепесток</strong>
          <span className="footer__tagline">Место, где забота становится стилем.</span>
        </div>
        <div className="footer__block">
          <span className="footer__label">АДРЕС</span>
          <span className="footer__value">Ярославль, Звёздная, 34</span>
          <span className="footer__value">Ежедневно 10:00–21:00</span>
        </div>
        <div className="footer__block footer__block--contact">
          <span className="footer__label">СВЯЗАТЬСЯ</span>
          <span className="footer__value">+7 (495) 234–11–77</span>
        </div>
      </div>
    </footer>
  );
}
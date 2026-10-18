// Шапка
export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <a className="logo" href="#">
          <span className="logo__mark">л</span>
          <span className="logo__text">
            <span className="logo__name">лепесток</span>
            <span className="logo__subtitle">СТУДИЯ ВОЛОС И КРАСОТЫ</span>
          </span>
        </a>
        <nav className="navigation">
          <a className="navigation__link" href="#">Услуги</a>
          <a className="navigation__link" href="#">Мастера</a>
          <a className="navigation__link" href="#">Отзывы</a>
          <a className="navigation__link" href="#">Контакты</a>
          <a className="navigation__button" href="#">Записаться</a>
        </nav>
      </div>
    </header>
  );
}
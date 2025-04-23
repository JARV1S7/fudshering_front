import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaBell, FaList, FaStore, FaUser, FaMap } from 'react-icons/fa';

export default function Header() {
  const location = useLocation();
  const pageTitles = {
    '/': 'Главная',
    '/profile': 'Мой профиль',
    '/map': 'Карта',
    '/catalog': 'Каталог',
    '/stores': 'Магазины',
    '/login': 'Вход',
    '/register': 'Регистрация'
  };

  return (
    <header className="header">
      {/* Логотип и название страницы */}
      <div className="header-left">
        <Link to="/" className="logo">FoodSharing</Link>
        <span className="page-title">
          {pageTitles[location.pathname] || 'Страница'}
        </span>
      </div>

      {/* Поисковая строка */}
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Поиск еды или магазинов..." />
      </div>

      {/* Навигация и уведомления */}
      <div className="header-right">
        <nav className="nav-links">
          <Link to="/catalog" className={location.pathname === '/catalog' ? 'active' : ''}>
            <FaList title="Каталог товаров" />
          </Link>
          <Link to="/map" className={location.pathname === '/map' ? 'active' : ''}>
            <FaMap title="Карта" />
          </Link>
          <Link to="/stores" className={location.pathname === '/stores' ? 'active' : ''}>
            <FaStore title="Магазины" />
          </Link>
          <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
            <FaUser title="Профиль" />
          </Link>
        </nav>
        <button className="notifications">
          <FaBell />
          <span className="badge">3</span>
        </button>
      </div>
    </header>
  );
}
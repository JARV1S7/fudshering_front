import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="main-header">
      {/* Бургер меню и боковая панель */}
      <div className="burger-menu" onClick={() => setShowSidebar(!showSidebar)}>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
      </div>

      {showSidebar && (
        <div className="sidebar-menu">
          <Link to="/catalog" className="sidebar-item">Каталог</Link>
          <Link to="/favorites" className="sidebar-item">Любимые</Link>
        </div>
      )}

      {/* Поисковая строка по центру */}
      <div className="search-bar">
        <div className="search-icon"><img src='image/lupa.png'/></div>
        <input type="text" placeholder="Найти..." />
      </div>

      {/* Иконки справа */}
      <div className="header-icons">
        <Link to="/cart" className="cart-icon"><img src='image/corzina.png'/></Link>
        <div 
          className="profile-icon" 
          onClick={() => setShowProfileMenu(!showProfileMenu)}>
          <img src='image/profileMain.png'/>
        </div>

        {showProfileMenu && (
          <div className="profile-menu">
            <Link to="/profile" className="profile-menu-item">
              Коноплёв Роман
              <span>В профиль {'>'}</span>
            </Link>
            <div className="profile-stats">
              <div>
                <span>Заказов</span>
                <span>244</span>
              </div>
              <div>
                <span>Сэкономил</span>
                <span>46 244 ₽</span>
              </div>
            </div>
            <Link to="/order-history" className="profile-menu-item">История заказов</Link>
            <Link to="/settings" className="profile-menu-item">Настройки</Link>
            <Link to="/logout" className="profile-menu-item">Выйти</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
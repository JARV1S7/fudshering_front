import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryButtons.css';

const CategoryButtons = ({ isMainPage = false, isAuthPage = false }) => {
  const allCategories = [
    { name: 'Выпечка', image: '/image/bakery2.png', isMain: true },
    { name: 'Десерты', image: '/image/desserts.png' },
    { name: 'Заморозка', image: '/image/frozen.png' },
    { name: 'Салаты', image: '/image/salads.png' },
    { name: 'Хлеб', image: '/image/bread.png' },
    { name: 'Боулы', image: '/image/bowls.png' },
    { name: 'Гарниры', image: '/image/sides.png' },
    { name: 'Поке', image: '/image/poke.png' },
    ...(isMainPage ? [{ name: 'Другое', image: '/image/other.png' }] : []),
  ];

  // Функция для прокрутки к категории
  const scrollToCategory = (categoryName) => {
    if (isMainPage) {
      const element = document.getElementById(categoryName.toLowerCase());
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  if (isMainPage) {
    return (
      <div className="categories-container main-layout">
        {allCategories.map((category) => (
          <button 
            key={category.name}
            onClick={() => scrollToCategory(category.name)}
            className={`category-button main-page-${category.name.toLowerCase()}`}
            style={{ backgroundImage: `url(${category.image})` }}
          />
        ))}
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <div className="categories-container register-layout">
        {allCategories
          .filter(category => category.name !== 'Другое')
          .map((category) => (
            <div
              key={category.name}
              className={`category-button ${category.isMain ? 'main-category' : 'sub-category'}`}
              style={{ backgroundImage: `url(${category.image})` }}
            />
          ))}
      </div>
    );
  }

  return (
    <div className="categories-container catalog-layout">
      {allCategories
        .filter(category => category.name !== 'Другое')
        .map((category) => (
          <Link 
            key={category.name} 
            to={`/catalog/${category.name.toLowerCase()}`}
            className={`category-button ${category.isMain ? 'main-category' : 'sub-category'}`}
            style={{ backgroundImage: `url(${category.image})` }}
          />
        ))}
    </div>
  );
};

export default CategoryButtons;
import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryButtons.css';

const CategoryButtons = ({ isMainPage = false, isAuthPage = false }) => {
  const allCategories = [
    { 
      name: 'Выпечка', 
      image: isAuthPage ? '/image/bakery.png' : '/image/bakery2.png', 
      isMain: true,
      className: 'main-category'
    },
    { 
      name: 'Десерты', 
      image: '/image/desserts.png', 
      className: 'sub-category first-sub' 
    },
    { 
      name: 'Заморозка', 
      image: '/image/frozen.png', 
      className: 'sub-category' 
    },
    { 
      name: 'Салаты', 
      image: '/image/salads.png', 
      className: 'sub-category' 
    },
    { 
      name: 'Хлеб', 
      image: '/image/bread.png', 
      className: 'sub-category' 
    },
    { 
      name: 'Боулы', 
      image: '/image/bowls.png', 
      className: 'sub-category' 
    },
    { 
      name: 'Гарниры', 
      image: '/image/sides.png', 
      className: 'sub-category' 
    },
    { 
      name: 'Поке', 
      image: '/image/poke.png', 
      className: 'sub-category' 
    },
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
          >
          </button>
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
              className={`category-button ${category.className}`}
              style={{ backgroundImage: `url(${category.image})` }}
            >
            </div>
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
            className={`category-button ${category.className}`}
            style={{ backgroundImage: `url(${category.image})` }}
          >
          </Link>
        ))}
    </div>
  );
};

export default CategoryButtons;
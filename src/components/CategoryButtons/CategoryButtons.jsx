import React from 'react';
import { Link } from 'react-router-dom';

const CategoryButtons = ({ isAuthPage = false }) => {
  const categories = [
    { name: 'Выпечка', image: '/image/bakery.png', isMain: true },
    { name: 'Десерты', image: '/image/desserts.png' },
    { name: 'Салаты', image: '/image/salads.png' },
    { name: 'Хлеб', image: '/image/bread.png' },
    { name: 'Заморозка', image: '/image/frozen.png' },
    { name: 'Боулы', image: '/image/bowls.png' },
    { name: 'Гарниры', image: '/image/sides.png' },
    { name: 'Поке', image: '/image/poke.png' },
  ];

  return (
    <div className={`categories-container ${isAuthPage ? 'register-layout' : 'catalog-layout'}`}>
      {categories.map((category) => (
        <Link 
          key={category.name} 
          to={`/catalog/${category.name.toLowerCase()}`}
          className={`category-button ${category.isMain ? 'main-category' : 'sub-category'}`}
          style={{ backgroundImage: `url(${category.image})` }}
        >
          <span>{category.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryButtons;
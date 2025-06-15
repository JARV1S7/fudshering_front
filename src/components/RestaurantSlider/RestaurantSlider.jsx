import React, { useRef, useState, useEffect } from 'react';
import RestaurantCard from '../RestaurantCard/RestaurantCard';
import './RestaurantSlider.css';
import arrowRight from '/image/arrow-right.svg';
import arrowLeft from '/image/arrow-left.svg';
import { useFavorites } from '../../contexts/FavoritesContext';

const RestaurantSlider = () => {
  const sliderRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const token = localStorage.getItem('authToken');
        console.log('Token:', localStorage.getItem('authToken'));
        if (!token) return;

        const response = await fetch('http://89.111.154.66:8080/shops', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Ошибка сети');
        const data = await response.json();

        console.log('Ответ сервера:', response);
        console.log('Данные магазинов:', data);

        setShops(data.shops || []);

      } catch (error) {
        console.error("Ошибка при загрузке данных о магазинах:", error);
      }
    };
    fetchShops();
  }, []);

  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    slider.addEventListener('scroll', checkScrollPosition);
    return () => slider.removeEventListener('scroll', checkScrollPosition);
  }, []);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'right' ? 1500 : -1500;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="restaurants-section">
      <h2>Заведения</h2>
      <div className="slider-container">
        {showLeftButton && (
          <button className="scroll-button left" onClick={() => scroll('left')}>
            <img src={arrowLeft} alt="Прокрутить влево" />
          </button>
        )}
        <div className="restaurant-slider" ref={sliderRef}>
          {shops.map(shop => (
            <RestaurantCard 
              key={shop.id}
              id={shop.id}
              name={shop.name}
              ordersCount={shop.ordersCount}
              imageUrl={shop.imageUrl}
              shopName={shop.name}
              isFavorite={favorites.includes(shop.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
        {showRightButton && (
          <button className="scroll-button right" onClick={() => scroll('right')}>
            <img src={arrowRight} alt="Прокрутить вправо" />
          </button>
        )}
      </div>
    </div>
  );
};

export default RestaurantSlider;
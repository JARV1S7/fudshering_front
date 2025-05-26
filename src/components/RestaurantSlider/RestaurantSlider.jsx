import React, { useRef, useState, useEffect } from 'react';
import RestaurantCard from '../RestaurantCard/RestaurantCard';
import './RestaurantSlider.css';
import arrowRight from '/image/arrow-right.svg';
import arrowLeft from '/image/arrow-left.svg';
import { restaurants } from '../../data/restaurants';

const RestaurantSlider = () => {
  const sliderRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

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
      const scrollAmount = direction === 'right' ? 550 : -550;
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
          {restaurants.map(restaurant => (
            <RestaurantCard 
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              ordersCount={restaurant.ordersCount}
              imageUrl={restaurant.imageUrl}
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
export { restaurants };
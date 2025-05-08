import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './RestaurantSlider.css';

const restaurants = [
  { id: 1, name: 'Вилка ложка', orders: 32, image: '/image/fork-spoon.png' },
  { id: 2, name: 'А ТЫ ГДЕ?', orders: 1, image: '/image/where.png' },
  { id: 3, name: 'Хлебничная', orders: 0, image: '/image/bakery.png' },
];

const RestaurantSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <Slider {...settings} className="restaurant-slider">
      {restaurants.map(restaurant => (
        <div key={restaurant.id} className="restaurant-card">
          <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
          <div className="restaurant-info">
            <h3>{restaurant.name}</h3>
            <p>Заказов сделано | {restaurant.orders}</p>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default RestaurantSlider;
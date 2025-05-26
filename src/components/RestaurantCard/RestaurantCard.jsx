import React from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css';
import heartIcon from '/image/heart.svg';

const RestaurantCard = ({ id, name, ordersCount, imageUrl }) => {
  return (
    <div className="restaurant-card-container">
      <Link to={`/restaurant/${id}`} className="restaurant-card-link">
        <div className="restaurant-card">
          <div className="restaurant-content">
            <img src={imageUrl} alt={name} className="restaurant-image" />
            <div className="restaurant-info">
              <h3 className="restaurant-name">{name}</h3>
              <div className="orders-info">
                <span className="orders-text">Заказов сделано</span>
                <div className="divider"></div>
                <span className="orders-count">{ordersCount}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <button className="favorite-button">
        <img src={heartIcon} alt="Добавить в избранное" />
      </button>
    </div>
  );
};

export default RestaurantCard;
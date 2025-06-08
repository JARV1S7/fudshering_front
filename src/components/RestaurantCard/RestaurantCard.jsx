import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css';
import heartIcon from '/image/heart.svg';
import heartFilledIcon from '/image/heart-filed.svg';

const RestaurantCard = ({
  id,
  name,
  ordersCount,
  imageUrl,
  isPartnerView = false,
  isDeleteMode = false,
  onToggleDeleteMode,
  onAddProductClick,
  isFavorite = false,
  onToggleFavorite
}) => {
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  return (
    <div className={`restaurant-card-container ${isPartnerView ? 'partner-view' : ''}`}>
      {!isPartnerView ? (
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
      ) : (
        <div className="restaurant-card partner-card">
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
          <div className="partner-actions">
            <button 
              className="add-product-btn"
              onClick={onAddProductClick}
            >
              Добавить товар +
            </button>
            <button
              className={`remove-product-btn ${isDeleteMode ? 'active' : ''}`}
              onClick={onToggleDeleteMode}
            >
              {isDeleteMode ? 'Отменить удаление' : 'Удалить товар'}
            </button>
          </div>
        </div>
      )}
      {!isPartnerView && (
        <button 
          className="favorite-button"
          onClick={handleFavoriteClick}
        >
          <img 
            src={isFavorite ? heartFilledIcon : heartIcon} 
            alt={isFavorite ? "Удалить из избранного" : "Добавить в избранное"} 
          />
        </button>
      )}
    </div>
  );
};

export default RestaurantCard;
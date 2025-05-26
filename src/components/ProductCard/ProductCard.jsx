import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const savings = product.originalPrice - product.discountedPrice;
  
  return (
    <div className="product-card">
      <div className="image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        <button className="add-to-cart-button">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 5.33301V26.6663" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.33301 16H26.6663" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <div className="price-block">
          <div className="price-container">
            <span className="current-price">{product.discountedPrice} ₽</span>
            <span className="original-price">{product.originalPrice} ₽</span>
          </div>
          <p className="savings">Сэкономлю {savings} ₽</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
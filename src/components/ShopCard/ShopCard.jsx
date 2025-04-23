import React from 'react';

function ShopCard({ shop }) {
  return (
    <div className="shop-card">
      <h3>{shop.name}</h3>
      <p>Рейтинг: ⭐ {shop.rating}</p>
    </div>
  );
}

export default ShopCard; 
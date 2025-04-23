import React from 'react';
import ShopCard from "../../components/ShopCard/ShopCard";

export default function Stores() {
  const shops = [
    { id: 1, name: "Пекарня 'У Васи'", rating: 4.8 },
    { id: 2, name: "Фруктовый рай", rating: 4.5 },
  ];

  return (
    <div className="stores">
      <h2>Магазины</h2>
      <div className="shops-list">
        {shops.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
    </div>
  );
}
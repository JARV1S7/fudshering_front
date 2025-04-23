import React from 'react';
import ProductCard from "../../components/ProductCard/ProductCard";

export default function ShopProfile() {
  const shop = {
    name: "Пекарня 'У Васи'",
    rating: 4.8,
    description: "Свежая выпечка каждый день!",
  };

  const products = [
    { id: 1, name: "Булочки", price: "50 руб.", discount: "50%" },
    { id: 2, name: "Хлеб", price: "80 руб.", discount: "20%" },
  ];

  return (
    <div className="shop-profile">
      <h1>{shop.name}</h1>
      <p>⭐ {shop.rating}</p>
      <p>{shop.description}</p>
      <h2>Товары</h2>
      <div className="products">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
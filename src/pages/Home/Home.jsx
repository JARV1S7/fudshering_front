import React from 'react';
import { Link } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import ProductCard from "../../components/ProductCard/ProductCard";

export default function Home() {
  const products = [
    { id: 1, name: "Булочки", shop: "Пекарня 'У Васи'", price: "50 руб.", discount: "50%" },
    { id: 2, name: "Яблоки", shop: "Фруктовый рай", price: "100 руб.", discount: "30%" },
  ];

  return (
    <div className="home">
      <h2>Срочные предложения</h2>
      <div className="products-grid">
        {products.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id}>
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
}
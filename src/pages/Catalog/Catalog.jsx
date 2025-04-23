import React from 'react';
import { useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";

export default function Catalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const products = [
    { id: 1, name: "Булочки", shop: "Пекарня 'У Васи'", price: "50 руб." },
    { id: 2, name: "Яблоки", shop: "Фруктовый рай", price: "100 руб." },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="catalog">
      <div className="products">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
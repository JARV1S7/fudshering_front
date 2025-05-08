import React from 'react';
import { useState } from 'react';
import './ShopDashboard.css';

export default function ShopDashboard() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Булочки', price: 50, stock: 10 },
    { id: 2, name: 'Хлеб', price: 80, stock: 5 }
  ]);

  return (
    <div className="shop-dashboard">
      <h1>Панель управления магазином</h1>
      
      <section className="stats-section">
        <div className="stat-card">
          <h3>Товаров в продаже</h3>
          <p>{products.length}</p>
        </div>
        <div className="stat-card">
          <h3>Всего продаж</h3>
          <p>24</p>
        </div>
      </section>

      <section className="products-section">
        <h2>Ваши товары</h2>
        <table className="products-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Цена</th>
              <th>Остаток</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price} ₽</td>
                <td>{product.stock} шт.</td>
                <td>
                  <button>Редактировать</button>
                  <button>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
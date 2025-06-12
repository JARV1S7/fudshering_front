import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { productCategories } from '../../data/categories';

// Сопоставление enum категории с id локальной категории
const categoryEnumToId = {
  BAKERY: 1,
  DESSERTS: 2,
  FREEZING: 3,
  SALADS: 4,
  BREAD: 5,
  BOWLS: 6,
  GARNISH: 7,
  POKE: 8,
  OTHER: 9,
};

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.warn('Токен не найден, запрос не будет выполнен');
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:8080/shops', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error('Ошибка загрузки магазинов');
        const data = await res.json();

        // Извлекаем все товары из всех магазинов
        const allFoods = data.shops.reduce((acc, shop) => {
          if (Array.isArray(shop.foods)) {
            const foodsWithShopName = shop.foods.map(food => ({
              ...food,
              shopName: shop.name
            }));
            acc.push(...foodsWithShopName);
          }
          return acc;
        }, []);

        // Фильтруем только активные товары
        const visibleFoods = allFoods.filter(food => food.isActive);

        setProducts(visibleFoods);
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Загрузка товаров...</div>;

  // Группируем товары по категориям
  const productsByCategory = products.reduce((acc, product) => {
    const categoryId = categoryEnumToId[product.category] || 9;
    const category = productCategories.find(c => c.id === categoryId) || { id: 9, name: 'Другое' };
    if (!acc[category.id]) {
      acc[category.id] = { category, products: [] };
    }
    acc[category.id].products.push(product);
    return acc;
  }, {});

  return (
    <div>
      {Object.values(productsByCategory).length === 0 ? (
        <p>Товары не найдены</p>
      ) : (
        Object.values(productsByCategory).map(({ category, products }) => (
          <div key={category.id} className="product-category">
            <h3>{category.name}</h3>
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductsList;
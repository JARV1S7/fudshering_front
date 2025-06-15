import React, { useEffect, useState } from 'react';
import CategoryButtons from '../../components/CategoryButtons/CategoryButtons';
import RestaurantSlider from '../../components/RestaurantSlider/RestaurantSlider';
import ProductCard from '../../components/ProductCard/ProductCard';
import { productCategories } from '../../data/categories';
import { CartProvider } from '../../contexts/CartContext';
import './MainPage.css';

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

const MainPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch('http://89.111.154.66:8080/shops', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error('Ошибка загрузки магазинов');
        const data = await res.json();

        const allFoods = data.food || [];
        const visibleFoods = allFoods.filter(food => food.active === undefined || food.active === true);

        setProducts(visibleFoods);
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const productsByCategory = products.reduce((acc, product) => {
    const categoryId = categoryEnumToId[product.category] || 9;
    const category = productCategories.find(c => c.id === categoryId) || { id: 9, name: 'Другое' };
    if (!acc[category.id]) {
      acc[category.id] = {
        category,
        products: []
      };
    }
    acc[category.id].products.push(product);
    return acc;
  }, {});

  if (loading) return <div>Загрузка товаров...</div>;

  return (
    <div className="main-page">
      <div className="content-container">
        <h2>Каталог</h2>
        <div className="catalog-layout-wrapper">
          <CategoryButtons isMainPage={true} />
        </div>

        <section className="restaurants-section">
          <RestaurantSlider />
        </section>

        <section className="products-section">
          {products.length === 0 ? (
            <p className="no-products-message">Товаров магазинов еще нету.</p>
          ) : (
            Object.values(productsByCategory).map(({ category, products }) => (
              <div key={category.id} id={category.name.toLowerCase()} className="product-list">
                <h2>{category.name}</h2>
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default () => (
  <CartProvider>
    <MainPage />
  </CartProvider>
);
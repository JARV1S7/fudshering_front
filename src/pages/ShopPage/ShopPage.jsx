import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';
import { productCategories } from '../../data/categories';
import { useFavorites } from '../../contexts/FavoritesContext';
import { CartProvider } from '../../contexts/CartContext';
import { getUserRole } from '../../utils/auth';
import './ShopPage.css';

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

const ShopPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopAndProducts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Необходима авторизация');

        const res = await fetch(`http://localhost:8080/shops/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) throw new Error('Магазин не найден');

        const data = await res.json();

        setShop(data);

        let foods = Array.isArray(data.foods) ? data.foods : [];
        foods = foods.filter(food => food.active === undefined || food.active === true);

        setProducts(foods);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShopAndProducts();
  }, [id]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!shop) {
    return <div>Магазин не найден</div>;
  }

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
    <div className="shop-page">
      <div className="shop-header">
        <button className="back-button" onClick={() => navigate(-1)} aria-label="Назад">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="27" viewBox="0 0 17 27" fill="none">
            <path d="M15 25L2 13.5L15 2" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="shop-card-wrapper">
          <RestaurantCard
            id={shop.id}
            name={shop.name}
            ordersCount={shop.ordersCount}
            imageUrl={shop.imageUrl}
            shopName={shop.name}
            isFavorite={favorites.includes(shop.id)}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      </div>

      <div className="shop-products">
        <h2>Товары магазина</h2>
        {Object.values(productsByCategory).length > 0 ? (
          Object.values(productsByCategory).map(({ category, products }) => (
            <div key={category.id} className="product-category">
              <h3 className="category-title">{category.name}</h3>
              <div className="products-grid-2">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">В этом магазине пока нет товаров</p>
        )}
      </div>
    </div>
  );
};

export default () => (
  <CartProvider>
    <ShopPage />
  </CartProvider>
);
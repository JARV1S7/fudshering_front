import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';
import './ShopPage.css';
import { restaurants } from '../../data/restaurants';
import { popularProducts } from '../../data/products';
import { productCategories } from '../../data/categories';
import { useFavorites } from '../../contexts/FavoritesContext';

const ShopPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  const shop = restaurants.find(r => r.id === Number(id));
  const shopProducts = popularProducts.filter(p => p.shopId === Number(id));

  // Группировка товаров по категориям
  const productsByCategory = shopProducts.reduce((acc, product) => {
    const category = productCategories.find(c => c.id === product.categoryId) || 
                    { id: 9, name: 'Другое' };
    if (!acc[category.id]) {
      acc[category.id] = {
        category,
        products: []
      };
    }
    acc[category.id].products.push(product);
    return acc;
  }, {});

  if (!shop) {
    return <div className="error">Магазин не найден</div>;
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="27" viewBox="0 0 17 27" fill="none">
            <path d="M15 25L2 13.5L15 2" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="shop-card-wrapper">
          <RestaurantCard 
            id={shop.id}
            name={shop.name}
            ordersCount={shop.ordersCount}
            imageUrl={shop.imageUrl}
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
              <div className="products-grid">
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

export default ShopPage;
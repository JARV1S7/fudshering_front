import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';
import './ShopPage.css';
import { restaurants } from '../../data/restaurants';
import { popularProducts } from '../../data/products';

const ShopPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const shop = restaurants.find(r => r.id === Number(id));
  const shopProducts = popularProducts.filter(p => p.shopId === Number(id));

  if (!shop) {
    return <div className="error">Магазин не найден</div>;
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="27" viewBox="0 0 17 27" fill="none">
          <path d="M15 25L2 13.5L15 2" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <div className="shop-card-wrapper">
          <RestaurantCard 
            id={shop.id}
            name={shop.name}
            ordersCount={shop.ordersCount}
            imageUrl={shop.imageUrl}
          />
        </div>
      </div>
      
      <div className="shop-products">
        <h2>Товары магазина</h2>
        {shopProducts.length > 0 ? (
          <div className="products-grid">
            {shopProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="no-products">В этом магазине пока нет товаров</p>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
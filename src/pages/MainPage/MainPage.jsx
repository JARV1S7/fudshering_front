import React from 'react';
import CategoryButtons from '../../components/CategoryButtons/CategoryButtons';
import RestaurantSlider from '../../components/RestaurantSlider/RestaurantSlider';
import ProductCard from '../../components/ProductCard/ProductCard';
import './MainPage.css';
import '../../components/CategoryButtons/CategoryButtons.css';
import '../../components/RestaurantSlider/RestaurantSlider.css';
import '../../components/ProductCard/ProductCard.css';
import { popularProducts } from '../../data/products';

const MainPage = () => {

  return (
    <div>
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
            <div>
              <h2>Выпечка</h2>
              <div className="products-grid">
                {popularProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
            <div className='product-list'>
              <h2>Десерты</h2>
              <div className="products-grid">
                {popularProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
            <div className='product-list'>
              <h2>Заморозки</h2>
              <div className="products-grid">
                {popularProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
            <div className='product-list'>
              <h2>Салаты</h2>
              <div className="products-grid">
                {popularProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
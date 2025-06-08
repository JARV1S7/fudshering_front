import React from 'react';
import CategoryButtons from '../../components/CategoryButtons/CategoryButtons';
import RestaurantSlider from '../../components/RestaurantSlider/RestaurantSlider';
import ProductCard from '../../components/ProductCard/ProductCard';
import './MainPage.css';
import '../../components/CategoryButtons/CategoryButtons.css';
import '../../components/RestaurantSlider/RestaurantSlider.css';
import '../../components/ProductCard/ProductCard.css';
import { popularProducts } from '../../data/products';
import { productCategories } from '../../data/categories';
import { CartProvider } from '../../contexts/CartContext';

const MainPage = () => {
  const productsByCategory = popularProducts.reduce((acc, product) => {
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
            {Object.values(productsByCategory).map(({ category, products }) => (
              <div key={category.id} id={category.name.toLowerCase()} className='product-list'>
                <h2>{category.name}</h2>
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default () => (
  <CartProvider>
    <MainPage />
  </CartProvider>
);
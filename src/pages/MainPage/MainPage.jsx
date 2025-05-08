import React from 'react';
import Header from '../../components/Header/Header';
import CategorySection from '../../components/CategoryButtons/CategoryButtons';
import RestaurantSlider from '../../components/RestaurantSlider/RestaurantSlider';
import ProductCard from '../../components/ProductCard/ProductCard';
import './MainPage.css';
import '../../components/Header/Header.css';
import '../../components/CategoryButtons/CategoryButtons.css';
import '../../components/RestaurantSlider/RestaurantSlider.css';
import '../../components/ProductCard/ProductCard.css';

const MainPage = () => {
  const popularProducts = [
    { id: 1, name: 'Мексиканский бургер', price: '260 ₽', image: '/image/burger.png' },
    { id: 2, name: 'Мексиканский бургер', price: '260 ₽', image: '/image/burger.png' },
  ];

  return (
    <div>
      <Header />
      <div className="main-page">
        <div className="content-container">
          <h2>Каталог</h2>
          {/* <div className="catalog-layout-wrapper">
            <CategorySection isAuthPage={false} />
          </div> */}
          
          <section className="restaurants-section">
            <h2>Заведения</h2>
            {/* <RestaurantSlider /> */}
          </section>
          
          <section className="products-section">
            <h2>Выпечка</h2>
            {/* <div className="products-grid">
              {popularProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div> */}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
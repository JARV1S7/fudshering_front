import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { productCategories } from '../../data/categories';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleProductExpired = (productId, isActive) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, active: isActive } : product
      )
    );
  };

  const handleToggleVisibility = async (productId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Пожалуйста, авторизуйтесь');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/food/toggleActive/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Ошибка переключения видимости товара');

      const updatedProduct = await res.json();
      
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId ? { ...product, active: updatedProduct.active } : product
        )
      );
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
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
        const allFoods = data.shops.reduce((acc, shop) => {
          if (Array.isArray(shop.foods)) {
            acc.push(...shop.foods);
          }
          return acc;
        }, []);

        setProducts(allFoods);
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      {loading ? (
        <div>Загрузка товаров...</div>
      ) : Object.values(productsByCategory).length === 0 ? (
        <p>Товары не найдены</p>
      ) : (
        Object.values(productsByCategory).map(({ category, products }) => (
          <div key={category.id} className="product-category">
            <h3>{category.name}</h3>
            <div className="products-grid">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  isPartnerView={true}
                  onProductExpired={handleProductExpired}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductsList;
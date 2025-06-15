import React, { useEffect, useState } from 'react';
import './PartnerDashboard.css';
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductModal from '../../components/ProductModal/ProductModal.jsx';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { productCategories } from '../../data/categories';

export default function PartnerDashboard() {
  const [currentShop, setCurrentShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [productModal, setProductModal] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
  const fetchShopData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Необходима авторизация');

      const resShop = await fetch('http://89.111.154.66:8080/shops/admin', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!resShop.ok) throw new Error('Ошибка загрузки магазина');
      const data = await resShop.json();

      console.log('Вывод с бэка shopData:', data);

      const shop = data.shops && data.shops.length > 0 ? data.shops[0] : null;

      setCurrentShop(shop);

      setProducts(data.foods || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchShopData();
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

  const handleSaveProduct = (product) => {
    if (productModal.mode === 'add') {
      setProducts(prev => [...prev, product]);
    } else {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    }
    setProductModal(null);
  };

  const handleEditProduct = (product) => {
    setProductModal({ mode: 'edit', product });
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleToggleVisibility = async (productId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Пожалуйста, авторизуйтесь');
      return;
    }

    try {
      const res = await fetch(`http://89.111.154.66:8080/food/toggleActive/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Ошибка переключения видимости товара');

      const updatedProduct = await res.json();
      console.log('Обновлённый товар с сервера:', updatedProduct);

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

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    if (!isDeleteMode) {
      setSelectedProducts([]);
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkDelete = () => {
    setShowConfirmation(true);
  };

  const confirmBulkDelete = () => {
    setProducts(products.filter(product => !selectedProducts.includes(product.id)));
    setSelectedProducts([]);
    setIsDeleteMode(false);
    setShowConfirmation(false);
  };

  if (loading) return <div>Загрузка данных...</div>;

  if (!currentShop) return <div>Магазин партнёра не найден</div>;

  return (
    <div className="shop-dashboard">
      <div className="dashboard-content">
        <div className="delete-mode-header">
          <h2>Доска товаров</h2>
          {isDeleteMode && (
            <button
              className={`delete-selected-btn ${selectedProducts.length === 0 ? 'disabled' : ''}`}
              onClick={handleBulkDelete}
              disabled={selectedProducts.length === 0}
            >
              Удалить товар
            </button>
          )}
        </div>

        <RestaurantCard
          id={currentShop.id}
          shopName={currentShop.name}
          ordersCount={currentShop.ordersCount}
          imageUrl={currentShop.imageUrl}
          isPartnerView={true}
          isDeleteMode={isDeleteMode}
          onToggleDeleteMode={toggleDeleteMode}
          onAddProductClick={() => setProductModal({ mode: 'add' })}
        />

        {Object.values(productsByCategory).map(({ category, products }) => (
          <div key={category.id} className="category-section">
            <h2 className="category-title">{category.name}</h2>
            <div className="products-grid">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isPartnerView={true}
                  isDeleteMode={isDeleteMode}
                  isSelected={selectedProducts.includes(product.id)}
                  onSelect={toggleProductSelection}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {showConfirmation && (
        <ConfirmationModal
          title="Удаление товара"
          message={`Вы уверены, что хотите удалить ${selectedProducts.length} товар(ов)?`}
          onConfirm={confirmBulkDelete}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {productModal && (
        <ProductModal
          mode={productModal.mode}
          product={productModal.product}
          onClose={() => setProductModal(null)}
          onSave={handleSaveProduct}
          shopId={currentShop.id}
        />
      )}
    </div>
  );
}
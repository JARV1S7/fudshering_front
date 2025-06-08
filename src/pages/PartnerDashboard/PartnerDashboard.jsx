import React, { useState } from 'react';
import './PartnerDashboard.css';
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductModal from '../../components/ProductModal/ProductModal.jsx';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { restaurants } from '../../data/restaurants';
import { popularProducts } from '../../data/products';
import { productCategories } from '../../data/categories';

export default function PartnerDashboard() {
  const partnerShop = restaurants.find(shop => shop.isPartnerView);
  const currentShop = partnerShop || restaurants[0];

  const [products, setProducts] = useState(
    popularProducts.filter(product => product.shopId === currentShop.id)
  );
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [productModal, setProductModal] = useState(null);

  // Группировка товаров по категориям
  const productsByCategory = products.reduce((acc, product) => {
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

  // Обработчики для добавления/редактирования товара
  const handleSaveProduct = (product) => {
    if (productModal.mode === 'add') {
      setProducts(prev => [...prev, product]);
    } else {
      setProducts(prev => prev.map(p => 
        p.id === product.id ? product : p
      ));
    }
    setProductModal(null);
  };

  const handleEditProduct = (product) => {
    setProductModal({ mode: 'edit', product });
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleToggleVisibility = (productId) => {
    setProducts(products.map(product =>
      product.id === productId
        ? { ...product, isVisible: !product.isVisible }
        : product
    ));
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
          name={currentShop.name}
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
import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import './ProductCard.css';
import { productCategories } from '../../data/categories';
import ProductModal from '../ProductModal/ProductModal';

// Функция сопоставления enum категории с id категории во фронтенде
function mapCategory(categoryEnum) {
  const map = {
    BAKERY: 1,
    READY_MEALS: 2,
    DAIRY: 3,
    MEAT: 4,
    VEGETABLES: 5,
    FRUITS: 6,
    OTHER: 9,
  };
  return map[categoryEnum] || 9;
}

// Функция сопоставления имени товара с локальным изображением
function mapImage(productName) {
  const images = {
    'Мексиканский бургер': '/image/burger.png',
    'Пицца Маргарита': '/image/pizza.png',
    'Салат Цезарь': '/image/salad.png',
    'Паста Карбонара': '/image/pasta.png',
    'Чизкейк': '/image/cheesecake.png',
    'Лазанья': '/image/lasagna.png',
  };
  return images[productName] || '/image/burger.png';
}

const ProductCard = ({
  product,
  isPartnerView = false,
  isDeleteMode = false,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onToggleVisibility,
  onAddProduct
}) => {
  const { cartItems, addToCart, removeFromCart } = useCart();

  const discountedPrice = product.discountPrice;
  const originalPrice = product.originalPrice;
  const savings = originalPrice - discountedPrice;

  const categoryId = mapCategory(product.category);
  const category = productCategories.find(c => c.id === categoryId) || { id: 9, name: 'Другое' };

  const isVisible = product.active !== undefined ? product.active : true;

  // Проверяем, есть ли товар в корзине (только для обычного пользователя)
  const isInCart = !isPartnerView && cartItems.some(item => item.foodId === product.id);

  const [showProductModal, setShowProductModal] = useState(null);

  const handleCardClick = () => {
    if (isDeleteMode) {
      onSelect(product.id);
    } else if (isPartnerView) {
      setShowProductModal({ mode: 'edit', product });
    }
  };

  const handleCartAction = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Пожалуйста, авторизуйтесь для работы с корзиной');
      return;
    }

    try {
      const cartItem = cartItems.find(item => item.foodId === product.id);

      if (cartItem) {
        await removeFromCart(cartItem.id);
      } else {
        await addToCart(product);
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleSave = (savedProduct) => {
    if (showProductModal.mode === 'edit') {
      onEdit(savedProduct);
    } else {
      onAddProduct(savedProduct);
    }
    setShowProductModal(null);
  };

  const handleToggleVisibility = (e) => {
    e.stopPropagation();
    onToggleVisibility(product.id);
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    onSelect(product.id);
  };

  return (
    <>
      <div
        className={`product-card ${isPartnerView ? 'partner-view' : ''} ${isInCart ? 'in-cart' : ''} ${!isVisible ? 'hidden' : ''}`}
        onClick={handleCardClick}
      >
        <div className="image-container">
          <img src={mapImage(product.name)} alt={product.name} className="product-image" />

          {isDeleteMode && (
            <div className="selection-checkbox-wrapper" onClick={handleSelect}>
              <div className="selection-checkbox">
                {isSelected ? (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="15.25" fill="white" stroke="#939393" strokeWidth="1.5" />
                    <circle cx="16" cy="16" r="10" fill="#939393" />
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="15.25" fill="white" stroke="#939393" strokeWidth="1.5" />
                  </svg>
                )}
              </div>
            </div>
          )}

          {isPartnerView ? (
            <div className="partner-controls">
              <button
                className={`visibility-toggle ${isVisible ? 'visible' : 'hidden'}`}
                onClick={handleToggleVisibility}
                aria-label={isVisible ? 'Скрыть товар' : 'Показать товар'}
              >
                {isVisible ? (
                  <svg width="23" height="17" viewBox="0 0 23 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.3494 2.08301L9.41706 14.0155C8.68487 14.7477 7.49762 14.7477 6.76538 14.0155L2.125 9.37507" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.33398 16H26.6673" stroke="white" strokeWidth="5.33333" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          ) : (
            <div className="partner-controls">
              <button
                className={`add-to-cart-button ${isInCart ? 'in-cart' : ''}`}
                onClick={handleCartAction}
                aria-label={isInCart ? 'Удалить из корзины' : 'Добавить в корзину'}
              >
                {isInCart ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 5.33301V26.6663" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5.33301 16H26.6663" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="product-content">
          <h3 className="product-name">{product.name}</h3>
          <div className="price-block">
            <div className="price-container">
              <span className="current-price">{discountedPrice} ₽</span>
              {originalPrice > discountedPrice && (
                <span className="original-price">{originalPrice} ₽</span>
              )}
            </div>
            {!isPartnerView && savings > 0 && (
              <p className="savings">Сэкономлю {savings} ₽</p>
            )}
          </div>
        </div>

        {!isVisible && (
          <div className="product-hidden-label">Скрыт</div>
        )}
      </div>

      {showProductModal && (
        <ProductModal
          mode={showProductModal.mode}
          product={showProductModal.product}
          onClose={() => setShowProductModal(null)}
          onSave={handleSave}
          shopId={product.shopId}
        />
      )}
    </>
  );
};

export default ProductCard;
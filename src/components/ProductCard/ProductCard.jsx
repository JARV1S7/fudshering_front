import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import './ProductCard.css';
import { productCategories } from '../../data/categories';
import ProductModal from '../../components/ProductModal/ProductModal';

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
  const savings = product.originalPrice - product.discountedPrice;
  const category = productCategories.find(c => c.id === product.categoryId);
  const [showProductModal, setShowProductModal] = useState(null);
  const isInCart = cartItems.some(item => item.id === product.id);

  const handleCardClick = () => {
    if (isDeleteMode) {
      onSelect(product.id);
    } else if (isPartnerView) {
      setShowProductModal({ mode: 'edit', product });
    }
  };

  const handleCartAction = (e) => {
    e.stopPropagation();
    if (isInCart) {
      removeFromCart(product.id);
    } else {
      addToCart({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.discountedPrice,
        oldPrice: product.originalPrice
      });
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
        className={`product-card ${isPartnerView ? 'partner-view' : ''} ${isInCart ? 'in-cart' : ''}`}
        onClick={handleCardClick}
      >
        <div className="image-container">
          <img src={product.image} alt={product.name} className="product-image" />
          
          {/* Метка выбора в режиме удаления */}
          {isDeleteMode && (
            <div className="selection-checkbox-wrapper" onClick={handleSelect}>
              <div className="selection-checkbox">
                {isSelected ? (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="15.25" fill="white" stroke="#939393" strokeWidth="1.5"/>
                    <circle cx="16" cy="16" r="10" fill="#939393"/>
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="15.25" fill="white" stroke="#939393" strokeWidth="1.5"/>
                  </svg>
                )}
              </div>
            </div>
          )}

          {isPartnerView ? (
            <div className="partner-controls">
              <button
                className={`visibility-toggle ${product.isVisible ? 'visible' : 'hidden'}`}
                onClick={handleToggleVisibility}
              >
                {product.isVisible ? (
                  <svg width="23" height="17" viewBox="0 0 23 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.3494 2.08301L9.41706 14.0155C8.68487 14.7477 7.49762 14.7477 6.76538 14.0155L2.125 9.37507" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.33398 16H26.6673" stroke="white" strokeWidth="5.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          ) : (
            <div className="partner-controls">
              <button
                className={`add-to-cart-button ${isInCart ? 'in-cart' : ''}`}
                onClick={handleCartAction}
              >
                {isInCart ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 5.33301V26.6663" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.33301 16H26.6663" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
              <span className="current-price">{product.discountedPrice} ₽</span>
              {product.originalPrice > product.discountedPrice && (
                <span className="original-price">{product.originalPrice} ₽</span>
              )}
            </div>
            {!isPartnerView && savings > 0 && (
              <p className="savings">Сэкономлю {savings} ₽</p>
            )}
          </div>
        </div>

        {isPartnerView && !product.isVisible && (
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
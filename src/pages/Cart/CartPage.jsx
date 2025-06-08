import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../../components/CartItem/CartItem';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import styles from './Cart.module.css';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [checkoutStage, setCheckoutStage] = useState(0);

  const handleNextStage = () => {
    setCheckoutStage(prev => Math.min(prev + 1, 6));
  };

  const handlePrevStage = () => {
    setCheckoutStage(prev => Math.max(prev - 1, 0));
  };

  const increaseQuantity = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  const decreaseQuantity = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      if (item.quantity <= 1) {
        removeFromCart(id);
      } else {
        updateQuantity(id, item.quantity - 1);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.items}>
        <h1 className={styles.title}>
          {checkoutStage === 0 ? 'Корзина' : 'Оформление заказа'}
        </h1>
        
        {cartItems.length === 0 ? (
          <p className={styles.empty}>Корзина пуста</p>
        ) : (
          cartItems.map(item => (
            <CartItem
              key={item.id}
              product={item}
              onIncrease={() => increaseQuantity(item.id)}
              onDecrease={() => decreaseQuantity(item.id)}
              onRemove={() => removeFromCart(item.id)}
            />
          ))
        )}
      </div>
      
      {cartItems.length > 0 && (
        <OrderSummary
          cartItems={cartItems}
          checkoutStage={checkoutStage}
          onNext={handleNextStage}
          onPrev={handlePrevStage}
        />
      )}
    </div>
  );
};

export default CartPage;
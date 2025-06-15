import React, { useEffect, useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../../components/CartItem/CartItem';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import { CartProvider } from '../../contexts/CartContext';
import styles from './Cart.module.css';

const CartPage = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, loadCartFromServer } = useCart();
  const [checkoutStage, setCheckoutStage] = useState(0);

  useEffect(() => {
    loadCartFromServer();
  }, []);

  const handleNextStage = () => setCheckoutStage(prev => Math.min(prev + 1, 6));
  const handlePrevStage = () => setCheckoutStage(prev => Math.max(prev - 1, 0));

  const onIncrease = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item) increaseQuantity(id);
  };

  const onDecrease = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      if (item.quantity <= 1) removeFromCart(id);
      else decreaseQuantity(id);
    }
  };

  const sortedCartItems = [...cartItems].sort((a, b) => a.id - b.id);

  return (
    <div className={styles.container}>
      <div className={styles.items}>
        <h1 className={styles.title}>{checkoutStage === 0 ? 'Корзина' : 'Оформление заказа'}</h1>

        {sortedCartItems.length === 0 ? (
          <p className={styles.empty}>Корзина пуста</p>
        ) : (
          sortedCartItems.map(item => (
            <CartItem
              key={item.id}
              product={item}
              onIncrease={() => onIncrease(item.id)}
              onDecrease={() => onDecrease(item.id)}
              onRemove={() => removeFromCart(item.id)}
            />
          ))
        )}
      </div>

      {sortedCartItems.length > 0 && (
        <OrderSummary
          cartItems={sortedCartItems}
          checkoutStage={checkoutStage}
          onNext={handleNextStage}
          onPrev={handlePrevStage}
        />
      )}
    </div>
  );
};

export default () => (
  <CartProvider>
    <CartPage />
  </CartProvider>
);
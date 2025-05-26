import React, { useState } from 'react';
import styles from './Cart.module.css';
import CartItem from '../../components/CartItem/CartItem';
import OrderSummary from '../../components/OrderSummary/OrderSummary';

const CartPage = () => {
  const [checkoutStage, setCheckoutStage] = useState(0);

  const handleNextStage = () => {
  setCheckoutStage(prevStage => {
    console.log('Current stage before:', prevStage);
    const nextStage = prevStage + 1;
    if (nextStage <= 6) {
      console.log('Moving to stage:', nextStage);
      return nextStage;
    }
    console.log('Order completed!');
    return prevStage;
    });
  };

  const handlePrevStage = () => {
    setCheckoutStage(prevStage => {
      const prevStageValue = prevStage - 1;
      return prevStageValue >= 0 ? prevStageValue : prevStage;
    });
  };

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Мексиканский бургер',
      image: '/image/product1.png',
      price: 2999,
      oldPrice: 3499,
      quantity: 1,
    },
    {
      id: 2,
      name: 'Название товара 2',
      image: '/image/product1.png',
      price: 4999,
      oldPrice: 5999,
      quantity: 2,
    },
  ]);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalOldPrice = cartItems.reduce((sum, item) => sum + item.oldPrice * item.quantity, 0);
  const totalSavings = totalOldPrice - totalPrice;

  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity: item.quantity + 1} : item
    ));
  };

  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id && item.quantity > 1 
        ? {...item, quantity: item.quantity - 1} 
        : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.items}>
        <h1 className={styles.title}>
          {checkoutStage === 0 ? 'Корзина' : 
           checkoutStage === 6 ? 'Статус заказа' : 'Корзина'}
        </h1>
        
        {checkoutStage < 6 ? (
          <>
            {cartItems.length === 0 ? (
              <p className={styles.empty}>Корзина пуста</p>
            ) : (
              cartItems.map(item => (
                <CartItem 
                  key={item.id}
                  product={item}
                  onIncrease={increaseQuantity}
                  onDecrease={decreaseQuantity}
                  onRemove={removeItem}
                />
              ))
            )}
          </>
        ) : (
          <p className={styles.empty}>Корзина пуста</p>
        )}
      </div>

      {cartItems.length > 0 && (
        <OrderSummary 
          cartItems={cartItems} 
          checkoutStage={checkoutStage}
          onNext={handleNextStage}
        />
      )}
    </div>
  );
};

export default CartPage;
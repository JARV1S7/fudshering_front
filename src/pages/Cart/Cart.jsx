import React from 'react';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../../components/CartItem/CartItem';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  return (
    <div className="cart-page">
      <h1>Ваша корзина</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Корзина пуста</p>
          <Link to="/catalog">Перейти в каталог</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <CartItem 
                key={item.id}
                item={item}
                onRemove={removeFromCart}
                onQuantityChange={updateQuantity}
              />
            ))}
          </div>
          <div className="cart-summary">
            <h3>Итого: {totalPrice} ₽</h3>
            <button className="checkout-btn">Оформить заказ</button>
          </div>
        </div>
      )}
    </div>
  );
}
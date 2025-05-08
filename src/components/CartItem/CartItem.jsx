import React from 'react';

export default function CartItem({ item, onRemove, onQuantityChange }) {
    return (
      <div className="cart-item">
        <img src={item.image} alt={item.name} />
        <div className="item-info">
          <h3>{item.name}</h3>
          <p>{item.price} ₽</p>
        </div>
        <div className="item-controls">
          <input 
            type="number" 
            min="1" 
            value={item.quantity}
            onChange={(e) => onQuantityChange(item.id, +e.target.value)}
          />
          <button onClick={() => onRemove(item.id)}>Удалить</button>
        </div>
      </div>
    );
  }
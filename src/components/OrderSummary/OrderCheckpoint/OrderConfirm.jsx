import React from 'react';
import styles from './OrderConfirmation.module.css';

const createOrder = async (orderData) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:8080/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    throw new Error('Ошибка при создании заказа');
  }

  const createdOrder = await response.json();
  return createdOrder;
};

const OrderConfirmation = ({ orderNumber, onClose }) => {
  return (
    <div className={styles.confirmationBlock}>
      <div className={styles.orderInfo}>
        <p>Обработка заказа <span className={styles.orderNumber}>{orderNumber}</span> может занять до 20 минут.</p>
        <p>Вы можете продолжать покупки, а мы сообщим, когда получим подтверждение от банка.</p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
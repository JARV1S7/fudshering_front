import React from 'react';
import styles from './OrderConfirmation.module.css';

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
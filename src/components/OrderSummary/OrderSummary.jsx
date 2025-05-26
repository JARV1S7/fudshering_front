import React, { useState } from 'react';
import OrderSummaryStages from './OrderCheckpoint/OrderSummaryStages';
import styles from './OrderCheckpoint/OrderSummaryStyles.module.css';

const OrderSummary = ({ cartItems, checkoutStage, onNext }) => {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalOldPrice = cartItems.reduce((sum, item) => sum + item.oldPrice * item.quantity, 0);
  const totalSavings = totalOldPrice - totalPrice;

  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [contactInfo, setContactInfo] = useState({
    name: 'Роман',
    lastName: 'Коноплёв',
    phone: '+7 901-856-20-48',
    email: 'hemp48645@gmail.com',
    address: '',
    comment: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.orderSummary}>
      <div className={styles.summaryContent}>
        {checkoutStage !== 4 && (
          <h2 className={styles.summaryTitle}>
            {checkoutStage === 0 ? 'Сумма заказов' : 
             checkoutStage === 1 ? 'Оформление заказа' :
             checkoutStage === 2 ? 'Населенный пункт' :
             checkoutStage === 3 ? 'Ваши данные' : 'Оформление заказа'}
          </h2>
        )}
        
        <OrderSummaryStages 
          checkoutStage={checkoutStage}
          totalPrice={totalPrice}
          totalOldPrice={totalOldPrice}
          totalSavings={totalSavings}
          deliveryMethod={deliveryMethod}
          setDeliveryMethod={setDeliveryMethod}
          paymentMethod={paymentMethod}
          contactInfo={contactInfo}
          handleInputChange={handleInputChange}
          setPaymentMethod={setPaymentMethod}
          onNext={onNext}
        />

        <div className={styles.buttonsGroup}>
          <button 
            className={styles.checkoutButton}
            onClick={onNext}
            type="button"
          >
            {checkoutStage === 0 ? 'Оформить заказ' :
             checkoutStage === 1 ? 'Оформить заказ' :
             checkoutStage === 5 ? 'Подтвердить заказ' : 'Далее'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
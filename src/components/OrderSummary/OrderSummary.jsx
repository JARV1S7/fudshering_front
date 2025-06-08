import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderSummaryStages from './OrderCheckpoint/OrderSummaryStages';
import styles from './OrderCheckpoint/OrderSummaryStyles.module.css';

const OrderSummary = ({ cartItems, checkoutStage, onNext }) => {
  const navigate = useNavigate();
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalOldPrice = cartItems.reduce((sum, item) => sum + item.oldPrice * item.quantity, 0);
  const totalSavings = totalOldPrice - totalPrice;

  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderNumber, setOrderNumber] = useState(null);
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

  const handleFinalSubmit = () => {
    const newOrderNumber = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderNumber(newOrderNumber);
    onNext();
  };

  const handleContinueShopping = () => {
    navigate('/'); // Перенаправление на главную страницу
  };

  return (
    <div className={styles.orderSummary}>
      <div className={styles.summaryContent}>
        {checkoutStage !== 4 && (
          <h2 className={styles.summaryTitle}>
            {checkoutStage === 0 ? 'Сумма заказов' :
             checkoutStage === 1 ? 'Оформление заказа' :
             checkoutStage === 2 ? 'Населенный пункт' :
             checkoutStage === 3 ? 'Ваши данные' : 'Проверяем статус оплаты заказа'}
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
          orderNumber={orderNumber}
          onNext={checkoutStage === 4 ? handleFinalSubmit : onNext}
        />

        <div className={styles.buttonsGroup}>
          <button
            className={styles.checkoutButton}
            onClick={checkoutStage === 5 ? handleContinueShopping : (checkoutStage === 4 ? handleFinalSubmit : onNext)}
            type="button"
          >
            {checkoutStage === 0 ? 'Оформить заказ' :
             checkoutStage === 1 ? 'Оформить заказ' :
             checkoutStage === 5 ? 'Продолжить покупки' : 'Далее'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
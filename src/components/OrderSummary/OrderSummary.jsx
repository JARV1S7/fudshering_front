import React, { useState, useEffect } from 'react';
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
    name: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    comment: ''
  });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const res = await fetch('http://localhost:8080/shops/admin', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) throw new Error('Ошибка загрузки профиля');

        const data = await res.json();
        const user = data.currentUser || {};

        setUserId(user.id || null);

        setContactInfo(prev => ({
          ...prev,
          name: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.number || '',
          email: user.email || '',
        }));
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const submitOrder = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Необходима авторизация');

      const orderPayload = {
        finalPrice: Number(totalOldPrice),
        discountPrice: Number(totalPrice), 
      };

      const res = await fetch('http://localhost:8080/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Ошибка при создании заказа');
      }

      const data = await res.json();

      const newOrderNumber = data.id || data.orderNumber || '';

      setOrderNumber(newOrderNumber);

      onNext();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFinalSubmit = () => {
    submitOrder();
  };

  const handleContinueShopping = () => {
    navigate('/');
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
          onReturnToShop={handleContinueShopping}
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
import React from 'react';
import styles from './OrderSummaryStyles.module.css';
import checkoutStyles from './CheckoutStagesStyles.module.css';
import DeliveryAddressStep from './DeliveryStep';
import ProfileEditStep from './ProfileEditStep';
import PaymentStep from './PaymentStep';


const OrderSummaryStages = ({
  checkoutStage,
  totalPrice,
  totalOldPrice,
  totalSavings,
  deliveryMethod,
  setDeliveryMethod,
  paymentMethod,
  contactInfo,
  handleInputChange,
  setContactInfo,
  setPaymentMethod,
  onNext
}) => {
  return (
    <>
      {checkoutStage === 0 && (
        <div className={styles.summarySection}>
          <div className={styles.summaryRow}>
            <span>Цена без скидки</span>
            <span className={styles.summaryValue}>{totalOldPrice.toLocaleString()} ₽</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Сэкономили</span>
            <span className={`${styles.summaryValue} ${styles.savings}`}>
              {totalSavings.toLocaleString()} ₽
            </span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Итого</span>
            <span className={styles.summaryValue}>{totalPrice.toLocaleString()} ₽</span>
          </div>
        </div>
      )}

      {checkoutStage === 1 && (
        <div className={checkoutStyles.checkoutStage}>
          <div className={checkoutStyles.deliveryBlock}>
            <div className={checkoutStyles.deliveryHeader}>
              <span className={checkoutStyles.deliveryTitle}>
                <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="3" cy="3" r="3" fill="#1E1E1E"/>
                </svg>
                адрес и способ доставки
              </span>
              <span className={checkoutStyles.deliverySubtitle}>выбрать способ доставки</span>
            </div>
            <div className={checkoutStyles.deliveryArrow}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>  
            </div>
          </div>

          <div className={`${checkoutStyles.recipientBlock} ${contactInfo.address ? checkoutStyles.active : ''}`}>
            <div className={checkoutStyles.recipientInfo}>
              <span className={checkoutStyles.recipientTitle}>
                <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="3" cy="3" r="3" fill="#1E1E1E"/>
                </svg>
                получатель
              </span>
              <span className={checkoutStyles.recipientName}>{contactInfo.name || 'Имя не указано'}</span>
              <span className={checkoutStyles.recipientPhone}>{contactInfo.phone || 'Телефон не указан'}</span>
              <span className={checkoutStyles.recipientEmail}>{contactInfo.email || 'Email не указан'}</span>
            </div>
            <div className={checkoutStyles.recipientArrow}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className={`${checkoutStyles.paymentBlock} ${contactInfo.address ? checkoutStyles.active : ''}`}>
            <div className={checkoutStyles.paymentInfo}>
              <span className={checkoutStyles.paymentTitle}>
                <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="3" cy="3" r="3" fill="#1E1E1E"/>
                </svg>
                Оплата
              </span>
              <span className={checkoutStyles.paymentMethod}>система быстрых платежей</span>
            </div>
            <div className={checkoutStyles.paymentArrow}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className={checkoutStyles.promoBlock}>
            <h2 className={styles.summaryTitle}>Сумма заказа</h2>
            <div className={checkoutStyles.promoInput}>
              <input 
                type="text" 
                placeholder="Введите промокод" 
                className={checkoutStyles.promoField}
              />
              <button 
                className={checkoutStyles.promoButton}
                onClick={() => console.log('Проверка промокода...')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.4">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#1E1E1E" strokeWidth="1.5"/>
                    <path d="M16 12H8M16 12C16 12.7002 14.0057 14.0085 13.5 14.5M16 12C16 11.2998 14.0057 9.99153 13.5 9.5" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                </svg>
              </button>
            </div>
            <div className={checkoutStyles.priceSummary}>
              <div className={checkoutStyles.priceRow}>
                <span>Цена без скидки</span>
                <span>{totalOldPrice.toLocaleString()} ₽</span>
              </div>
              <div className={checkoutStyles.priceRow}>
                <span>Сэкономили</span>
                <span className={checkoutStyles.savings}>{totalSavings.toLocaleString()} ₽</span>
              </div>
              <div className={`${checkoutStyles.priceRow} ${checkoutStyles.totalPrice}`}>
                <span>Итого</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {checkoutStage === 2 && (
        <DeliveryAddressStep 
        deliveryMethod={deliveryMethod}
        setDeliveryMethod={setDeliveryMethod}
        contactInfo={contactInfo}
        setContactInfo={setContactInfo}
        onNext={onNext}
        />
        )}

      {checkoutStage === 3 && (
        <ProfileEditStep 
          contactInfo={contactInfo}
          handleInputChange={handleInputChange}
          onNext={onNext}
        />
      )}

      {checkoutStage === 4 && (
        <PaymentStep 
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onNext={onNext}
        />
      )}
    </>
  );
};

export default OrderSummaryStages;
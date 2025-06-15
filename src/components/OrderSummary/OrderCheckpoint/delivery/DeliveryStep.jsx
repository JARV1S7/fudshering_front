import React, { useState } from 'react';
import styles from './DeliveryAddressStep.module.css';

const DeliveryStep = ({
  deliveryMethod,
  setDeliveryMethod,
  contactInfo,
  setContactInfo,
  onNext
}) => {
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempCity, setTempCity] = useState('Екатеринбург\nСвердловская область');
  const [tempAddress, setTempAddress] = useState(
    deliveryMethod === 'courier' 
      ? 'ул. Июльская, д.19, кв.56, домофон 3, подъезд 4, этаж 5'
      : 'ул. Примерная, д. 123, ТЦ "Пример"'
  );

  const handleDeliveryChange = (method) => {
    console.log('Changing delivery method to:', method);
    setDeliveryMethod(method);
    setTempAddress(
      method === 'courier' 
        ? 'ул. Июльская, д.19, кв.56, домофон 3, подъезд 4, этаж 5'
        : 'ул. Примерная, д. 123, ТЦ "Пример"'
    );
  };

  const handleAddressChange = (e) => {
    setContactInfo(prev => ({ ...prev, address: e.target.value }));
  };

  const handleCommentChange = (e) => {
    setContactInfo(prev => ({ ...prev, comment: e.target.value }));
  };

  const handleSaveCity = () => {
    setIsEditingCity(false);
  };

  const handleSaveAddress = () => {
    setIsEditingAddress(false);
    setContactInfo(prev => ({ ...prev, address: tempAddress }));
  };

  return (
    <div className={styles.deliveryStep}>
      <div className={styles.locationBlock}>
        {isEditingCity ? (
          <>
            <textarea
              value={tempCity}
              onChange={(e) => setTempCity(e.target.value)}
              className={styles.editInput}
              rows={2}
            />
            <button 
              className={styles.saveButton}
              onClick={handleSaveCity}
            >
              Сохранить
            </button>
          </>
        ) : (
          <>
            <p className={styles.cityText}>{tempCity}</p>
            <button 
              className={styles.changeButton}
              onClick={() => setIsEditingCity(true)}
            >
              Изменить город
            </button>
          </>
        )}
      </div>

      <div className={styles.deliveryMethodBlock}>
        <h2 className={styles.sectionTitle}>Способ получения</h2>
        <div className={styles.methodContainer}>
          <button
            className={`${styles.methodButton} ${deliveryMethod === 'courier' ? styles.active : ''}`}
            onClick={() => handleDeliveryChange('courier')}
          >
            <span className={styles.methodTitle}>Курьер служба доставки</span>
            <span className={styles.methodPrice}>105 ₽</span>
          </button>
          
          <div className={styles.divider}></div>
          
          <button
            className={`${styles.methodButtonpickup} ${deliveryMethod === 'pickup' ? styles.active : ''}`}
            onClick={() => handleDeliveryChange('pickup')}
          >
            <span className={styles.methodTitle}>Самовывоз Магазин</span>
            <span className={styles.methodPrice}>Бесплатно</span>
          </button>
        </div>
      </div>

      <div className={styles.addressBlock}>
        <h2 className={styles.sectionTitle}>Адрес</h2>
        {deliveryMethod === 'courier' ? (
          <>
            {isEditingAddress ? (
              <>
                <textarea
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  className={styles.editInput}
                  rows={3}
                />
                <button 
                  className={styles.saveButton}
                  onClick={handleSaveAddress}
                >
                  Сохранить
                </button>
              </>
            ) : (
              <>
                <p className={styles.addressText}>{tempAddress}</p>
                <button 
                  className={styles.changeButton}
                  onClick={() => setIsEditingAddress(true)}
                >
                  Изменить адрес
                </button>
              </>
            )}
            
            <div className={styles.commentBlock}>
              <h2 className={styles.sectionTitle}>Комментарий</h2>
              <input
                type="text"
                placeholder="Информация для курьера"
                value={contactInfo.comment || ''}
                onChange={handleCommentChange}
                className={styles.commentInput}
              />
            </div>
          </>
        ) : (
          <>
            {isEditingAddress ? (
              <>
                <textarea
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  className={styles.editInput}
                  rows={2}
                />
                <button 
                  className={styles.saveButton}
                  onClick={handleSaveAddress}
                >
                  Сохранить
                </button>
              </>
            ) : (
              <>
                <p className={styles.addressText}>{tempAddress}</p>
                <button 
                  className={styles.changeButton}
                  onClick={() => setIsEditingAddress(true)}
                >
                  Изменить адрес
                </button>
              </>
            )}
            <p className={styles.pickupTime}>Заберите заказ до 23:00</p>
          </>
        )}
      </div>

      {deliveryMethod === 'courier' && (
        <div className={styles.deliveryInfo}>
          <h2 className={styles.sectionTitle}>Доставим с 18:00-19:00</h2>
          <div className={styles.deliveryPrice}>
            <span>доставка</span>
            <span>105 ₽</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryStep;
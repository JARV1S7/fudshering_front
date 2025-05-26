import React, { useState } from 'react';
import styles from './PaymentStep.module.css';

const PaymentStep = ({ paymentMethod, setPaymentMethod, onNext }) => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleAddCard = () => {
    const newCard = {
      id: Date.now(),
      bank: 'Tinkoff',
      lastDigits: '1234',
      type: 'MIR'
    };
    setCards([...cards, newCard]);
    setSelectedCard(newCard.id);
  };

  return (
    <div className={styles.paymentStep}>
      <div className={styles.cardPreview}>
        {selectedCard ? (
          <div className={styles.cardActive}>
            <div className={styles.cardBankLogo}>
              <div className={styles.bankLogo}></div>
            </div>
            <div className={styles.cardNumber}>
              <span>•••• •••• •••• {cards.find(c => c.id === selectedCard)?.lastDigits || '1234'}</span>
            </div>
            <div className={styles.cardType}>
              <span>МИР</span>
            </div>
          </div>
        ) : (
          <div className={styles.cardEmpty}>
            <div className={styles.cardPlaceholder}></div>
            <p>Добавьте карту для оплаты</p>
          </div>
        )}
      </div>

      <div className={styles.paymentOptions}>
        <h3 className={styles.optionsTitle}>Способ оплаты</h3>
        
        {cards.map(card => (
          <div 
            key={card.id} 
            className={`${styles.paymentOption} ${selectedCard === card.id ? styles.selected : ''}`}
            onClick={() => setSelectedCard(card.id)}
          >
            <div className={styles.optionRadio}>
              {selectedCard === card.id && <div className={styles.radioChecked}></div>}
            </div>
            <div className={styles.optionIcon}>
              <div className={styles.bankIcon}></div>
            </div>
            <div className={styles.optionText}>
              {card.bank} •••• {card.lastDigits}
            </div>
          </div>
        ))}

        <div 
          className={`${styles.paymentOption} ${paymentMethod === 'sbp' ? styles.selected : ''}`}
          onClick={() => {
            setPaymentMethod('sbp');
            setSelectedCard(null);
          }}
        >
          <div className={styles.optionRadio}>
            {paymentMethod === 'sbp' && <div className={styles.radioChecked}></div>}
          </div>
          <div className={styles.optionIcon}>
            <div className={styles.sbpIcon}></div>
          </div>
          <div className={styles.optionText}>СБП</div>
        </div>

        <div 
          className={styles.paymentOption}
          onClick={handleAddCard}
        >
          <div className={styles.optionRadio}>
            <div className={styles.plusIcon}>+</div>
          </div>
          <div className={styles.optionText}>Добавить карту</div>
        </div>

        <div 
          className={`${styles.paymentOption} ${paymentMethod === 'cash' ? styles.selected : ''}`}
          onClick={() => {
            setPaymentMethod('cash');
            setSelectedCard(null);
          }}
        >
          <div className={styles.optionRadio}>
            {paymentMethod === 'cash' && <div className={styles.radioChecked}></div>}
          </div>
          <div className={styles.optionText}>Оплата наличными</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
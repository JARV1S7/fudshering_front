import React, { useState } from 'react';
import { TinkoffIcon, SberIcon, SbpIcon, PlusIcon, MirIcon, AlfabankIcon, VtbIcon} from '../Icons/Icons';
import styles from './PaymentStep.module.css';

const PaymentStep = ({ paymentMethod, setPaymentMethod, onNext }) => {
  const [cards, setCards] = useState([{
    id: 1,
    bank: 'Sberbank',
    lastDigits: '5536',
    type: 'MIR',
    fullNumber: '5536000011112222',
    expiry: '12/25',
    cvv: '123'
  }]);
  const [selectedCard, setSelectedCard] = useState(1);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardForm, setCardForm] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });
  const [showMenuForCard, setShowMenuForCard] = useState(null);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/[^0-9]/g, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  const formatCvv = (value) => {
    return value.replace(/[^0-9]/g, '').substring(0, 3);
  };

  const handleAddCard = () => {
    setEditingCard(null);
    setCardForm({ number: '', expiry: '', cvv: '' });
    setShowAddCardModal(true);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setCardForm({
      number: card.fullNumber,
      expiry: card.expiry,
      cvv: card.cvv
    });
    setShowAddCardModal(true);
  };

  const handleDeleteCard = (cardId) => {
    setCards(cards.filter(card => card.id !== cardId));
    if (selectedCard === cardId) {
      setSelectedCard(null);
      setPaymentMethod('sbp');
    }
  };

  const handleCloseModal = () => {
    setShowAddCardModal(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'number') {
      setCardForm(prev => ({ ...prev, [name]: formatCardNumber(value) }));
    } else if (name === 'expiry') {
      setCardForm(prev => ({ ...prev, [name]: formatExpiry(value) }));
    } else if (name === 'cvv') {
      setCardForm(prev => ({ ...prev, [name]: formatCvv(value) }));
    }
  };

const detectBankByBin = (cardNumber) => {
  const bin = cardNumber.replace(/\s/g, '').substring(0, 6);
  
  const bankBins = {
    // MIR (не зависит от банка)
    '2200': 'MIR', '2201': 'MIR', '2202': 'MIR', '2203': 'MIR', '2204': 'MIR',
    
    // Tinkoff
    '5211': 'Tinkoff', '4377': 'Tinkoff', '5489': 'Tinkoff',
    
    // Sberbank
    '4276': 'Sberbank', '5469': 'Sberbank', '5479': 'Sberbank', '5536': 'Sberbank',
    
    // Alfabank
    '4154': 'Alfabank', '4314': 'Alfabank', '4427': 'Alfabank',
    
    // VTB
    '4478': 'VTB', '4622': 'VTB', '4527': 'VTB',
    
    // Gazprombank
    '4475': 'Gazprombank', '4481': 'Gazprombank', '4724': 'Gazprombank',
    
    // Райффайзенбанк
    '4627': 'Raiffeisen', '5189': 'Raiffeisen',
    
  };

    return bankBins[bin] || 'MIR';
  };

  const handleSubmitCard = () => {
    if (cardForm.number.replace(/\s/g, '').length !== 16) {
      alert('Номер карты должен содержать 16 цифр');
      return;
    }
    
    if (cardForm.expiry.length !== 5) {
      alert('Укажите полный срок действия карты (ММ/ГГ)');
      return;
    }
    
    if (cardForm.cvv.length !== 3) {
      alert('CVV код должен содержать 3 цифры');
      return;
    }

    if (editingCard) {
    // Обновление существующей карты
    const updatedCards = cards.map(card => 
      card.id === editingCard.id ? { 
        ...card,
        fullNumber: cardForm.number.replace(/\s/g, ''),
        lastDigits: cardForm.number.slice(-4),
        expiry: cardForm.expiry,
        cvv: cardForm.cvv
      } : card
    );
    setCards(updatedCards);
    } else {
      // Добавление новой карты
      const cleanNumber = cardForm.number.replace(/\s/g, '');
      const bank = detectBankByBin(cleanNumber);
      
      const newCard = {
        id: Date.now(),
        bank: bank,
        lastDigits: cleanNumber.slice(-4),
        type: 'MIR', // Все карты теперь только МИР
        fullNumber: cleanNumber,
        expiry: cardForm.expiry,
        cvv: cardForm.cvv
      };
      
      setCards([...cards, newCard]);
      setSelectedCard(newCard.id);
      setPaymentMethod('card');
    }
    
    setShowAddCardModal(false);
  };

const toggleMenu = (cardId, e) => {
    e.stopPropagation();
    setShowMenuForCard(showMenuForCard === cardId ? null : cardId);
  };

  return (
    <div className={styles.paymentStep}>
      {/* Карта для оплаты */}
      <div className={styles.cardPreview}>
        {selectedCard ? (
          <div className={styles.cardActive}>
            <div className={styles.cardBankLogo}>
              <div className={styles.bankLogo}></div>
            </div>
            <div className={styles.cardNumber}>
              <span>•• {cards.find(c => c.id === selectedCard)?.lastDigits || '4211'}</span>
              <div className={styles.cardType}>
                <MirIcon />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.cardEmpty}>
            <div className={styles.cardPlaceholder}></div>
            <p>Добавьте карту для оплаты</p>
          </div>
        )}
      </div>

      {/* Способы оплаты */}
      <div className={styles.paymentOptions}>
        {cards.map(card => (
          <div
            key={card.id}
            className={`${styles.paymentOption} ${selectedCard === card.id ? styles.selected : ''}`}
            onClick={() => {
              setSelectedCard(card.id);
              setPaymentMethod('card');
              setShowMenuForCard(null);
            }}
          >
            <div className={styles.boxRadio}>
              <div className={styles.optionRadio}>
                {selectedCard === card.id && <div className={styles.radioChecked}></div>}
              </div>
            </div>
            
            <div className={styles.optionText}>
              {card.bank} •••• {card.lastDigits}
            </div>
            
            <div className={styles.cardMenuButton} onClick={(e) => toggleMenu(card.id, e)}>
              <div className={styles.menuDots}>⋮</div>
              {showMenuForCard === card.id && (
                <div className={styles.cardMenu}>
                  <button
                    className={styles.menuItem}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCard(card);
                    }}
                  >
                    Редактировать
                  </button>
                  <button
                    className={`${styles.menuItem} ${styles.menuItemDelete}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCard(card.id);
                    }}
                  >
                    Удалить
                  </button>
                </div>
              )}
            </div>
            
            <div className={styles.optionIcon}>
              {card.bank === 'Tinkoff' ? (
                <TinkoffIcon />
              ) : card.bank === 'Sberbank' ? (
                <SberIcon />
              ) : card.bank === 'Alfabank' ? (
                <AlfabankIcon />
              ) : card.bank === 'VTB' ? (
                <VtbIcon />
              ) : (
                <MirIcon />
              )}
            </div>
          </div>
        ))}

        {/* СБП */}
        <div
          className={`${styles.paymentOption} ${paymentMethod === 'sbp' ? styles.selected : ''}`}
          onClick={() => {
            setPaymentMethod('sbp');
            setSelectedCard(null);
          }}
        >
          <div className={styles.boxRadio}>
            <div className={styles.optionRadio}>
              {paymentMethod === 'sbp' && <div className={styles.radioChecked}></div>}
            </div>
          </div>
          <div className={styles.optionText}>СБП</div>
          <div className={styles.optionIcon}>
            <SbpIcon />
          </div>
        </div>

        {/* SberPay */}
        <div
          className={`${styles.paymentOption} ${paymentMethod === 'sberpay' ? styles.selected : ''}`}
          onClick={() => {
            setPaymentMethod('sberpay');
            setSelectedCard(null);
          }}
        >
          <div className={styles.boxRadio}>
            <div className={styles.optionRadio}>
              {paymentMethod === 'sberpay' && <div className={styles.radioChecked}></div>}
            </div>
          </div>
          <div className={styles.optionText}>SberPay</div>
          <div className={styles.optionIcon}>
            <SberIcon />
          </div>
        </div>

        {/* TinkoffPay */}
        <div
          className={`${styles.paymentOption} ${paymentMethod === 'tinkoffpay' ? styles.selected : ''}`}
          onClick={() => {
            setPaymentMethod('tinkoffpay');
            setSelectedCard(null);
          }}
        >
          <div className={styles.boxRadio}>
            <div className={styles.optionRadio}>
              {paymentMethod === 'tinkoffpay' && <div className={styles.radioChecked}></div>}
            </div>
          </div>
          <div className={styles.optionText}>TinkoffPay</div>
          <div className={styles.optionIcon}>
            <TinkoffIcon />
          </div>
        </div>

        {/* Добавить карту */}
        <div
          className={styles.paymentOption}
          onClick={handleAddCard}
        >
          <div className={styles.boxRadio}>
            <div className={styles.optionRadio}></div>
          </div>
          <div className={styles.optionText}>Добавить карту</div>
          <div className={styles.optionIcon}>
            <PlusIcon />
          </div>
        </div>

        {/* Оплата наличными */}
        <div 
          className={`${styles.paymentOption} ${paymentMethod === 'cash' ? styles.selected : ''}`}
          onClick={() => {
            setPaymentMethod('cash');
            setSelectedCard(null);
          }}
        >
          <div className={styles.boxRadio}>
            <div className={styles.optionRadio}>
              {paymentMethod === 'cash' && <div className={styles.radioChecked}></div>}
            </div>
          </div>
          <div className={styles.optionText}>Оплата наличными</div>
          <div className={styles.optionIcon}>
            <PlusIcon />
          </div>
        </div>
      </div>

      {/* Модальное окно добавления карты */}
      {showAddCardModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{editingCard ? 'Редактирование карты' : 'Добавление новой карты'}</h3>
            <div className={styles.formGroup}>
              <label>Номер карты</label>
              <input 
                type="text" 
                name="number"
                value={cardForm.number}
                onChange={handleFormChange}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Срок действия (ММ/ГГ)</label>
              <input 
                type="text" 
                name="expiry"
                value={cardForm.expiry}
                onChange={handleFormChange}
                placeholder="ММ/ГГ"
                maxLength={5}
              />
            </div>
            <div className={styles.formGroup}>
              <label>CVV/CVC</label>
              <input 
                type="text" 
                name="cvv"
                value={cardForm.cvv}
                onChange={handleFormChange}
                placeholder="123"
                maxLength={3}
              />
            </div>
            <div className={styles.modalButtons}>
              <button className={styles.cancelButton} onClick={handleCloseModal}>
                Отмена
              </button>
              {editingCard && (
                <button 
                  className={styles.deleteButton}
                  onClick={() => {
                    handleDeleteCard(editingCard.id);
                    handleCloseModal();
                  }}
                >
                  Удалить
                </button>
              )}
              <button className={styles.submitButton} onClick={handleSubmitCard}>
                {editingCard ? 'Сохранить' : 'Добавить карту'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStep;
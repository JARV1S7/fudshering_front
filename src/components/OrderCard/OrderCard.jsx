import React from 'react';
import PropTypes from 'prop-types';
import styles from './OrderCard.module.css';
import '../../style.css'

const OrderCard = ({
  orderNumber,
  status,
  pickupTime,
  date, 
  image,
  isHistory = false,
  onClick
}) => {
  const statusClass = {
    'Готов к выдаче': styles.statusReady,
    'Получен': styles.statusReceived,
    'Готовится': styles.statusPreparing,
    'Оформлен': styles.statusProcessed
  }[status] || '';

  return (
    <div className={styles.orderCard} onClick={onClick}>
      <img 
        src={image} 
        alt="Order" 
        className={styles.orderImage} 
        onError={(e) => e.target.src = '/image/default-restaurant.png'} 
      />
      
      <div className={styles.orderInfo}>
        <h3 className={styles.orderNumber}>{orderNumber}</h3>
        <p className={`${styles.orderStatus} ${statusClass}`}>
          {status}
        </p>
        
        {isHistory ? (
          <p className={styles.orderDate}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 2.33301V4.66634M7 2.33301V4.66634" stroke="#2E2E2E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2.91699 14.2837C2.91699 9.20026 2.91699 6.65849 4.3778 5.07925C5.83861 3.5 8.18973 3.5 12.892 3.5H15.1087C19.8109 3.5 22.1621 3.5 23.6229 5.07925C25.0837 6.65849 25.0837 9.20026 25.0837 14.2837V14.8829C25.0837 19.9664 25.0837 22.5081 23.6229 24.0875C22.1621 25.6667 19.8109 25.6667 15.1087 25.6667H12.892C8.18973 25.6667 5.83861 25.6667 4.3778 24.0875C2.91699 22.5081 2.91699 19.9664 2.91699 14.8829V14.2837Z" stroke="#2E2E2E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.5 9.33301H24.5" stroke="#2E2E2E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {date}</p>
        ) : (
          <p className={styles.orderTime}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 8.16667V14H19.8333M14 24.5C8.20101 24.5 3.5 19.799 3.5 14C3.5 8.20101 8.20101 3.5 14 3.5C19.799 3.5 24.5 8.20101 24.5 14C24.5 19.799 19.799 24.5 14 24.5Z" stroke="#2E2E2E" stroke-width="2.44444" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {pickupTime}</p>
        )}
      </div>
      
      <svg
        className={styles.orderArrow}
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M12 24L20 16L12 8"
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

OrderCard.propTypes = {
  orderNumber: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  pickupTime: PropTypes.string.isRequired,
  date: PropTypes.string,
  image: PropTypes.string.isRequired,
  isHistory: PropTypes.bool,
  onClick: PropTypes.func,
};

export default OrderCard;
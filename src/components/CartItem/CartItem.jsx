import React from 'react';
import PropTypes from 'prop-types';
import styles from './CartItem.module.css';

const CartItem = ({ product, onIncrease, onDecrease, onRemove }) => {
  const oldPrice = product.oldPrice ?? 0;
  const price = product.price ?? 0;
  const quantity = product.quantity ?? 0;
  const savings = (oldPrice * quantity) - (price * quantity);
  const imageSrc = product.image ? '/image/product1.png' : '';

  return (
    <div className={styles.cartItem}>
      <img src={imageSrc} alt={product.name} className={styles.productImage} />

      <div className={styles.topRow}>
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{product.name}</h3>
        </div>
        <button className={styles.menuButton} onClick={onRemove}>Удалить</button>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.quantityControls}>
          <button className={styles.quantityButton} onClick={onDecrease}>-</button>
          <span className={styles.quantityValue}>{quantity}</span>
          <button className={styles.quantityButton} onClick={onIncrease}>+</button>
        </div>
        <div className={styles.priceBlock}>
          <div className={styles.savingsText}>Сэкономлено: {savings.toLocaleString()} ₽</div>
          <div className={styles.priceSum}>
            <span className={styles.oldPrice}>{(oldPrice * quantity).toLocaleString()} ₽</span>
            <span className={styles.currentPrice}>{(price * quantity).toLocaleString()} ₽</span>
          </div>
        </div>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    price: PropTypes.number.isRequired,
    oldPrice: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CartItem;
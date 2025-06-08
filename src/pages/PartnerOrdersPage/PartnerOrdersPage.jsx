import React, { useState } from 'react';
import OrderCard from '../../components/OrderCard/OrderCard';
import styles from './PartnerOrdersPage.module.css';
import '../../style.css'

const PartnerOrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: '№123456',
      status: 'Готов к выдаче',
      pickupTime: 'до 15:30',
      customerName: 'Иван Иванов',
      totalAmount: 1250,
      discountAmount: 250,
      items: [
        { name: 'Пицца Пепперони', price: 650, quantity: 1 },
        { name: 'Салат Цезарь', price: 350, quantity: 1 },
        { name: 'Кола', price: 150, quantity: 2 }
      ]
    },
    {
      id: 2,
      orderNumber: '№123457',
      status: 'Готовится',
      pickupTime: 'до 16:45',
      customerName: 'Мария Петрова',
      totalAmount: 890,
      discountAmount: 90,
      items: [
        { name: 'Суши сет', price: 790, quantity: 1 },
        { name: 'Мисо суп', price: 190, quantity: 1 }
      ]
    },
    {
      id: 3,
      orderNumber: '№123458',
      status: 'Оформлен',
      pickupTime: 'до 17:30',
      customerName: 'Алексей Смирнов',
      totalAmount: 2100,
      discountAmount: 300,
      items: [
        { name: 'Стейк Рибай', price: 1200, quantity: 1 },
        { name: 'Картофель печеный', price: 250, quantity: 1 },
        { name: 'Вино красное', price: 650, quantity: 1 }
      ]
    }
  ]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setSelectedOrder(null);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.ordersList}>
        <h1 className={styles.pageTitle}>Активные заказы</h1>
        {orders.map(order => (
          <OrderCard
            key={order.id}
            orderNumber={order.orderNumber}
            status={order.status}
            pickupTime={order.pickupTime}
            image="/image/order-placeholder.png"
            onClick={() => handleOrderClick(order)}
          />
        ))}
      </div>

      {selectedOrder && (
        <div className={styles.OrderBack}>
            <div className={styles.orderDetails}>
            <div className={styles.detailsHeader}>
                <h2>Заказ {selectedOrder.orderNumber}</h2>
                <button 
                className={styles.closeButton}
                onClick={closeOrderDetails}
                >
                ×
                </button>
            </div>

            <div className={styles.customerInfo}>
                <h3>{selectedOrder.customerName}</h3>
                <p className={styles.statusBadge}>{selectedOrder.status}</p>
            </div>

            <div className={styles.orderItems}>
                <h4>Состав заказа:</h4>
                <ul>
                {selectedOrder.items.map((item, index) => (
                    <li key={index} className={styles.orderItem}>
                    <span>{item.name}</span>
                    <span>{item.quantity} × {item.price} ₽</span>
                    </li>
                ))}
                </ul>
            </div>

            <div className={styles.orderSummary}>
                <div className={styles.summaryRow}>
                <span>Сумма:</span>
                <span>{selectedOrder.totalAmount + selectedOrder.discountAmount} ₽</span>
                </div>
                <div className={styles.summaryRow}>
                <span>Скидка:</span>
                <span>-{selectedOrder.discountAmount} ₽</span>
                </div>
                <div className={styles.summaryRowTotal}>
                <span>Итого:</span>
                <span>{selectedOrder.totalAmount} ₽</span>
                </div>
            </div>

            <div className={styles.actionButtons}>
                {selectedOrder.status === 'Оформлен' && (
                <button 
                    className={styles.actionButton}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'Готовится')}
                >
                    Начать приготовление
                </button>
                )}
                {selectedOrder.status === 'Готовится' && (
                <button 
                    className={styles.actionButton}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'Готов к выдаче')}
                >
                    Завершить приготовление
                </button>
                )}
                {selectedOrder.status === 'Готов к выдаче' && (
                <button 
                    className={styles.actionButton}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'Получен')}
                >
                    Подтвердить выдачу
                </button>
                )}
            </div>
            </div>
        </div>
      )}
    </div>  
  );
};

export default PartnerOrdersPage;
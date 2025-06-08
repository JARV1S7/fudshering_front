import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OrdersPage.module.css';
import OrderCard from '../../components/OrderCard/OrderCard';
import OrderMap from '../../components/OrderMap/OrderMap';

const OrdersPage = () => {
  const navigate = useNavigate();
  
  const orders = [
    {
      id: 1,
      orderNumber: 'Заказ #1224-3234',
      status: 'Готов к выдаче',
      pickupTime: 'до 23:00',
      date: '30.11.2024',
      image: '/image/product1.png',
      restaurant: {
        name: 'Вилка Ложка',
        address: 'ул. Малышева, д. 136',
        image: '/images/restaurant1.jpg',
        workingHours: '23:00',
        originalPrice: '1 380',
        discount: '600',
        totalPrice: '780',
        coordinates: [56.838011, 60.597465] // Координаты для карты
      }
    },
    {
      id: 2,
      orderNumber: 'Заказ #5678-9012',
      status: 'Получен',
      date: '29.11.2024',
      image: '/image/product1.png',
      restaurant: {
        name: 'Burger King',
        address: 'ул. Пушкина, д. 10',
        image: '/images/restaurant2.jpg',
        workingHours: '20:00',
        coordinates: [56.835432, 60.612345] // Координаты для карты
      }
    }
  ];

  const isHistoryView = window.location.pathname === '/order-history';
  const filteredOrders = isHistoryView 
    ? orders.filter(order => order.status === 'Получен')
    : orders.filter(order => order.status !== 'Получен');

  const [selectedOrder, setSelectedOrder] = React.useState(filteredOrders[0] || null);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {isHistoryView ? 'История заказов' : 'Заказы'}
      </h1>
      
      <div className={styles.content}>
        <div className={styles.ordersList}>
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              orderNumber={order.orderNumber}
              status={order.status}
              pickupTime={order.pickupTime}
              date={order.date}
              image={order.image}
              isHistory={isHistoryView}
              onClick={() => setSelectedOrder(order)}
            />
          ))}
        </div>
        
        {selectedOrder && (
          <div className={styles.mapBackground}>
            <div className={styles.mapSection}>
              <OrderMap 
                restaurant={selectedOrder.restaurant} 
                isHistoryView={isHistoryView} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
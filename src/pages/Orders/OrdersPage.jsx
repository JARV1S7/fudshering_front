import React, { useEffect, useState } from 'react';
import styles from './OrdersPage.module.css';
import OrderCard from '../../components/OrderCard/OrderCard';
import OrderMap from '../../components/OrderMap/OrderMap';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const isHistoryView = window.location.pathname === '/order-history';
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Необходима авторизация');
        const res = await fetch('http://localhost:8080/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Ошибка загрузки заказов');
        const data = await res.json();

        console.log('Полученные с бэкенда заказы:', data);

        setOrders(data);
        setSelectedOrder(data[0] || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Загрузка заказов...</p>;

  const filteredOrders = isHistoryView
    ? orders.filter(order => order.status?.toUpperCase() === 'RECEIVED')
    : orders.filter(order => order.status?.toUpperCase() !== 'RECEIVED');

  const translateStatus = (status) => {
    if (!status) return '';
    switch(status.toUpperCase().trim()) {
      case 'REGISTERED': return 'Оформлен';
      case 'INPROCESS': return 'Готовится';
      case 'READY': return 'Готов к выдаче';
      case 'RECEIVED': return 'Получен';
      default: return status;
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('ru-RU');
  };

  const formatPickupTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return `до ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {isHistoryView ? 'История заказов' : 'Заказы'}
      </h1>

      <div className={styles.content}>
        <div className={styles.ordersList}>
          {filteredOrders.length === 0 ? (
            <p>Заказы отсутствуют</p>
          ) : (
            filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                orderNumber={`Заказ #${order.id}`}
                status={translateStatus(order.status)}
                pickupTime={formatPickupTime(order.createdAt)}
                date={formatDate(order.createdAt)}
                image={order.restaurant?.image || '/image/product1.png'}
                isHistory={isHistoryView}
                onClick={() => setSelectedOrder(order)}
              />
            ))
          )}
        </div>

        {selectedOrder && (
          <div className={styles.mapBackground}>
            <div className={styles.mapSection}>
              <OrderMap
                restaurant={{
                  name: selectedOrder.restaurant?.name || 'Название магазина',
                  address: selectedOrder.restaurant?.address || 'Адрес магазина',
                  image: selectedOrder.restaurant?.image || '/image/default-restaurant.png',
                  workingHours: selectedOrder.restaurant?.workingHours || '',
                  originalPrice: (selectedOrder.finalPrice || 0) + (selectedOrder.discountPrice || 0),
                  discount: selectedOrder.discountPrice || 0,
                  totalPrice: selectedOrder.finalPrice || 0,
                  coordinates: selectedOrder.restaurant?.coordinates || [56.837350, 60.620840]
                }}
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
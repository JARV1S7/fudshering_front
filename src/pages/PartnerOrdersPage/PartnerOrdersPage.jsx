import React, { useEffect, useState } from 'react';
import OrderCard from '../../components/OrderCard/OrderCard';
import styles from './PartnerOrdersPage.module.css';
import '../../style.css';

const PartnerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Необходима авторизация');

        const ordersRes = await fetch('http://89.111.154.66:8080/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!ordersRes.ok) throw new Error('Ошибка загрузки заказов');
        const ordersData = await ordersRes.json();

        const shopsRes = await fetch('http://89.111.154.66:8080/shops', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!shopsRes.ok) throw new Error('Ошибка загрузки магазинов');
        const shopsData = await shopsRes.json();

        const allFoods = shopsData.food || [];

        setOrders(ordersData);
        setFoods(allFoods);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const translateStatus = (status) => {
    if (!status) return '';
    switch(status.toUpperCase().trim()) {
      case 'REGISTERED': return 'Оформлен';
      case 'PROCESS': return 'Готовится';
      case 'READY': return 'Готов к выдаче';
      case 'RECEIVED': return 'Получен';
      default: return status;
    }
  };

  const handleOrderClick = async (order) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Необходима авторизация');

      const res = await fetch(`http://89.111.154.66:8080/orders/${order.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Ошибка загрузки заказа');
      const orderDetails = await res.json();

      const itemsWithDetails = orderDetails.items.map(item => {
        const food = foods.find(f => f.id === item.foodId);
        return {
          ...item,
          name: food?.name || 'Неизвестный товар',
          price: food?.originalPrice || 0,
        };
      });

      setSelectedOrder({ ...orderDetails, items: itemsWithDetails });
    } catch (error) {
      console.error(error);
      alert('Не удалось загрузить детали заказа');
    }
  };

  const updateOrderStatus = async (orderId, newStatusUrl) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Необходима авторизация');

      const res = await fetch(`http://89.111.154.66:8080/orders/${orderId}/${newStatusUrl}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Ошибка обновления статуса');

      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatusUrl.toUpperCase() } : order
      ));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatusUrl.toUpperCase() });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.ordersList}>
        <h1 className={styles.pageTitle}>Активные заказы</h1>
        {orders.length === 0 && <p>Заказы отсутствуют</p>}
        {orders.map(order => {
        const createdAtDate = order.createdAt ? new Date(order.createdAt) : null;
        const formattedDate = createdAtDate
          ? createdAtDate.toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
          : '';

        return (
          <OrderCard
            key={order.id}
            orderNumber={`№${order.id}`}
            status={translateStatus(order.status)}
            pickupTime={order.pickupTime || ''}
            date={formattedDate}
            image="/image/order-placeholder.png"
            isHistory={true}
            onClick={() => handleOrderClick(order)}
          />
        );
      })}
      </div>

      {selectedOrder && (
        <div className={styles.OrderBack}>
          <div className={styles.orderDetails}>
            <div className={styles.detailsHeader}>
              <h2>Заказ №{selectedOrder.id}</h2>
              <button className={styles.closeButton} onClick={() => setSelectedOrder(null)}>×</button>
            </div>

            <div className={styles.customerInfo}>
              <p className={styles.statusBadge}>{translateStatus(selectedOrder.status)}</p>
            </div>

            <div className={styles.orderItems}>
              <h4>Состав заказа:</h4>
              <ul>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, index) => (
                    <li key={index} className={styles.orderItem}>
                      <span>{item.name}</span>
                      <span>{item.quantity} × {item.price} ₽</span>
                    </li>
                  ))
                ) : (
                  <li>Нет товаров в заказе</li>
                )}
              </ul>
            </div>

            <div className={styles.orderSummary}>
              <div className={styles.summaryRow}>
                <span>Цена без скидки:</span>
                <span>{(selectedOrder.finalPrice + selectedOrder.discountPrice) || 0} ₽</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Скидка:</span>
                <span>-{selectedOrder.discountPrice || 0} ₽</span>
              </div>
              <div className={styles.summaryRowTotal}>
                <span>Итого:</span>
                <span>{selectedOrder.finalPrice || 0} ₽</span>
              </div>
            </div>

            <div className={styles.actionButtons}>
              {translateStatus(selectedOrder.status) === 'Оформлен' && (
                <button
                  className={styles.actionButton}
                  onClick={() => updateOrderStatus(selectedOrder.id, 'process')}
                >
                  Начать приготовление
                </button>
              )}
              {translateStatus(selectedOrder.status) === 'Готовится' && (
                <button
                  className={styles.actionButton}
                  onClick={() => updateOrderStatus(selectedOrder.id, 'ready')}
                >
                  Завершить приготовление
                </button>
              )}
              {translateStatus(selectedOrder.status) === 'Готов к выдаче' && (
                <button
                  className={styles.actionButton}
                  onClick={() => updateOrderStatus(selectedOrder.id, 'received')}
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
import React, { useEffect, useRef } from 'react';
import styles from './OrderMap.module.css';

const OrderMap = ({ restaurant, isHistoryView }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const placemark = useRef(null);

  useEffect(() => {
    const loadYaMap = () => {
      if (window.ymaps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU';
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(initMap);
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      const { ymaps } = window;
      const coordinates = restaurant.coordinates || [56.837350, 60.620840];

      mapInstance.current = new ymaps.Map(mapRef.current, {
        center: coordinates,
        zoom: 15,
        controls: [],
        suppressMapOpenBlock: true
      });

      placemark.current = new ymaps.Placemark(coordinates, {
        hintContent: restaurant.name,
        balloonContent: restaurant.address
      }, {
        iconLayout: 'default#image',
        iconImageHref: '/map-marker.png',
        iconImageSize: [40, 40],
        iconImageOffset: [-20, -40]
      });

      mapInstance.current.geoObjects.add(placemark.current);
    };

    loadYaMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, [restaurant]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.mapContainer} ref={mapRef}></div>
      
      <div className={styles.infoContainer}>
        <div className={styles.restaurantInfo}>
            <img 
              src={restaurant.image || '/image/image_shop/vilka.png'} 
              alt={restaurant.name} 
              className={styles.restaurantImage}
              onError={(e) => e.target.src = '/image/image_shop/vilka.png'}
            />
            <div className={styles.restaurantDetails}>
              <h3 className={styles.restaurantName}>{restaurant.name}</h3>
              <p className={styles.restaurantAddress}>{restaurant.address}</p>
            </div>
          </div>
        {!isHistoryView ? (
          <div>
            <p className={styles.pickupTime}>
                <span className={styles.clockIcon}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 8.16667V14H19.8333M14 24.5C8.20101 24.5 3.5 19.799 3.5 14C3.5 8.20101 8.20101 3.5 14 3.5C19.799 3.5 24.5 8.20101 24.5 14C24.5 19.799 19.799 24.5 14 24.5Z" stroke="#2E2E2E" stroke-width="2.44444" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span> 
                Можно забрать до {restaurant.workingHours}
            </p>
          </div>
          
        ) : (
          <div className={styles.orderSummary}>
            <h3 className={styles.summaryTitle}>Сумма заказа</h3>
            <div className={styles.priceDetails}>
              <div className={styles.priceRow}>
                <span>Цена без скидки</span>
                <span>{restaurant.originalPrice || '1 380'} ₽</span>
              </div>
              <div className={styles.priceRow}>
                <span>Скидка</span>
                <span className={styles.discount}>-{restaurant.discount || '600'} ₽</span>
              </div>
            </div>
            <div className={styles.totalRow}>
              <span>Итого</span>
              <span className={styles.totalPrice}>{restaurant.totalPrice || '780'} ₽</span>
            </div>
            <button className={styles.repeatButton}>
              Повторить заказ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderMap;
import React from 'react';
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';
import { restaurants } from '../../data/restaurants';
import { useFavorites } from '../../contexts/FavoritesContext';
import styles from './Favorites.module.css';

const FavoritesPage = () => {
  const { favorites } = useFavorites();

  const favoriteRestaurants = restaurants.filter(restaurant => 
    favorites.includes(restaurant.id)
  );

  return (
    <div className={styles.favoritesPage}>
      <h1>Любимые магазины</h1>
      <div className={styles.favoritesContainer}>
        {favoriteRestaurants.length > 0 ? (
          favoriteRestaurants.map(restaurant => (
            <RestaurantCard
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              ordersCount={restaurant.ordersCount}
              imageUrl={restaurant.imageUrl}
              isFavorite={true}
            />
          ))
        ) : (
          <p className={styles.emptyMessage}>У вас пока нет избранных магазинов</p>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
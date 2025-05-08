import React from 'react';
import { useFavorites } from '../../contexts/FavoritesContext';
import ProductCard from '../../components/ProductCard/ProductCard';

export default function Favorites() {
  const { favorites, removeFromFavorites } = useFavorites();

  return (
    <div className="favorites-page">
      <h1>Избранное</h1>
      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <p>Список избранного пуст</p>
          <Link to="/catalog">Перейти в каталог</Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              onRemove={removeFromFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
}
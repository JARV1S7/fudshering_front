import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Пример иконки

export default function SearchBar({ placeholder = 'Поиск...' }) {
  return (
    <div className="search-bar-container">
      <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        className="search-input"
      />
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import styles from '../Header.module.css';

const SearchBar = ({ isPartnerPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const searchRef = useRef(null);
  const highlightRefs = useRef([]);

  // Очищаем предыдущие подсветки
  const clearHighlights = () => {
    highlightRefs.current.forEach(({ marker }) => {
      if (marker && marker.parentNode) {
        marker.parentNode.replaceChild(marker.node, marker);
      }
    });
    highlightRefs.current = [];
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const highlightText = (node, searchText) => {
    const regex = new RegExp(`(${escapeRegExp(searchText)})`, 'gi');
    let hasHighlight = false;

    // Рекурсивно обходим все текстовые узлы
    const walk = (node) => {
      // Пропускаем элементы, которые не должны быть обработаны
      if (node.nodeType === Node.ELEMENT_NODE && 
          ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'BUTTON'].includes(node.tagName)) {
        return;
      }

      if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
        const text = node.nodeValue;
        const matches = text.match(regex);
        
        if (matches) {
          hasHighlight = true;
          const parent = node.parentNode;
          const fragment = document.createDocumentFragment();
          let lastIndex = 0;
          
          matches.forEach((match) => {
            const index = text.indexOf(match, lastIndex);
            
            // Добавляем текст до совпадения
            if (index > lastIndex) {
              fragment.appendChild(document.createTextNode(text.substring(lastIndex, index)));
            }
            
            // Добавляем подсвеченное совпадение
            const span = document.createElement('span');
            span.className = styles.highlight;
            span.textContent = match;
            fragment.appendChild(span);
            
            lastIndex = index + match.length;
          });
          
          // Добавляем оставшийся текст
          if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
          }
          
          // Сохраняем оригинальный узел для восстановления
          highlightRefs.current.push({
            marker: document.createComment('highlight-marker'),
            node: node
          });
          
          // Заменяем текстовый узел на фрагмент с подсветкой
          parent.insertBefore(highlightRefs.current[highlightRefs.current.length - 1].marker, node);
          parent.replaceChild(fragment, node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walk);
      }
    };

    walk(node);
    return hasHighlight;
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const performSearch = () => {
    clearHighlights();
    
    if (!searchQuery.trim()) {
      setSearchMessage('Введите поисковый запрос');
      setShowResults(true);
      return;
    }

    const found = highlightText(document.body, searchQuery);

    if (found) {
      setSearchMessage('');
      // Прокручиваем к первому подсвеченному элементу
      const firstHighlight = document.querySelector(`.${styles.highlight}`);
      if (firstHighlight) {
        firstHighlight.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    } else {
      setSearchMessage('Ничего не найдено');
    }

    setShowResults(true);
  };

  const handleIconClick = () => {
    performSearch();
  };

  useEffect(() => {
    return () => {
      // Очищаем подсветки при размонтировании компонента
      clearHighlights();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isPartnerPage) return null;

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <form className={styles.searchBar} onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Найти..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
        />
        <div className={styles.searchIcon} onClick={handleIconClick}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 14L20 20M9 16C5.13401 16 2 12.866 2 9C2 5.13401 5.13401 2 9 2C12.866 2 16 5.13401 16 9C16 12.866 12.866 16 9 16Z" stroke="#1E1E1E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </form>

      {showResults && searchMessage && (
        <div className={styles.searchResults}>
          <div className={styles.searchMessage}>
            {searchMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
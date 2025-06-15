import React, { useState } from 'react';
import { productCategories } from '../../data/categories';
import styles from './AddProductModal.module.css';

const categoryEnumMap = {
  1: 'BAKERY',
  2: 'DESSERTS',
  3: 'FREEZING',
  4: 'SALADS',
  5: 'BREAD',
  6: 'BOWLS',
  7: 'GARNISH',
  8: 'POKE',
  9: 'OTHER',
};

const ProductModal = ({
  mode = 'add',
  product = {},
  onClose,
  onSave,
  shopId
}) => {
  const [formData, setFormData] = useState(() => {
    if (mode === 'edit') {
      return {
        name: product.name || '',
        categoryId: productCategories.find(c => c.name === product.category)?.id || 1,
        discountedPrice: product.discountPrice || '',
        originalPrice: product.originalPrice || '',
        image: product.image || '',
        expiresDate: product.expiresDate || ''
      };
    }
    return {
      name: '',
      categoryId: 1,
      discountedPrice: '',
      originalPrice: '',
      image: '',
      expiresDate: ''
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value, 10);
    setFormData(prev => ({ ...prev, categoryId }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateSymbolPosition = (value) => {
    const length = value?.toString().length || 0;
    return Math.min(20 + length * 16, 150);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      originalPrice: Number(formData.originalPrice) || Number(formData.discountedPrice),
      discountPrice: Number(formData.discountedPrice),
      category: categoryEnumMap[formData.categoryId] || 'OTHER',
      description: '',
      expiresDate: Number(formData.expiresDate),
      image: formData.image
    };

    if (mode === 'edit') {
      productData.id = product.id;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Необходима авторизация');

      const url = mode === 'add'
        ? `http://89.111.154.66:8080/shops/${shopId}/foods`
        : `http://89.111.154.66:8080/shops/${shopId}/foods/${product.id}`;

      const method = mode === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Ошибка при сохранении товара');
      }

      const savedProduct = await response.json();
      onSave(savedProduct);
      onClose();
    } catch (error) {
      alert(error.message || 'Ошибка при сохранении товара');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>
          {mode === 'add' ? 'Добавить товар' : 'Информация о товаре'}
        </h3>
        <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
          <span className={styles.floatingLabel}>Название продукта</span>
            <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
          <span className={styles.floatingLabel}>Категория</span>
            <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleCategoryChange}
            className={styles.select}
            required
            >
            {productCategories.map(category => (
            <option key={category.id} value={category.id}>
            {category.name}
            </option>
            ))}
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <span className={styles.floatingLabel}>Цена без скидки</span>
            <div className={styles.priceInputWrapper}>
              <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              className={`${styles.input} ${styles.priceInput}`}
              required
              />
              <span
              className={styles.currencySymbol}
              style={{
              left: `${calculateSymbolPosition(formData.originalPrice)}px`,
              transition: 'left 0.2s ease-out'
              }}
              >
              ₽
              </span>
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <span className={styles.floatingLabel}>Цена со скидкой</span>
            <div className={styles.priceInputWrapper}>
              <input
              type="number"
              name="discountedPrice"
              value={formData.discountedPrice}
              onChange={handleChange}
              className={`${styles.input} ${styles.priceInput}`}
              />
              <span
              className={styles.currencySymbol}
              style={{
              left: `${calculateSymbolPosition(formData.discountedPrice)}px`,
              transition: 'left 0.2s ease-out'
              }}
              >
              ₽
              </span>
            </div>
          </div>
        </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <span className={styles.floatingLabel}>Срок годности (часов)</span>
              <input
                type="number"
                name="expiresDate"
                value={formData.expiresDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.imageUploadGroup}>
            <p className={styles.imageUploadText}>
              {mode === 'add' ? 'Добавить фото' : 'Изменить фото'}
            </p>
            <div className={styles.imageUpload}>
              <input
              type="file"
              id="product-image"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              />
              <label htmlFor="product-image" className={`${styles.uploadLabel} ${formData.image ? styles.hasImage : ''}`}>
              {formData.image ? (
                <img
                src={formData.image}
                alt="Предпросмотр"
                className={styles.imagePreview}
                />
              ) : (
                <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.375 21.25C6.375 18.9028 8.27779 17 10.625 17H13.1042C14.8199 17 16.3673 15.9684 17.0272 14.3846L17.504 13.2404C18.1639 11.6566 19.7114 10.625 21.427 10.625H29.573C31.2887 10.625 32.8361 11.6566 33.496 13.2404L33.9728 14.3846C34.6326 15.9684 36.18 17 37.8958 17H40.375C42.7223 17 44.625 18.9028 44.625 21.25V36.125C44.625 38.4723 42.7223 40.375 40.375 40.375H10.625C8.27779 40.375 6.375 38.4723 6.375 36.125V21.25Z" stroke="#AEAEAE" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M31.875 27.625C31.875 31.1459 29.0209 34 25.5 34C21.9791 34 19.125 31.1459 19.125 27.625C19.125 24.1041 21.9791 21.25 25.5 21.25C29.0209 21.25 31.875 24.1041 31.875 27.625Z" stroke="#AEAEAE" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
              </label>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Отмена</button>
            <button type="submit"  className={styles.submitBtn}>Сохранить изменения</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
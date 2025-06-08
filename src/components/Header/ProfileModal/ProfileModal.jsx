import React, { useState, useEffect } from 'react';
import './ProfileModal.css';

const ProfileModal = ({ onClose, isPartnerPage }) => {
  // Данные для обычного режима
  const initialUserData = {
    firstName: 'Роман',
    lastName: 'Коноплёв',
    phone: '',
    email: 'hemp48645@gmail.com'
  };

  // Данные для партнерского режима
  const initialPartnerData = {
    ...initialUserData,
    establishment: 'Мой магазин',
    description: 'Описание моего магазина',
    photo: null
  };

  const [userData, setUserData] = useState(isPartnerPage ? initialPartnerData : initialUserData);
  const [isChanged, setIsChanged] = useState(false);
  const [preview, setPreview] = useState(null);

  // Блокируем прокрутку страницы при открытии модального окна
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Обработка загрузки фото
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setUserData(prev => ({
          ...prev,
          photo: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Проверка изменений
  useEffect(() => {
    const initialData = isPartnerPage ? initialPartnerData : initialUserData;
    const hasChanges = Object.keys(initialData).some(
      key => userData[key] !== initialData[key]
    );
    setIsChanged(hasChanges);
  }, [userData, isPartnerPage]);

  const handleSave = () => {
    if (!isChanged) return;
    console.log('Данные сохранены:', userData);
    onClose();
  };

  const handleChange = (e, field) => {
    setUserData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div 
      className="profile-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content-wrapper">
          <div className="modal-header">
            <h2>Мои данные</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>

          <div className="modal-scrollable-content">
            <div className="input-field-header">
              <label>Имя</label>
              <input
                type="text"
                value={userData.firstName}
                onChange={(e) => handleChange(e, 'firstName')}
              />
            </div>

            <div className="input-field-header">
              <label>Фамилия</label>
              <input
                type="text"
                value={userData.lastName}
                onChange={(e) => handleChange(e, 'lastName')}
              />
            </div>

            <div className="input-field-header">
              <label>Телефон</label>
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => handleChange(e, 'phone')}
                placeholder="Введите телефон"
              />
            </div>

            <div className="input-field-header">
              <label>Эл. почта</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => handleChange(e, 'email')}
              />
            </div>

            {isPartnerPage && (
              <>
                <div className="input-field-header">
                  <label>Заведение</label>
                  <input
                    type="text"
                    value={userData.establishment}
                    onChange={(e) => handleChange(e, 'establishment')}
                    placeholder="Название магазина"
                  />
                </div>

                <div className="input-field-header">
                  <label>Описание</label>
                  <textarea
                    value={userData.description}
                    onChange={(e) => handleChange(e, 'description')}
                    placeholder="Описание вашего магазина"
                    className="description-input"
                  />
                </div>

                <div className="photo-upload-section">
                  <label className="photo-upload-label">
                    {preview ? (
                      <img src={preview} alt="Фото магазина" className="shop-photo-preview" />
                    ) : (
                      <div className="photo-upload-placeholder">
                        <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.375 21.25C6.375 18.9028 8.27779 17 10.625 17H13.1042C14.8199 17 16.3673 15.9684 17.0272 14.3846L17.504 13.2404C18.1639 11.6566 19.7114 10.625 21.427 10.625H29.573C31.2887 10.625 32.8361 11.6566 33.496 13.2404L33.9728 14.3846C34.6326 15.9684 36.18 17 37.8958 17H40.375C42.7223 17 44.625 18.9028 44.625 21.25V36.125C44.625 38.4723 42.7223 40.375 40.375 40.375H10.625C8.27779 40.375 6.375 38.4723 6.375 36.125V21.25Z" stroke="#AEAEAE" stroke-width="1.5" stroke-linecap="round"/>
                        <path d="M31.875 27.625C31.875 31.1459 29.0209 34 25.5 34C21.9791 34 19.125 31.1459 19.125 27.625C19.125 24.1041 21.9791 21.25 25.5 21.25C29.0209 21.25 31.875 24.1041 31.875 27.625Z" stroke="#AEAEAE" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="photo-upload-input"
                    />
                  </label>
                </div>
              </>
            )}

            
          </div>

            <div className="modal-footer">
            <button
              className={`save-button ${!isChanged ? 'disabled' : ''}`}
              onClick={handleSave}
              disabled={!isChanged}
            >
              Сохранить изменения
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
import React, { useState, useEffect } from 'react';
import './ProfileModal.css';

const ProfileModal = ({ onClose, isPartnerPage }) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    establishment: '',
    description: '',
    photo: null
  });
  const [isChanged, setIsChanged] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const res = await fetch('http://localhost:8080/shops/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Ошибка загрузки профиля');
      const data = await res.json();

      console.log('Ответ с бэкенда:', data);

      const user = data.currentUser || {};
      const userShop = Array.isArray(data.shop) && data.shop.length > 0 ? data.shop[0] : {};

      setUserData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: isPartnerPage ? (userShop.contactPhone || user.number || '') : (user.number || ''),
        establishment: userShop.name || prev.establishment,
        description: userShop.description || prev.description,
        photo: userShop.photo || prev.photo
      }));
    } catch (err) {
      console.error(err);
    }
  };
  fetchProfile();
}, [isPartnerPage])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setUserData(prev => ({ ...prev, photo: file }));
        setIsChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e, field) => {
    setUserData(prev => ({ ...prev, [field]: e.target.value }));
    setIsChanged(true);
  };

  const handleSave = () => {
    if (!isChanged) return;
    // Здесь должна быть логика отправки обновлённых данных на сервер
    console.log('Сохраняем данные:', userData);
    onClose();
  };

  return (
    <div className="profile-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-content-wrapper">
          <div className="modal-header">
            <h2>Мои данные</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>

          <div className="modal-scrollable-content">
            <div className="input-field-header">
              <label>Имя</label>
              <input type="text" value={userData.firstName} onChange={e => handleChange(e, 'firstName')} />
            </div>

            <div className="input-field-header">
              <label>Фамилия</label>
              <input type="text" value={userData.lastName} onChange={e => handleChange(e, 'lastName')} />
            </div>

            <div className="input-field-header">
              <label>Телефон</label>
              <input type="tel" value={userData.phone} onChange={e => handleChange(e, 'phone')} placeholder="Введите телефон" />
            </div>

            <div className="input-field-header">
              <label>Эл. почта</label>
              <input type="email" value={userData.email} onChange={e => handleChange(e, 'email')} />
            </div>

            {isPartnerPage && (
              <>
                <div className="input-field-header">
                  <label>Заведение</label>
                  <input type="text" value={userData.establishment} onChange={e => handleChange(e, 'establishment')} placeholder="Название магазина" />
                </div>

                <div className="input-field-header">
                  <label>Описание</label>
                  <textarea value={userData.description} onChange={e => handleChange(e, 'description')} placeholder="Описание вашего магазина" className="description-input" />
                </div>

                <div className="photo-upload-section">
                  <label className="photo-upload-label">
                    {preview ? (
                      <img src={preview} alt="Фото магазина" className="shop-photo-preview" />
                    ) : (
                      userData.photo && typeof userData.photo === 'string' ? (
                        <img src={userData.photo} alt="Фото магазина" className="shop-photo-preview" />
                      ) : (
                        <div className="photo-upload-placeholder">Загрузить фото</div>
                      )
                    )}
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="photo-upload-input" />
                  </label>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button className={`save-button ${!isChanged ? 'disabled' : ''}`} onClick={handleSave} disabled={!isChanged}>
              Сохранить изменения
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
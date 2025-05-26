import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProfileModal.css';

const ProfileModal = ({ onClose }) => {
  const [userData, setUserData] = useState({
    firstName: 'Роман',
    lastName: 'Коноплёв',
    phone: '',
    email: 'hemp48645@gmail.com'
  });

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <div className="modal-header">
          <h2>Мои данные</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="input-field-header">
          <label>Имя</label>
          <div className="input-content">{userData.firstName}</div>
        </div>
        
        <div className="input-field-header">
          <label>Фамилия</label>
          <div className="input-content">{userData.lastName}</div>
        </div>
        
        <div className="input-field-header">
          <label>Телефон</label>
          <input 
            type="tel" 
            value={userData.phone} 
            onChange={(e) => setUserData({...userData, phone: e.target.value})}
            placeholder="Введите телефон"
          />
        </div>
        
        <div className="input-field-header">
          <label>Эл. почта</label>
          <div className="input-content">{userData.email}</div>
        </div>
        
        <button className="save-button">Сохранить изменения</button>
      </div>
    </div>
  );
};

export default ProfileModal;
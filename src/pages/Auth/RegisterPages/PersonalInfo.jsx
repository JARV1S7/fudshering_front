import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PersonalInfo.css';

const PersonalInfo = () => {
  const navigate = useNavigate();

  // Загружаем данные регистрации из localStorage
  const savedRegistrationData = JSON.parse(localStorage.getItem('registrationData')) || {};

  const [formData, setFormData] = useState({
    username: savedRegistrationData.username || '',
    email: savedRegistrationData.email || '',
    password: savedRegistrationData.password || '',
    lastName: '',
    firstName: '',
    middleName: '',
    city: '',
    number: '',
    photo: null
  });

  const [cities] = useState([
    'Москва', 'Санкт-Петербург', 'Новосибирск', 
    'Екатеринбург', 'Казань', 'Нижний Новгород'
  ]);
  const [showCities, setShowCities] = useState(false);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result;
        setFormData(prev => ({ ...prev, photo: photoData }));
        localStorage.setItem('profilePhoto', photoData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Создаем копию formData без поля photo
  const { photo, ...dataToSend } = formData;

  console.log('Отправляем данные регистрации с личной информацией (без фото):', dataToSend);

  try {
    const response = await fetch('http://localhost:8080/auth/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    });

    const data = await response.json();

    console.log('Ответ сервера при регистрации:', data);

    if (!response.ok) {
        throw new Error(data.message || 'Ошибка при отправке личной информации');
      }

      // Сохраняем токен для будущего использования
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        console.log('Токен сохранён в localStorage:', data.token);
      }

      // Очистка registrationData после успешной регистрации
      localStorage.removeItem('registrationData');

      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="personal-info-container">
      <div className="info-window">
        <Link to="/" className="skip-button">Пропустить</Link>
        
        <div className="profile-photo-container">
          <div 
            className="profile-photo"
            style={formData.photo ? { backgroundImage: `url(${formData.photo})` } : {}}
          >
            {!formData.photo && <div className="photo-placeholder"></div>}
          </div>
          <button 
            className="add-photo-button"
            onClick={() => fileInputRef.current.click()}
          >
            <img src='./image/foto+.png' alt="Добавить фото"/>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
        
        <div className="info-header">
          <h2>Личная информация</h2>
          <p>осталось заполнить <strong>5 пустых полей</strong></p>
        </div>
        
        <div className="name-fields">
          {['lastName', 'firstName', 'middleName'].map((field) => (
            <div className="input-field" key={field}>
              <input
                type="text"
                name={field}
                placeholder={field === 'middleName' ? 'Отчество' : field === 'lastName' ? 'Фамилия' : 'Имя'}
                value={formData[field]}
                onChange={handleChange}
                required={field !== 'middleName'}
              />
            </div>
          ))}
        </div>
        
        <div className="city-field">
          <div className="input-field">
            <p>Город</p>
            <div className="city-select" onClick={() => setShowCities(!showCities)}>
              {formData.city || 'Выберите город'}
              {showCities && (
                <div className="cities-dropdown">
                  {cities.map(city => (
                    <div 
                      key={city} 
                      className="city-option"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, city }));
                        setShowCities(false);
                      }}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
              <img src='./image/Chevron_Left.png' alt="arrow"/>
            </div>
          </div>
        </div>
        
        <div className="contact-field">
          <div className="input-field">
            <p>Контакты</p>
            <input
              type="tel"
              name="number"
              placeholder="Телефон"
              value={formData.number}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="continue-button" onClick={handleSubmit}>
            Продолжить
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
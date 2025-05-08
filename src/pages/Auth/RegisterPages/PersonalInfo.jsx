import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PersonalInfo.css';

const PersonalInfo = () => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    city: '',
    phone: '',
    photo: null
  });

  const [cities] = useState([
    'Москва', 'Санкт-Петербург', 'Новосибирск', 
    'Екатеринбург', 'Казань', 'Нижний Новгород'
  ]);
  const [showCities, setShowCities] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Личная информация:', formData);
    navigate('/become-partner');
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
          {['Фамилия', 'Имя', 'Отчество'].map((field) => (
            <div className="input-field" key={field}>
              <input
                type="text"
                name={field.toLowerCase()}
                placeholder={field}
                value={formData[field.toLowerCase()]}
                onChange={handleChange}
                required
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
              <img src='./image/Chevron_Left.png'/>
            </div>
          </div>
        </div>
        
        <div className="contact-field">
          <div className="input-field">
            <p>Контакты</p>
            <input
              type="tel"
              name="phone"
              placeholder="Телефон"
              value={formData.phone}
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
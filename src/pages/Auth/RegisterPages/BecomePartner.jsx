import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BecomePartner.css';

const BecomePartner = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    website: '',
    phone: '',
    email: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Данные партнера:', formData);
    navigate('/application-sent');
  };

  return (
    <div className="become-container">
      <div className="form-section">
        <Link to="/" className="skip-button">Пропустить</Link>
        <div className="become-header">
          <h2>Стать партнером</h2>
          <p>Пожалуйста, заполните форму ниже и мы свяжемся с Вами в ближайшее время.</p>
          <div className="divider"></div>
        </div>

        <form className="become-form" onSubmit={handleSubmit}>
          <h3>О магазине</h3>
          {['Название', 'Ссылка на сайт/соцсети'].map((field) => (
            <div className="input-group" key={field}>
              <input
                type="text"
                name={field.toLowerCase().replace(' ', '_')}
                placeholder={field}
                value={formData[field.toLowerCase().replace(' ', '_')]}
                onChange={handleChange}
              />
            </div>
          ))}

          <h4>Контакты</h4>
          {['Телефон', 'Email'].map((field) => (
            <div className="input-group" key={field}>
              <input
                type={field === 'Email' ? 'email' : 'tel'}
                name={field.toLowerCase()}
                placeholder={field}
                value={formData[field.toLowerCase()]}
                onChange={handleChange}
              />
            </div>
          ))}
          <button type="submit" className="continue-button" onClick={handleSubmit}>
          Продолжить
        </button>
        </form>
      </div>
    </div>
  );
};

export default BecomePartner;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ApplicationSent.css';

const ApplicationSent = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="application-sent-container">
      <div className="message-container">
      <img src='image/zayavka.png'/>
        <h2>Заявка отправлена</h2>
        <p>Ожидайте звонка</p>
            <button className="submit-button" onClick={handleContinue}>
            Продолжить
            </button>
      </div>
    </div>
  );
};

export default ApplicationSent;
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BecomePartner.css';
import { usePartnerShop } from '../../contexts/PartnerShopContext';

const BecomePartner = () => {
  const [step, setStep] = useState(1);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { setPartnerShop } = usePartnerShop();
  const [formData, setFormData] = useState({
    shopName: '',
    website: '',
    phone: '',
    email: '',
    description: '',
    logo: null,
    location: null,
    manualAddress: '',
    shopType: ''
  });

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const res = await fetch('http://localhost:8080/shops', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Ошибка загрузки данных пользователя');

        const data = await res.json();

        if (data.currentUser) {
          setFormData(prev => ({
            ...prev,
            email: data.currentUser.email || '',
          }));
        }
      } catch (err) {
        console.error('Ошибка при загрузке пользователя:', err);
      }
    };

    fetchUserData();
  }, []);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [formData.description]);

  useEffect(() => {
    if (step === 3 && !mapLoaded) {
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=ВАШ_API_КЛЮЧ&lang=ru_RU`;
      script.onload = () => {
        window.ymaps.ready(() => {
          const map = new window.ymaps.Map('map', {
            center: [56.838011, 60.597465],
            zoom: 12,
            controls: ['zoomControl']
          });

          map.events.add('click', (e) => {
            const coords = e.get('coords');

            map.geoObjects.removeAll();

            const placemark = new window.ymaps.Placemark(coords, {}, {
              preset: 'islands#redDotIcon'
            });
            map.geoObjects.add(placemark);

            setFormData(prev => ({
              ...prev,
              location: {
                coordinates: coords,
                address: prev.manualAddress
              }
            }));
          });

          mapRef.current = map;
          setMapLoaded(true);
        });
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [step, mapLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, logo: e.target.files[0] }));
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const sendShopData = async () => {
  const token = localStorage.getItem('authToken');

    if (!token) {
      alert('Пожалуйста, войдите в систему перед созданием магазина.');
      return;
    }

    try {
      const payload = {
        name: formData.shopName,
        description: formData.description,
        address: formData.manualAddress || '',
        contactPhone: formData.phone,
        shopType: formData.shopType
      };
      console.log('Отправляем данные магазина:', payload);

      const response = await fetch('http://localhost:8080/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log('Ответ сервера по созданию магазина:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при создании магазина');
      }

      const createdShop = await response.json();
      console.log('Созданный магазин:', createdShop);
      setPartnerShop(createdShop);

      navigate('/application-sent');
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      alert(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      sendShopData();
    }
  };

  const handleBackClick = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

   return (
    <div className="become-container">
      <div className="form-section">
        <Link 
          to={step === 1 ? "/" : ""} 
          className="skip-button" 
          onClick={handleBackClick}
        >
          Назад
        </Link>
        
        {step !== 3 && (
          <div className="become-header">
            <h2>Стать партнером</h2>
            <p>Пожалуйста, заполните форму ниже и мы свяжемся с Вами в ближайшее время.</p>
          </div>
        )}

        {step === 1 && (
          <form className="become-form" onSubmit={handleSubmit}>
            <h3>О магазине</h3>
            {['Название', 'Ссылка на сайт/соцсети'].map((field) => (
              <div className="input-group-2" key={field}>
                <input
                  type="text"
                  name={field === 'Название' ? 'shopName' : 'website'}
                  placeholder={field}
                  value={formData[field === 'Название' ? 'shopName' : 'website']}
                  onChange={handleChange}
                  required={field === 'Название'}
                />
              </div>
            ))}

            <h4>Контакты</h4>
              <div className="input-group-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Укажите почтовый адрес"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group-2">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Телефон"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            <button type="submit" className="continue-button-2">
              Продолжить
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="become-form" onSubmit={handleSubmit}>
            <h3>О магазине</h3>

            <div className="description-group">
              <textarea
                ref={textareaRef}
                name="description"
                placeholder="Описание"
                value={formData.description}
                onChange={handleChange}
                rows="1"
                required
                style={{
                  height: '35px',
                  minHeight: '35px',
                  maxHeight: '100px',
                  resize: 'none',
                }}
              />
            </div>

            <div className="logo-upload">
              <label>Добавить логотип заведения</label>
              <div className="logo-upload-button-container">
                <button
                  type="button"
                  className="logo-upload-button"
                  onClick={handleButtonClick}
                >
                  {formData.logo ? (
                    <img 
                      src={URL.createObjectURL(formData.logo)} 
                      alt="Логотип" 
                      className="logo-preview-image"
                    />
                  ) : (
                    <div className="logo-upload-placeholder">
                      <svg width="34.22%" height="34.22%" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.375 21.25C6.375 18.9028 8.27779 17 10.625 17H13.1042C14.8199 17 16.3673 15.9684 17.0272 14.3846L17.504 13.2404C18.1639 11.6566 19.7114 10.625 21.427 10.625H29.573C31.2887 10.625 32.8361 11.6566 33.496 13.2404L33.9728 14.3846C34.6326 15.9684 36.18 17 37.8958 17H40.375C42.7223 17 44.625 18.9028 44.625 21.25V36.125C44.625 38.4723 42.7223 40.375 40.375 40.375H10.625C8.27779 40.375 6.375 38.4723 6.375 36.125V21.25Z" stroke="#AEAEAE" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M31.875 27.625C31.875 31.1459 29.0209 34 25.5 34C21.9791 34 19.125 31.1459 19.125 27.625C19.125 24.1041 21.9791 21.25 25.5 21.25C29.0209 21.25 31.875 24.1041 31.875 27.625Z" stroke="#AEAEAE" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <button type="submit" className="continue-button-2">
              Продолжить
            </button>
          </form>
        )}

        {step === 3 && (
          <form className="become-form-3" onSubmit={handleSubmit}>
            <h3>Расположение заведения</h3>
            
            <div className="map-container">
        <div id="map" style={{ height: '100%', width: '100%' }}></div>
      </div>
      
            <div className="input-group-2">
              <input
                type="text"
                name="manualAddress"
                placeholder="Введите адрес"
                value={formData.manualAddress}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="continue-button-2" disabled={!formData.location}>
              Продолжить
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BecomePartner;
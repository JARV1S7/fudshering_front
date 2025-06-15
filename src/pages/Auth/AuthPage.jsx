import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryButtons from '../../components/CategoryButtons/CategoryButtons.jsx';
import './Auth.css';
import '../../components/CategoryButtons/CategoryButtons.css';

const AuthPage = ({ isLogin = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.removeItem('authToken');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      setIsLoading(true);
      try {
        console.log('Отправляем данные для входа:', { username: formData.username, password: formData.password });

        const response = await fetch('http://localhost:8080/auth/sign-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          }),
        });
        const data = await response.json();

        console.log('Ответ сервера при входе:', data);

        if (!response.ok) throw new Error(data.message || 'Ошибка входа');
        localStorage.setItem('authToken', data.token);
        console.log('Токен сохранён в localStorage:', data.token);
        if (data.user) localStorage.setItem('userData', JSON.stringify(data.user));
        navigate('/');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Сохраняем данные регистрации локально:', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('registrationData', JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password
      }));
      navigate('/personal-info');
    }
  };


  return (
    <div className="auth-container">
      <div className="categories-section">
        <div className="categories-wind">
        <div className="main-title-container">
          <h1 className="main-title">Закажи и наслаждайся</h1>
        </div>
        <CategoryButtons isAuthPage={true} />
        </div>
      </div>

      <div className="form-section-1">
        <div className='form-auth'>
          <div className="auth-header">
            <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
            <p>{isLogin ? 'Войдите, и не упустите самые Горячие скидки!' : 'Зарегистрируйтесь, и не упустите самые Горячие скидки!'}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            {isLogin ? (
              <div className="input-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Логин"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            ) : (
              <>
                <div className="input-group">
                  <input
                    type="text"
                    name="username"
                    placeholder="Логин"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="submit-block">
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Загрузка...' : isLogin ? 'Войти' : 'Продолжить'}
              </button>
              <p>Нажимая на кнопку вы соглашаетесь на обработку <strong>Персональных данных</strong></p>
            </div>
          </form>

          <div style={{
          background: 'none',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          }} 
          className="divider divider-with-text">
            <span>Или</span>
          </div>

          <button className="google-btn" type="button">
            <img src="/image/google.svg" alt="Google" />
            Google
          </button>

          <div className="auth-link">
            <span>{isLogin ? 'Ещё нет аккаунта?' : 'Уже есть аккаунт?'}</span>
            <Link to={isLogin ? '/register' : '/login'}>
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
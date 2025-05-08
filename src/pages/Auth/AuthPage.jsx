import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryButtons from '../../components/CategoryButtons/CategoryButtons.jsx';
import './Auth.css';
import '../../components/CategoryButtons/CategoryButtons.css';

const AuthPage = ({ isLogin = false }) => {

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
      });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
        if (!isLogin) {
          // Логика регистрации
          console.log('Регистрация:', formData);
          navigate('/personal-info');
        } else {
          // Логика входа
          const response = await fakeAuthAPI(formData.email, formData.password);
          
          if (response.success) {
            // 1. Сохраняем токен/данные пользователя
            localStorage.setItem('authToken', response.token);
            
            // 2. Перенаправляем на главную
            navigate('/');
            
            // 3. Можно обновить состояние приложения (через Context/Redux)
            // updateAuthState(true);
          } else {
            setError(response.message || 'Неверные учетные данные');
          }
        }
      } catch (err) {
        setError('Ошибка соединения с сервером');
        console.error('Auth error:', err);
      } finally {
        setIsLoading(false);
      }
    };


  return (
    <div className="auth-container">
      <div className="categories-section">
        <div className="main-title-container">
          <h1 className="main-title">Закажи и наслаждайся</h1>
        </div>
        <CategoryButtons isAuthPage={true} />
      </div>

      <div className="form-section">
        <div className="auth-header">
          <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
          <p>{isLogin ? 'Войдите, и не упустите самые Горячие скидки!' : 'Зарегистрируйтесь, и не упустите самые Горячие скидки!'}</p>
          <div className="divider"></div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
          
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder='Пароль'
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

        <div className="divider divider-with-text">
          <span>Или</span>
        </div>

        <button className="google-btn">
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
  );
};

// Заглушка для API аутентификации
async function fakeAuthAPI(email, password) {
    // В реальном приложении здесь будет fetch/axios запрос
    return new Promise(resolve => {
      setTimeout(() => {
        if (email === 'user@example.com' && password === 'password123') {
          resolve({ success: true, token: 'fake-jwt-token' });
        } else {
          resolve({ success: false, message: 'Неверный email или пароль' });
        }
      }, 1000);
    });
}

export default AuthPage;
import React, { createContext, useState, useContext, useEffect } from 'react';

const mapImage = (productName) => {
  const images = {
    'справка': '/image/bakery.png',
    'Мексиканский бургер': '/image/burger.png',
    'Пицца Маргарита': '/image/pizza.png',
    'Салат Цезарь': '/image/salad.png',
    'Паста Карбонара': '/image/pasta.png',
    'Чизкейк': '/image/cheesecake.png',
    'Лазанья': '/image/lasagna.png',
  };
  return images[productName] || '/image/default.png';
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [foods, setFoods] = useState([]);

  // 1. Загрузка товаров из /shops
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const fetchFoods = async () => {
      try {
        const res = await fetch('http://localhost:8080/shops', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Ошибка загрузки товаров');
        const data = await res.json();
        const allFoods = data.food || [];
        setFoods(allFoods);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFoods();
  }, []);

  // 2. Загрузка корзины и сопоставление с товарами
  const loadCartFromServer = async () => {
    const token = localStorage.getItem('authToken');
    if (!token || foods.length === 0) return;

    try {
      const res = await fetch('http://localhost:8080/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Ошибка загрузки корзины');
      const cartData = await res.json();

      const cartItemsArray = Array.isArray(cartData.cartItems) ? cartData.cartItems : [];

      const mergedCartItems = cartItemsArray.map(cartItem => {
        const food = foods.find(f => f.id === cartItem.foodId);
        if (!food) return null;

        // Исключаем неактивные товары
        if (!food.active) return null;

        return {
          id: cartItem.id,
          foodId: food.id,
          name: food.name,
          image: mapImage(food.name),
          price: food.discountPrice,
          oldPrice: food.originalPrice,
          quantity: cartItem.quantity
        };
      }).filter(Boolean);

      mergedCartItems.sort((a, b) => a.id - b.id);

      setCartItems(mergedCartItems);
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Загружаем корзину после загрузки товаров
  useEffect(() => {
    if (foods.length > 0) {
      loadCartFromServer();
    }
  }, [foods]);

  // 4. Добавление товара в корзину с обновлением
  const addToCart = async (product) => {
    if (!product.active) {
      alert('Этот товар сейчас недоступен для заказа');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Пожалуйста, авторизуйтесь');
      return;
    }

    try {
      console.log('Отправляем на сервер для добавления:', product);
      const res = await fetch(`http://localhost:8080/shops/${product.shopId}/foods/cart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ food: product.id })
      });
      console.log('Ответ сервера на добавление:', res);
      if (!res.ok) throw new Error('Ошибка при добавлении товара в корзину');
      const data = await res.json();
      console.log('Данные от сервера после добавления:', data);
      await loadCartFromServer();
    } catch (error) {
      alert(error.message);
    }
  };

  // 5. Обновление количества товара
  // Увеличение количества товара по cartItemId
  const increaseQuantity = async (cartItemId) => {
    const token = localStorage.getItem('authToken');
    console.log('Токен для увеличения количества:', token);
    if (!token) {
      alert('Пожалуйста, авторизуйтесь');
      return;
    }

    const url = `http://localhost:8080/cart/increase/${cartItemId}`;
    console.log('Отправляем запрос на увеличение количества товара с cartItemId=', cartItemId);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      console.log('Ответ сервера при увеличении количества:', res);
      if (!res.ok) throw new Error('Ошибка увеличения количества');
      const data = await res.json();
      console.log('Данные от сервера после увеличения:', data);
      await loadCartFromServer();
    } catch (error) {
      alert(error.message);
    }
  };

  // Уменьшение количества товара по cartItemId
  const decreaseQuantity = async (cartItemId) => {
    const token = localStorage.getItem('authToken');
    console.log('Токен для уменьшения количества:', token);
    if (!token) {
      alert('Пожалуйста, авторизуйтесь');
      return;
    }

    const url = `http://localhost:8080/cart/decrease/${cartItemId}`;
    console.log('Отправляем запрос на уменьшение количества товара с cartItemId=', cartItemId);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      console.log('Ответ сервера при уменьшении количества:', res);
      if (!res.ok) throw new Error('Ошибка уменьшения количества');
      const data = await res.json();
      console.log('Данные от сервера после уменьшения:', data);
      await loadCartFromServer();
    } catch (error) {
      alert(error.message);
    }
  };

  // 6. Удаление товара из корзины (уменьшаем количество до 0)
  const removeFromCart = async (cartItemId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Пожалуйста, авторизуйтесь');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Ошибка при удалении товара из корзины');
      await loadCartFromServer(); // обновляем корзину после удаления
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      loadCartFromServer,
      cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
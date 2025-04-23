import React from 'react';

export default function Profile() {
  const user = {
    name: "Иван Иванов",
    email: "ivan@example.com",
    phone: "+7 (123) 456-7890",
  };

  return (
    <div className="profile">
      <div className="user-info">
        <img src="/avatar.jpg" alt="User" />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>{user.phone}</p>
      </div>
      <h3>Мои заказы</h3>
      <div className="orders">
        <p>Заказ #1: Булочки (50 руб.)</p>
        <p>Заказ #2: Яблоки (100 руб.)</p>
      </div>
    </div>
  );
}
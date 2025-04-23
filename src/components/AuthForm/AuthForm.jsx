import React from 'react';
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AuthForm({ type }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const isLogin = type === "login";
  const title = isLogin ? "Вход" : "Регистрация";
  const submitText = isLogin ? "Войти" : "Зарегистрироваться";

  return (
    <div className="auth-form">
      <h2>{title}</h2>
      <form>
        {!isLogin && (
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{submitText}</button>
      </form>
      <p>
        {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
        <Link to={isLogin ? "/register" : "/login"}>
          {isLogin ? "Регистрация" : "Вход"}
        </Link>
      </p>
    </div>
  );
}
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Map from './pages/Map/Map';
import Catalog from './pages/Catalog/Catalog';
import Stores from './pages/Stores/Stores';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import './components/Header/Header.css';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/map" element={<Map />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
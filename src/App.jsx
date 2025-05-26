import React from 'react';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import WithHeaderLayout from './layout/WithHeaderLayout';
import WithoutHeaderLayout from './layout/WithoutHeaderLayout';

const MainPage = lazy(() => import('./pages/MainPage/MainPage'));
const CartPage = lazy(() => import('./pages/Cart/CartPage'));
const FavoritesPage = lazy(() => import('./pages/Favorites/Favorites'));
const ShopDashboardPage = lazy(() => import('./pages/ShopDashboard/ShopDashboard'));
const LoginPage = lazy(() => import('./pages/Auth/Login'));
const RegisterPage = lazy(() => import('./pages/Auth/Register'));
const PersonalInfo = lazy(() => import('./pages/Auth/RegisterPages/PersonalInfo'));
const BecomePartner = lazy(() => import('./pages/Auth/RegisterPages/BecomePartner'));
const ApplicationSent = lazy(() => import('./pages/Auth/RegisterPages/ApplicationSent'));
const ProfilePage = lazy(() => import('./pages/UserProfile/UserProfile'));
const ShopProfilePage = lazy(() => import('./pages/ShopProfile/ShopProfile'));
const MapPage = lazy(() => import('./pages/Map/Map'));
const CatalogPage = lazy(() => import('./pages/Catalog/Catalog'));
const ShopPage = lazy(() => import('./pages/ShopPage/ShopPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Роуты без хедера */}
          <Route element={<WithoutHeaderLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/personal-info" element={<PersonalInfo />} />
            <Route path="/become-partner" element={<BecomePartner />} />
            <Route path="/application-sent" element={<ApplicationSent />} />
          </Route>

          {/* Роуты с хедером */}
          <Route element={<WithHeaderLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/shop-dashboard" element={<ShopDashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/shop/:id" element={<ShopProfilePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/restaurant/:id" element={<ShopPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import WithHeaderLayout from './layout/WithHeaderLayout';
import WithoutHeaderLayout from './layout/WithoutHeaderLayout';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { PartnerShopProvider } from './contexts/PartnerShopContext';

const MainPage = lazy(() => import('./pages/MainPage/MainPage'));
const CartPage = lazy(() => import('./pages/Cart/CartPage'));
const FavoritesPage = lazy(() => import('./pages/Favorites/FavoritesPage'));
const PartnerDashboardPage = lazy(() => import('./pages/PartnerDashboard/PartnerDashboard'));
const LoginPage = lazy(() => import('./pages/Auth/Login'));
const RegisterPage = lazy(() => import('./pages/Auth/Register'));
const PersonalInfo = lazy(() => import('./pages/Auth/RegisterPages/PersonalInfo'));
const BecomePartner = lazy(() => import('./pages/Partner/BecomePartner'));
const ApplicationSent = lazy(() => import('./pages/Partner/ApplicationSent'));
const ShopPage = lazy(() => import('./pages/ShopPage/ShopPage'));
const OrdersPage = lazy(() => import('./pages/Orders/OrdersPage'));
const OrderHistoryPage = lazy(() => import('./pages/Orders/OrderHistory/OrderHistoryPage'));
const PartnerOrdersPage = lazy(() => import('./pages/PartnerOrdersPage/PartnerOrdersPage'));

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <PartnerShopProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Роуты без хедера */}
              <Route element={<WithoutHeaderLayout />}>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/personal-info" element={<PersonalInfo />} />
                <Route path="/become-partner" element={<BecomePartner />} />
                <Route path="/application-sent" element={<ApplicationSent />} />
              </Route>

              {/* Роуты с хедером */}
              <Route element={<WithHeaderLayout />}>
                <Route path="/home" element={<MainPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/partner-dashboard" element={<PartnerDashboardPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/order-history" element={<OrderHistoryPage />} />
                <Route path="/restaurant/:id" element={<ShopPage />} />
                <Route path="/partner/orders" element={<PartnerOrdersPage />} />
              </Route>
            </Routes>
          </Suspense>
        </PartnerShopProvider>
      </FavoritesProvider>
    </BrowserRouter>
  );
}

export default App;
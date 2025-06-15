import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import ProfileModal from './ProfileModal/ProfileModal';
import SearchBar from './SearchBar.jsx/SearchBar';

const Header = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('/image/profileMain.png');
  const [userName, setUserName] = useState({ firstName: '', lastName: '' });
  const [currentUser, setCurrentUser] = useState(null);

  const [ordersCount, setOrdersCount] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const profileMenuRef = useRef(null);

  const isCartPage = location.pathname === '/cart';
  const isPartnerPage = location.pathname.startsWith('/partner');
  const [showHeader, setShowHeader] = useState(true);
const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSidebar(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchUserDataAndOrders = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const resShops = await fetch('http://89.111.154.66:8080/shops', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resShops.ok) throw new Error('Ошибка загрузки данных пользователя');
        const dataShops = await resShops.json();

        if (dataShops.currentUser) {
          setCurrentUser(dataShops.currentUser);
          setUserName({ 
            firstName: dataShops.currentUser.firstName || '', 
            lastName: dataShops.currentUser.lastName || '' 
          });

          const resOrders = await fetch('http://89.111.154.66:8080/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!resOrders.ok) throw new Error('Ошибка загрузки заказов');
          const ordersData = await resOrders.json();

          const userOrders = ordersData.filter(order => order.userId === dataShops.currentUser.id);

          setOrdersCount(userOrders.length);

          const savingsSum = userOrders.reduce((sum, order) => {
            const orderSaving = (order.finalPrice || 0) - (order.discountPrice || 0);
            return sum + (orderSaving > 0 ? orderSaving : 0);
          }, 0);

          console.log('Общая сумма экономии:', savingsSum);
          setTotalSavings(savingsSum);
        }
      } catch (err) {
        console.error('Ошибка при загрузке пользователя или заказов:', err);
      }
    };

    fetchUserDataAndOrders();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handlePartnershipClick = () => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    if (currentUser.role === 'ROLE_ADMIN') {
      navigate('/partner-dashboard');
    } else if (currentUser.role === 'ROLE_USER') {
      navigate('/become-partner');
    } else {
      navigate('/home');
    }
  };

  const handleSwitchModeClick = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/');
      return;
    }

    const res = await fetch('http://89.111.154.66:8080/shops', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Ошибка обновления данных пользователя');

    const data = await res.json();
    if (data.currentUser) {
      setCurrentUser(data.currentUser);
      setUserName({ 
        firstName: data.currentUser.firstName || '', 
        lastName: data.currentUser.lastName || '' 
      });
    }

    navigate('/home');
  } catch (error) {
    console.error('Ошибка при смене режима:', error);
    navigate('/');
  }
};

  return (
    <div className={styles.headerWrapper}>
      <header className={`${styles.mainHeader} ${showHeader ? styles.visible : styles.hidden}`}>
        <div className={styles.burgerMenu} onClick={() => setShowSidebar(!showSidebar)}>
          <div className={styles.burgerLine}></div>
          <div className={styles.burgerLine}></div>
          <div className={styles.burgerLine}></div>
        </div>

        {showSidebar && (
          <div ref={sidebarRef} className={styles.sidebarMenu}>
            <Link 
              to={isPartnerPage ? "/partner-dashboard" : "/home"} 
              className={styles.sidebarItem}
            >
              <img src='/image/catalog-item.png' alt="Каталог" className={styles.sidebarIcon} />
              <span>Каталог</span>
            </Link>
            {!isPartnerPage && (
              <Link to="/favorites" className={styles.sidebarItem}>
                <img src='/image/favourite-item.png' alt="Любимые" className={styles.sidebarIcon} />
                <span>Любимые</span>
              </Link>
            )}
          </div>
        )}

        <SearchBar isPartnerPage={isPartnerPage} />

        <div className={styles.headerIcons}>
          {!isPartnerPage && (
            <div className={`${styles.cartContainer} ${isCartPage ? styles.cartActive : ''}`}>
              <Link to="/cart" className={styles.cartLink}>
                <svg
                  width="47"
                  height="47"
                  viewBox="0 0 47 47"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.cartIcon}
                >
                <path d="M22.5202 15.667H39.5498C40.7734 15.667 41.3852 15.667 41.8331 15.8645C43.8143 16.738 42.9286 18.9389 42.5953 20.5205C42.5353 20.8047 42.3405 21.0465 42.0675 21.1762C40.935 21.7135 40.1417 22.7329 39.9335 23.9182L38.773 30.5264C38.2624 33.434 38.088 37.5892 35.54 39.6374C33.6705 41.1253 30.9771 41.1253 25.5899 41.1253H21.4088C16.0217 41.1253 13.3282 41.1253 11.4587 39.6374C8.91079 37.589 8.73622 33.434 8.22565 30.5264L7.06516 23.9182C6.85699 22.7329 6.06378 21.7135 4.93124 21.1762C4.65815 21.0465 4.46341 20.8047 4.40353 20.5205C4.07022 18.9389 3.18439 16.738 5.16567 15.8645C5.61358 15.667 6.22533 15.667 7.44879 15.667H14.6869" 
                  stroke={isCartPage ? "#FFFFFF" : "#141B34"} 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                <path d="M27.4173 23.5H19.584" 
                  stroke={isCartPage ? "#FFFFFF" : "#141B34"} 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path d="M12.7285 21.5417L19.5827 5.875M29.3743 5.875L34.2702 15.6667" 
                  stroke={isCartPage ? "#FFFFFF" : "#141B34"} 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
              </svg>
              </Link>
            </div>
          )}

          <div
            className={`${styles.profileIcon} ${showProfileMenu ? styles.active : ''}`}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img src={profilePhoto} alt="Профиль" onError={e => { e.target.src = '/image/profileMain.png'; }} />
          </div>

          {showProfileMenu && (
            <div ref={profileMenuRef} className={styles.profileMenu}>
              <div className={styles.profileHeader}>
                <div className={styles.profileName}>
                  {userName.lastName} {userName.firstName}
                </div>
                <div
                  className={styles.profileLink}
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowProfileModal(true);
                  }}
                >
                  В профиль
                  <svg
                    width="5"
                    height="11"
                    viewBox="0 0 5 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.profileArrow}
                  >
                    <path
                      d="M1 1L4 5.5L1 10"
                      stroke="#8B8B8B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {!isPartnerPage && (
                <div className={styles.statsContainer}>
                  <div className={styles.statBlock}>
                    <div className={styles.statLabel}>Заказов</div>
                    <div className={styles.statValue}>{ordersCount}</div>
                  </div>
                  <div className={`${styles.statBlock} ${styles.savingsBlock}`}>
                    <div className={styles.statLabel}>Сэкономил</div>
                    <div className={styles.statValue}>{totalSavings.toLocaleString()} ₽</div>
                  </div>
                </div>
              )}

              <div className={styles.menuItems}>
                <Link 
                  to={isPartnerPage ? "/partner/orders" : "/orders"} 
                  className={styles.menuItem}
                >
                  <img src='/image/orders-icon.png' alt="Заказы" className={styles.menuIcon} />
                  <span>{isPartnerPage ? "Активные заказы" : "Заказы"}</span>
                </Link>

                {!isPartnerPage && (
                  <>
                    <Link to="/order-history" className={styles.menuItem}>
                      <img src='/image/history-icon.png' alt="История" className={styles.menuIcon} />
                      <span>История заказов</span>
                    </Link>
                  </>
                )}

                <button 
                  className={styles.menuItem} 
                  onClick={handleLogout} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <img src='/image/logout-icon.png' alt="Выйти" className={styles.menuIcon} />
                  <span>Выйти</span>
                </button>

                {!isPartnerPage && (
                  <button 
                    className={styles.menuItem}
                    onClick={handlePartnershipClick}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <img src='/image/partnership-icon.png' alt="Партнерство" className={styles.menuIcon} />
                    <span>Партнерство</span>
                  </button>
                )}

                {/* Кнопка Сменить режим */}
                {isPartnerPage && (
                  <button
                    className={styles.menuItem}
                    onClick={handleSwitchModeClick}
                    style={{ background: 'none', border: 'none', cursor: 'pointer'}}
                  >
                    <img src='/image/partnership-icon.png' alt="Сменить режим" className={styles.menuIcon} />
                    <span>Сменить режим</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {showProfileModal && (
          <ProfileModal
            onClose={() => setShowProfileModal(false)}
            isPartnerPage={isPartnerPage}
          />
        )}
      </header>
    </div>
  );
};

export default Header;
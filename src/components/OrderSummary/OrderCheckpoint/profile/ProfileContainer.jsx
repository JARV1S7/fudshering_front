import React, { useState, useEffect } from 'react';
import ProfileEditStep from './ProfileEditStep';

const ProfileContainer = () => {
  const [contactInfo, setContactInfo] = useState({
    name: '',
    lastName: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch('http://localhost:8080/shops/admin', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Ошибка загрузки профиля');

        const data = await response.json();

        const user = data.currentUser || {};

        setContactInfo({
          name: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.number || '',
          email: user.email || '',
        });
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <ProfileEditStep
      contactInfo={contactInfo}
      handleInputChange={handleInputChange}
    />
  );
};

export default ProfileContainer;
import React from 'react';
import styles from './ProfileEditStep.module.css';

const ProfileEditStep = ({
  contactInfo,
  handleInputChange,
  onNext
}) => {
  return (
    <div className={styles.profileEditStep}>
      
      <div className={styles.inputField}>
        <label className={styles.inputLabel}>Имя</label>
        <input
          type="text"
          name="name"
          value={contactInfo.name || ''}
          onChange={handleInputChange}
          className={styles.input}
          placeholder="Введите ваше имя"
        />
      </div>
      
      <div className={styles.inputField}>
        <label className={styles.inputLabel}>Фамилия</label>
        <input
          type="text"
          name="lastName"
          value={contactInfo.lastName || ''}
          onChange={handleInputChange}
          className={styles.input}
          placeholder="Введите вашу фамилию"
        />
      </div>
      
      <div className={styles.inputField}>
        <label className={styles.inputLabel}>Телефон</label>
        <input
          type="tel"
          name="phone"
          value={contactInfo.phone || ''}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      
      <div className={styles.inputField}>
        <label className={styles.inputLabel}>Эл. почта</label>
        <input
          type="email"
          name="email"
          value={contactInfo.email || ''}
          onChange={handleInputChange}
          className={styles.input}
          placeholder="example@mail.com"
        />
      </div>
      
    </div>
  );
};

export default ProfileEditStep;
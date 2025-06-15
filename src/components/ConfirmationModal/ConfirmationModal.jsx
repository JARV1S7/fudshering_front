import React from 'react';

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>Отмена</button>
          <button className="confirm-btn" onClick={onConfirm}>Подтвердить</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
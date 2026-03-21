import React from 'react';
import Modal from './Modal';
import { MdWarning } from 'react-icons/md';
import './ConfirmDialog.css';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="confirm">
        <div className="confirm__icon"><MdWarning size={32} /></div>
        <h3 className="confirm__title">{title || 'Confirm Action'}</h3>
        <p className="confirm__msg">{message || 'Are you sure you want to proceed?'}</p>
        <div className="confirm__actions">
          <button className="btn btn--ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn--danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

import React from 'react';
import { MdMenu, MdNotificationsNone } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import './Header.css';

const PAGE_TITLES = {
  '/dashboard':    'Dashboard',
  '/farmers':      'Farmers',
  '/crops':        'Crops',
  '/fields':       'Fields',
  '/crop-records': 'Crop Records',
};

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'FarmCrop';

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onMenuClick}>
          <MdMenu size={22} />
        </button>
        <h1 className="header__title">{title}</h1>
      </div>
      <div className="header__right">
        <button className="header__icon-btn">
          <MdNotificationsNone size={20} />
        </button>
      </div>
    </header>
  );
}

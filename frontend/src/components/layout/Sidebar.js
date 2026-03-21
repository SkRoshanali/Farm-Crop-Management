import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GiFarmTractor } from 'react-icons/gi';
import { MdDashboard, MdPeople, MdGrass, MdLandscape,
         MdAssignment, MdLogout } from 'react-icons/md';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/dashboard',    icon: <MdDashboard />,  label: 'Dashboard' },
  { to: '/farmers',      icon: <MdPeople />,     label: 'Farmers' },
  { to: '/crops',        icon: <MdGrass />,      label: 'Crops' },
  { to: '/fields',       icon: <MdLandscape />,  label: 'Fields' },
  { to: '/crop-records', icon: <MdAssignment />, label: 'Crop Records' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      {isOpen && <div className="sidebar__overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <GiFarmTractor size={28} />
          <span>FarmCrop</span>
        </div>

        <div className="sidebar__user">
          <div className="sidebar__avatar">{user?.username?.[0]?.toUpperCase()}</div>
          <div>
            <div className="sidebar__username">{user?.username}</div>
            <span className={`sidebar__role ${isAdmin() ? 'role--admin' : 'role--user'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <nav className="sidebar__nav">
          <p className="sidebar__section-label">Menu</p>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="sidebar__logout" onClick={handleLogout}>
          <MdLogout size={18} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}

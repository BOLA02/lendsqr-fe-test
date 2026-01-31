import { useNavigate } from 'react-router-dom';

import NotificationBadge from '../assets/notification_badge.svg?react';
import ArrowDown from '../assets/arrow_down.svg?react';
import Search from '../assets/search.svg?react';
import Logout from '../assets/logout.svg?react';
import Settings from '../assets/settings.svg?react';
import Use from '../assets/use.svg?react';

import '../styles/Header.scss';

import logo from '../assets/logo-login.png';
import profileImg from '../assets/profile.png';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication flag
    localStorage.removeItem('isAuthenticated');
    
    // Dispatch custom event to notify App.tsx
    window.dispatchEvent(new Event('logout'));
    
    // Navigate to login page
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick} aria-label="Toggle menu">
          ☰
        </button>
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for anything"
            className="search-input"
          />
          <button className="search-button" aria-label="Search">
            <Search width={14} />
          </button>
        </div>
      </div>

      <div className="header-right">
        <a href="#" className="header-link">Docs</a>
        <button className="notification-btn" aria-label="Notifications">
          <NotificationBadge className="notification_badge" width={26} />
        </button>
        <div className="user-profile">
          <div className="user-trigger">
            <img
              src={profileImg}
              alt="User"
              className="user-avatar"
            />
            <span className="user-name">Adedeji</span>
            <ArrowDown width={14} className="arrow-icon" />
          </div>

          <div className="profile-dropdown">
            <div className="dropdown-item">
              <Use width={16} height={16} className="dropdown-icon" />
              <span>Profile</span>
            </div>
            <div className="dropdown-item">
              <Settings width={16} height={16} className="dropdown-icon" />
              <span>Settings</span>
            </div>
            <div className="dropdown-divider" />
            <div className="dropdown-item logout" onClick={handleLogout}>
              <Logout width={16} height={16} className="dropdown-icon" />
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
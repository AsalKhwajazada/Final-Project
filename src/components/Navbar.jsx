import { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notify } from '../utils/toast';

const ROUTE_TITLES = {
  '/dashboard': 'Dashboard',
  '/student-chat': 'Student Chat',
  '/find-academy': 'Find Academy',
  '/find-instructor': 'Find Instructor',
  '/assignments': 'My Assignments',
  '/design-portfolio': 'Design Portfolio',
  '/profile': 'My Profile',
  '/asset-marketplace': 'Asset Marketplace',
  '/preferences': 'Preferences',
  '/settings': 'Settings',
};

export default function Navbar({ onToggleMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, theme, toggleTheme } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef(null);

  const currentTitle = ROUTE_TITLES[location.pathname] || 'Overview';

  // Close notifications dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const clean = searchQuery.trim();
    if (!clean) return;
    notify(`Searching assets & mentors for "${clean}"...`);
    navigate(`/asset-marketplace?q=${encodeURIComponent(clean)}`);
    setSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    notify('You have been signed out successfully.', 'info');
    navigate('/signin');
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button 
          type="button" 
          className="mobile-menu-trigger" 
          onClick={onToggleMobile}
          aria-label="Toggle menu"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        <div className="navbar-breadcrumbs">
          <Link to="/dashboard" className="crumb-home" title="Go to dashboard">
            <i className="fa-solid fa-house"></i>
          </Link>
          <span className="crumb-separator">/</span>
          <span className="crumb-current">{currentTitle}</span>
        </div>
      </div>

      <div className="navbar-right">
        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Search classes, assets, mentors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="navbar-actions">
          {/* Quick Theme Toggle Button */}
          <button
            type="button"
            className="navbar-icon-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-warning' : 'fa-moon'}`}></i>
          </button>

          {/* Notifications dropdown trigger */}
          <div className="notification-wrapper" ref={notifRef}>
            <button
              type="button"
              className="navbar-icon-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              aria-label="View notifications"
            >
              <i className="fa-solid fa-bell"></i>
              <span className="notif-indicator"></span>
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notif-header">
                  <strong>Notifications</strong>
                  <span className="notif-count">2 new</span>
                </div>
                <div className="notif-list">
                  <div className="notif-item unread">
                    <div className="notif-icon bg-pink">
                      <i className="fa-solid fa-comments"></i>
                    </div>
                    <div className="notif-text">
                      <p><strong>Sara Ahmadi</strong> sent you the UI/UX Color Palette</p>
                      <small>15 minutes ago</small>
                    </div>
                  </div>
                  <div className="notif-item unread">
                    <div className="notif-icon bg-blue">
                      <i className="fa-solid fa-file-circle-check"></i>
                    </div>
                    <div className="notif-text">
                      <p>Assignment <strong>Blender 3D Modeling</strong> submitted</p>
                      <small>2 hours ago</small>
                    </div>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="notif-footer-btn"
                  onClick={() => {
                    setShowNotifications(false);
                    notify('All notifications marked as read.');
                  }}
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          <Link to="/settings" className="navbar-icon-btn" title="Settings" aria-label="Settings">
            <i className="fa-solid fa-gear"></i>
          </Link>

          <button 
            type="button" 
            className="navbar-logout-btn" 
            onClick={handleLogout}
            title="Log out of session"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Log out</span>
          </button>

          {/* User profile capsule */}
          <Link to="/profile" className="navbar-user-capsule" title="View your profile">
            <div className="user-avatar-mini">{user.avatarInitials}</div>
            <div className="user-text-mini">
              <span className="user-name-mini">{user.name}</span>
              <span className="user-role-mini">{user.role}</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

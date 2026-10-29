import { NavLink } from 'react-router-dom';
import { notify } from '../utils/toast';

const MENU_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-pie' },
  { path: '/student-chat', label: 'Student Chat', icon: 'fa-solid fa-comments', badge: '3' },
  { path: '/find-academy', label: 'Find Academy', icon: 'fa-solid fa-graduation-cap' },
  { path: '/find-instructor', label: 'Find Instructor', icon: 'fa-solid fa-chalkboard-user' },
  { path: '/assignments', label: 'Assignments', icon: 'fa-solid fa-folder-open', badge: '2' },
  { path: '/design-portfolio', label: 'Portfolio', icon: 'fa-solid fa-images' },
  { path: '/profile', label: 'My Profile', icon: 'fa-solid fa-id-card' },
  { path: '/asset-marketplace', label: 'Asset Marketplace', icon: 'fa-solid fa-store' },
  { path: '/preferences', label: 'Preferences', icon: 'fa-solid fa-sliders' },
  { path: '/settings', label: 'Settings', icon: 'fa-solid fa-gear' },
];

export default function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) {
  const handleHelp = () => {
    notify('Need help? Contact support@graphicdesignhub.edu or open Student Chat.');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div className="sidebar-mobile-backdrop" onClick={onCloseMobile}></div>
      )}

      <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="sidebar-brand" onClick={onCloseMobile}>
            <div className="brand-logo-icon">
              <i className="fa-solid fa-shapes"></i>
            </div>
            {!isCollapsed && (
              <span className="brand-title">
                GraphicDesign<span className="brand-accent">HUB</span>
              </span>
            )}
          </NavLink>
          <button 
            type="button" 
            className="collapse-toggle-btn"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar"
          >
            <i className={`fa-solid ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-label">{!isCollapsed ? 'MAIN MENU' : '•••'}</div>
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
              title={isCollapsed ? item.label : undefined}
            >
              <i className={`link-icon ${item.icon}`}></i>
              {!isCollapsed && <span className="link-label">{item.label}</span>}
              {!isCollapsed && item.badge && (
                <span className="link-badge">{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="sidebar-help-btn" onClick={handleHelp}>
            <i className="fa-regular fa-circle-question"></i>
            {!isCollapsed && <span>Help Center</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notify } from '../utils/toast';

export default function PreferencesPage() {
  const { user, updateProfile, theme, setTheme, language, setLanguage } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  // Form State
  const [timeZone, setTimeZone] = useState(() => localStorage.getItem('gdh-pref-timezone') || 'Afghanistan Time (UTC +4:30)');
  const [email, setEmail] = useState(user.email || 'student@example.com');
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('gdh-pref-notifications');
    return saved ? JSON.parse(saved) : {
      assignments: true,
      chat: true,
      announcements: true,
      tips: false,
      emailDigest: false
    };
  });
  const [privacy, setPrivacy] = useState(() => {
    const saved = localStorage.getItem('gdh-pref-privacy');
    return saved ? JSON.parse(saved) : {
      profilePublic: true,
      allowDirectMessages: true,
      showOnlineStatus: true
    };
  });

  useEffect(() => {
    localStorage.setItem('gdh-pref-timezone', timeZone);
    localStorage.setItem('gdh-pref-notifications', JSON.stringify(notifications));
    localStorage.setItem('gdh-pref-privacy', JSON.stringify(privacy));
  }, [timeZone, notifications, privacy]);

  const handleSave = () => {
    updateProfile({ email });
    notify('Preferences updated and saved successfully!', 'success');
  };

  const handleReset = () => {
    setLanguage('English');
    setTimeZone('Afghanistan Time (UTC +4:30)');
    setEmail(user.email || 'student@example.com');
    setTheme('light');
    setNotifications({
      assignments: true,
      chat: true,
      announcements: true,
      tips: false,
      emailDigest: false
    });
    setPrivacy({
      profilePublic: true,
      allowDirectMessages: true,
      showOnlineStatus: true
    });
    notify('Preferences restored to default values.');
  };

  return (
    <div className="preferences-page">
      <div className="page-title-banner">
        <div>
          <span className="badge-pill">STUDENT PREFERENCES</span>
          <h1>Account & Display Preferences</h1>
          <p>Customize your workspace, communication preferences, and appearance settings.</p>
        </div>
      </div>

      <div className="settings-layout-wrap">
        {/* Left Sub-tabs */}
        <aside className="settings-subnav-card">
          <span className="subnav-title">CATEGORIES</span>
          <button 
            type="button" 
            className={`subnav-tab-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <i className="fa-regular fa-user"></i>
            <div>
              <strong>Account</strong>
              <small>Profile & Email</small>
            </div>
          </button>

          <button 
            type="button" 
            className={`subnav-tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <i className="fa-solid fa-palette"></i>
            <div>
              <strong>Appearance</strong>
              <small>Theme & Colors</small>
            </div>
          </button>

          <button 
            type="button" 
            className={`subnav-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <i className="fa-regular fa-bell"></i>
            <div>
              <strong>Notifications</strong>
              <small>Alerts & Sounds</small>
            </div>
          </button>

          <button 
            type="button" 
            className={`subnav-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <i className="fa-solid fa-shield-halved"></i>
            <div>
              <strong>Privacy</strong>
              <small>Visibility & Safety</small>
            </div>
          </button>
        </aside>

        {/* Right Settings Form Body */}
        <section className="settings-panel-card">
          {activeTab === 'account' && (
            <div className="pref-section-content">
              <div className="pref-section-header">
                <div>
                  <h2>Account Details</h2>
                  <p>Manage your account locale, email contact, and sign-in preferences.</p>
                </div>
                <div className="header-icon-box bg-purple"><i className="fa-regular fa-user"></i></div>
              </div>

              <div className="mini-user-bar">
                <div className="avatar-circle-sm">{user.avatarInitials}</div>
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.role} · GraphicDesignHUB</p>
                </div>
              </div>

              <div className="form-fields-grid">
                <div className="field-box">
                  <label>Interface Language & Layout</label>
                  <select 
                    value={language} 
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      notify(`Language changed to ${e.target.value}. ${e.target.value !== 'English' ? 'RTL enabled.' : 'LTR enabled.'}`);
                    }}
                  >
                    <option value="English">English (LTR)</option>
                    <option value="Persian">Persian - فارسی (RTL)</option>
                    <option value="Dari">Dari - دری (RTL)</option>
                  </select>
                </div>

                <div className="field-box">
                  <label>Time Zone</label>
                  <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
                    <option>Afghanistan Time (UTC +4:30)</option>
                    <option>Malaysia Time (UTC +8:00)</option>
                    <option>UTC (Coordinated Universal Time)</option>
                  </select>
                </div>

                <div className="field-box full-col">
                  <label>Contact Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                  <small className="field-hint">Used for assignment feedback, receipts, and security alerts.</small>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="pref-section-content">
              <div className="pref-section-header">
                <div>
                  <h2>Appearance & Theme</h2>
                  <p>Select how GraphicDesignHUB looks on your display. Changes apply in real time.</p>
                </div>
                <div className="header-icon-box bg-pink"><i className="fa-solid fa-palette"></i></div>
              </div>

              <div className="theme-options-grid">
                {[
                  { id: 'light', name: 'Light Theme', icon: 'fa-sun', desc: 'Clean white background and dark text' },
                  { id: 'dark', name: 'Dark Theme', icon: 'fa-moon', desc: 'Deep slate background with high-contrast text' },
                  { id: 'system', name: 'System Default', icon: 'fa-desktop', desc: 'Automatically match your OS settings' }
                ].map(t => (
                  <div 
                    key={t.id} 
                    className={`theme-selection-card ${theme === t.id ? 'selected' : ''}`}
                    onClick={() => {
                      setTheme(t.id);
                      notify(`Theme set to ${t.name}.`, 'success');
                    }}
                  >
                    <div className="theme-card-icon">
                      <i className={`fa-solid ${t.icon}`}></i>
                    </div>
                    <strong>{t.name}</strong>
                    <p>{t.desc}</p>
                    {theme === t.id && (
                      <span className="selected-indicator"><i className="fa-solid fa-circle-check"></i></span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="pref-section-content">
              <div className="pref-section-header">
                <div>
                  <h2>Notification Preferences</h2>
                  <p>Choose what events trigger in-app updates and alert sounds.</p>
                </div>
                <div className="header-icon-box bg-blue"><i className="fa-regular fa-bell"></i></div>
              </div>

              <div className="toggle-rows-list">
                <div className="toggle-row-item">
                  <div>
                    <strong>Assignment updates</strong>
                    <p>Receive notifications when due dates approach or grades are posted.</p>
                  </div>
                  <label className="switch-toggle">
                    <input 
                      type="checkbox" 
                      checked={notifications.assignments} 
                      onChange={e => setNotifications({ ...notifications, assignments: e.target.checked })}
                    />
                    <span className="slider-round"></span>
                  </label>
                </div>

                <div className="toggle-row-item">
                  <div>
                    <strong>Student chat messages</strong>
                    <p>Notify me whenever classmates or mentors send new direct messages.</p>
                  </div>
                  <label className="switch-toggle">
                    <input 
                      type="checkbox" 
                      checked={notifications.chat} 
                      onChange={e => setNotifications({ ...notifications, chat: e.target.checked })}
                    />
                    <span className="slider-round"></span>
                  </label>
                </div>

                <div className="toggle-row-item">
                  <div>
                    <strong>Class announcements</strong>
                    <p>Instructor broadcasts, room changes, and live workshop reminders.</p>
                  </div>
                  <label className="switch-toggle">
                    <input 
                      type="checkbox" 
                      checked={notifications.announcements} 
                      onChange={e => setNotifications({ ...notifications, announcements: e.target.checked })}
                    />
                    <span className="slider-round"></span>
                  </label>
                </div>

                <div className="toggle-row-item">
                  <div>
                    <strong>Weekly email digest</strong>
                    <p>A summary of your weekly design progress and recommended assets.</p>
                  </div>
                  <label className="switch-toggle">
                    <input 
                      type="checkbox" 
                      checked={notifications.emailDigest} 
                      onChange={e => setNotifications({ ...notifications, emailDigest: e.target.checked })}
                    />
                    <span className="slider-round"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="pref-section-content">
              <div className="pref-section-header">
                <div>
                  <h2>Privacy & Safety</h2>
                  <p>Control who can view your design portfolio and contact you directly.</p>
                </div>
                <div className="header-icon-box bg-yellow"><i className="fa-solid fa-shield-halved"></i></div>
              </div>

              <div className="toggle-rows-list">
                <div className="toggle-row-item">
                  <div>
                    <strong>Public portfolio visibility</strong>
                    <p>Allow companies and external visitors to view your design portfolio projects.</p>
                  </div>
                  <label className="switch-toggle">
                    <input 
                      type="checkbox" 
                      checked={privacy.profilePublic} 
                      onChange={e => setPrivacy({ ...privacy, profilePublic: e.target.checked })}
                    />
                    <span className="slider-round"></span>
                  </label>
                </div>

                <div className="toggle-row-item">
                  <div>
                    <strong>Allow direct messages from classmates</strong>
                    <p>Classmates can initiate 1-on-1 chats in the Student Chat room.</p>
                  </div>
                  <label className="switch-toggle">
                    <input 
                      type="checkbox" 
                      checked={privacy.allowDirectMessages} 
                      onChange={e => setPrivacy({ ...privacy, allowDirectMessages: e.target.checked })}
                    />
                    <span className="slider-round"></span>
                  </label>
                </div>

                <div className="toggle-row-item">
                  <div>
                    <strong>Show online presence status</strong>
                    <p>Display an online badge when you are actively browsing classes.</p>
                  </div>
                  <label className="switch-toggle">
                    <input 
                      type="checkbox" 
                      checked={privacy.showOnlineStatus} 
                      onChange={e => setPrivacy({ ...privacy, showOnlineStatus: e.target.checked })}
                    />
                    <span className="slider-round"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="panel-actions-bar">
            <button type="button" className="btn-reset-text" onClick={handleReset}>
              Reset Defaults
            </button>
            <button type="button" className="btn-save-pref" onClick={handleSave}>
              <i className="fa-solid fa-check"></i> Save Changes
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

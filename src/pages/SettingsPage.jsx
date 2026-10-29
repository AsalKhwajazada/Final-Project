import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { notify } from '../utils/toast';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [role, setRoleState] = useState(() => (user.role === 'Administrator' ? 'admin' : 'student'));
  const [activePanel, setActivePanel] = useState(() => (user.role === 'Administrator' ? 'users' : 'general'));
  const [searchFilter, setSearchFilter] = useState('');

  // Settings Form State
  const [general, setGeneral] = useState({
    dateFormat: 'DD / MM / YYYY',
    landingPage: 'Dashboard',
    announcements: true,
    accessibility: true
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    signinAlerts: true
  });

  const [learning, setLearning] = useState({
    skillLevel: 'Intermediate',
    studyGoal: '3–5 hours / week',
    assignmentReminders: true,
    classAlerts: true,
    recommendedCourses: true
  });

  const [adminSettings, setAdminSettings] = useState({
    registration: 'Open',
    defaultRole: 'Student',
    requireApproval: true,
    allowSelfReg: true,
    maintenanceMode: false,
    marketplaceReview: true,
    backupFreq: 'Daily'
  });

  const switchRole = (newRole) => {
    setRoleState(newRole);
    if (newRole === 'admin') {
      updateProfile({ role: 'Administrator' });
      setActivePanel('users');
      notify('Switched to Administrator role. Admin tools unlocked.', 'success');
    } else {
      updateProfile({ role: 'Student' });
      setActivePanel('general');
      notify('Switched to Student role.');
    }
  };

  const handleSave = () => {
    notify('Workspace settings saved successfully!', 'success');
  };

  const handleReset = () => {
    notify('Workspace settings reset to defaults.');
  };

  const navItems = [
    { id: 'general', label: 'General', icon: 'fa-solid fa-sliders', roles: ['student', 'admin'] },
    { id: 'account', label: 'Account', icon: 'fa-regular fa-user', roles: ['student', 'admin'] },
    { id: 'security', label: 'Security & Sign-in', icon: 'fa-solid fa-shield-halved', roles: ['student', 'admin'] },
    { id: 'learning', label: 'Learning & Classes', icon: 'fa-solid fa-graduation-cap', roles: ['student'] },
    { id: 'users', label: 'User Management', icon: 'fa-solid fa-users-gear', roles: ['admin'] },
    { id: 'system', label: 'System & Integrations', icon: 'fa-solid fa-server', roles: ['admin'] },
    { id: 'backup', label: 'Data & Backup', icon: 'fa-solid fa-database', roles: ['admin'] }
  ].filter(item => item.roles.includes(role));

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-top-banner">
        <div>
          <span className="badge-pill">WORKSPACE CONTROL</span>
          <h1>Platform Settings</h1>
          <p>Manage your account security, study environment, and platform administration.</p>
        </div>

        {/* Role Switcher */}
        <div className="role-switch-pill">
          <button 
            type="button" 
            className={`role-btn ${role === 'student' ? 'active' : ''}`}
            onClick={() => switchRole('student')}
          >
            <i className="fa-solid fa-graduation-cap"></i> Student
          </button>
          <button 
            type="button" 
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => switchRole('admin')}
          >
            <i className="fa-solid fa-user-shield"></i> Administrator
          </button>
        </div>
      </div>

      <div className="settings-layout-wrap">
        {/* Left Subnav */}
        <aside className="settings-subnav-card">
          <div className="settings-filter-input">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              placeholder="Filter settings..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
            />
          </div>

          <span className="subnav-title">{role.toUpperCase()} CONTROLS</span>
          {navItems
            .filter(n => n.label.toLowerCase().includes(searchFilter.toLowerCase()))
            .map(item => (
              <button
                key={item.id}
                type="button"
                className={`subnav-tab-btn ${activePanel === item.id ? 'active' : ''}`}
                onClick={() => setActivePanel(item.id)}
              >
                <i className={item.icon}></i>
                <div>
                  <strong>{item.label}</strong>
                </div>
              </button>
            ))}
        </aside>

        {/* Right Settings Panel */}
        <section className="settings-panel-card">
          {/* General Panel */}
          {activePanel === 'general' && (
            <div className="pref-section-content">
              <div className="pref-section-header">
                <div>
                  <h2>General Settings</h2>
                  <p>Configure interface standards and landing experiences.</p>
                </div>
                <div className="header-icon-box bg-purple"><i className="fa-solid fa-sliders"></i></div>
              </div>

              <div className="form-fields-grid">
                <div className="field-box">
                  <label>Date Format</label>
                  <select 
                    value={general.dateFormat} 
                    onChange={e => setGeneral({ ...general, dateFormat: e.target.value })}
                  >
                    <option>DD / MM / YYYY</option>
                    <option>MM / DD / YYYY</option>
                    <option>YYYY / MM / DD</option>
                  </select>
                </div>

                <div className="field-box">
                  <label>Default Landing Page</label>
                  <select 
                    value={general.landingPage} 
                    onChange={e => setGeneral({ ...general, landingPage: e.target.value })}
                  >
                    <option>Dashboard</option>
                    <option>My Profile</option>
                    <option>Design Classes</option>
                  </select>
                </div>
              </div>

              <div className="toggle-rows-list mt-4">
                <div className="toggle-row-item">
                  <div>
                    <strong>Product Announcements</strong>
                    <p>Display modal notifications about platform feature updates.</p>
                  </div>
                  <label className="switch-toggle">
                    <input 
                      type="checkbox" 
                      checked={general.announcements} 
                      onChange={e => setGeneral({ ...general, announcements: e.target.checked })}
                    />
                    <span className="slider-round"></span>
                  </label>
                </div>

                <div className="toggle-row-item">
                  <div>
                    <strong>High Contrast & Accessibility Focus</strong>
                    <p>Highlight focused form fields with bold outlines for assistive navigation.</p>
                  </div>
                  <label className="switch-toggle">
                    <input 
                      type="checkbox" 
                      checked={general.accessibility} 
                      onChange={e => setGeneral({ ...general, accessibility: e.target.checked })}
                    />
                    <span className="slider-round"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Account Panel */}
          {activePanel === 'account' && (
            <div className="pref-section-content">
              <div className="pref-section-header">
                <div>
                  <h2>Account Information</h2>
                  <p>Review current login identity and account permissions.</p>
                </div>
                <div className="header-icon-box bg-blue"><i className="fa-regular fa-user"></i></div>
              </div>

              <div className="mini-user-bar">
                <div className="avatar-circle-sm">{user.avatarInitials}</div>
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.role} · GraphicDesignHUB Verified</p>
                </div>
              </div>

              <div className="form-fields-grid">
                <div className="field-box">
                  <label>Display Name</label>
                  <input type="text" defaultValue={user.name} />
                </div>
                <div className="field-box">
                  <label>Email Address</label>
                  <input type="email" defaultValue={user.email} />
                </div>
              </div>
            </div>
          )}

          {/* Security Panel */}
          {activePanel === 'security' && (
            <div className="pref-section-content">
              <div className="pref-section-header">
                <div>
                  <h2>Security & Sign-in Controls</h2>
                  <p>Protect your creative hub credentials and review active browser sessions.</p>
                </div>
                <div className="header-icon-box bg-pink"><i className="fa-solid fa-shield-halved"></i></div>
              </div>

              <div className="toggle-rows-list">
                <div className="toggle-row-item">
                  <div>
                    <strong>Two-Factor Authentication (2FA)</strong>
                    <p>Require a 6-digit verification code when signing in on a new device.</p>
                  </div>
                  <label className="switch-toggle">
                    <input 
                      type="checkbox" 
                      checked={security.twoFactor} 
                      onChange={e => setSecurity({ ...security, twoFactor: e.target.checked })}
                    />
                    <span className="slider-round"></span>
                  </label>
                </div>

                <div className="toggle-row-item">
                  <div>
                    <strong>New Device Sign-in Alerts</strong>
                    <p>Send immediate email notification whenever a new browser session starts.</p>
                  </div>
                  <label className="switch-toggle">
                    <input 
                      type="checkbox" 
                      checked={security.signinAlerts} 
                      onChange={e => setSecurity({ ...security, signinAlerts: e.target.checked })}
                    />
                    <span className="slider-round"></span>
                  </label>
                </div>
              </div>

              <div className="quick-action-cards-grid mt-4">
                <div className="action-row-box">
                  <div>
                    <strong>Account Password</strong>
                    <p>Last changed 42 days ago</p>
                  </div>
                  <button 
                    type="button" 
                    className="btn-outline-action"
                    onClick={() => notify('Password change prompt (demo mode active).')}
                  >
                    Update Password
                  </button>
                </div>

                <div className="action-row-box">
                  <div>
                    <strong>Active Devices</strong>
                    <p>1 session active (Windows · Chrome)</p>
                  </div>
                  <button 
                    type="button" 
                    className="btn-outline-action"
                    onClick={() => notify('Current session is verified.')}
                  >
                    View Devices
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Learning Panel */}
          {activePanel === 'learning' && (
            <div className="pref-section-content">
              <div className="pref-section-header">
                <div>
                  <h2>Learning & Study Goals</h2>
                  <p>Customize your study pace and course recommendations.</p>
                </div>
                <div className="header-icon-box bg-yellow"><i className="fa-solid fa-graduation-cap"></i></div>
              </div>

              <div className="form-fields-grid">
                <div className="field-box">
                  <label>Current Skill Level</label>
                  <select 
                    value={learning.skillLevel}
                    onChange={e => setLearning({ ...learning, skillLevel: e.target.value })}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced / Professional</option>
                  </select>
                </div>

                <div className="field-box">
                  <label>Weekly Study Target</label>
                  <select 
                    value={learning.studyGoal}
                    onChange={e => setLearning({ ...learning, studyGoal: e.target.value })}
                  >
                    <option>1–2 hours / week</option>
                    <option>3–5 hours / week</option>
                    <option>5–10 hours / week</option>
                  </select>
                </div>
              </div>

              <div className="toggle-rows-list mt-4">
                <div className="toggle-row-item">
                  <div>
                    <strong>Assignment Reminders</strong>
                    <p>Get push reminders 24 hours prior to submission deadlines.</p>
                  </div>
                  <label className="switch-toggle">
                    <input 
                      type="checkbox" 
                      checked={learning.assignmentReminders} 
                      onChange={e => setLearning({ ...learning, assignmentReminders: e.target.checked })}
                    />
                    <span className="slider-round"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Admin: Users Management */}
          {activePanel === 'users' && (
            <div className="pref-section-content">
              <div className="pref-section-header">
                <div>
                  <h2>User & Membership Management</h2>
                  <p>Admin overview of registered students, instructors, and admission queues.</p>
                </div>
                <div className="header-icon-box bg-purple"><i className="fa-solid fa-users-gear"></i></div>
              </div>

              <div className="admin-stats-row">
                <div className="admin-stat-card">
                  <small>TOTAL REGISTERED</small>
                  <strong>1,420</strong>
                  <span>Active accounts</span>
                </div>
                <div className="admin-stat-card">
                  <small>STUDENTS</small>
                  <strong>1,248</strong>
                  <span>Enrolled learners</span>
                </div>
                <div className="admin-stat-card">
                  <small>INSTRUCTORS</small>
                  <strong>172</strong>
                  <span>Approved mentors</span>
                </div>
              </div>

              <div className="form-fields-grid mt-4">
                <div className="field-box">
                  <label>New Account Registration</label>
                  <select 
                    value={adminSettings.registration}
                    onChange={e => setAdminSettings({ ...adminSettings, registration: e.target.value })}
                  >
                    <option>Open (Public self-registration)</option>
                    <option>Invite Only</option>
                    <option>Closed (Admissions paused)</option>
                  </select>
                </div>

                <div className="field-box">
                  <label>Default Role for New Users</label>
                  <select 
                    value={adminSettings.defaultRole}
                    onChange={e => setAdminSettings({ ...adminSettings, defaultRole: e.target.value })}
                  >
                    <option>Student</option>
                    <option>Pending Approval</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Admin: System */}
          {activePanel === 'system' && (
            <div className="pref-section-content">
              <div className="pref-section-header">
                <div>
                  <h2>System Configuration & Integrations</h2>
                  <p>Set platform maintenance flags and marketplace moderation rules.</p>
                </div>
                <div className="header-icon-box bg-blue"><i className="fa-solid fa-server"></i></div>
              </div>

              <div className="toggle-rows-list">
                <div className="toggle-row-item">
                  <div>
                    <strong>Maintenance Mode</strong>
                    <p>Restrict student access while system upgrades are performed.</p>
                  </div>
                  <label className="switch-toggle">
                    <input 
                      type="checkbox" 
                      checked={adminSettings.maintenanceMode} 
                      onChange={e => setAdminSettings({ ...adminSettings, maintenanceMode: e.target.checked })}
                    />
                    <span className="slider-round"></span>
                  </label>
                </div>

                <div className="toggle-row-item">
                  <div>
                    <strong>Marketplace Submissions Pre-Approval</strong>
                    <p>Require staff moderation before new assets are published to the marketplace.</p>
                  </div>
                  <label className="switch-toggle">
                    <input 
                      type="checkbox" 
                      checked={adminSettings.marketplaceReview} 
                      onChange={e => setAdminSettings({ ...adminSettings, marketplaceReview: e.target.checked })}
                    />
                    <span className="slider-round"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Admin: Backup */}
          {activePanel === 'backup' && (
            <div className="pref-section-content">
              <div className="pref-section-header">
                <div>
                  <h2>Data Integrity & Automated Backup</h2>
                  <p>Schedule platform snapshots and storage replication.</p>
                </div>
                <div className="header-icon-box bg-green"><i className="fa-solid fa-database"></i></div>
              </div>

              <div className="form-fields-grid">
                <div className="field-box">
                  <label>Automatic Backup Schedule</label>
                  <select 
                    value={adminSettings.backupFreq}
                    onChange={e => setAdminSettings({ ...adminSettings, backupFreq: e.target.value })}
                  >
                    <option>Daily at Midnight (00:00 UTC)</option>
                    <option>Weekly (Sundays)</option>
                    <option>Monthly Snapshot</option>
                  </select>
                </div>
              </div>

              <div className="danger-zone-box mt-4">
                <strong><i className="fa-solid fa-triangle-exclamation"></i> Protected Operations</strong>
                <p>Database restore and hard asset purge operations require server-side dual confirmation.</p>
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="panel-actions-bar">
            <button type="button" className="btn-reset-text" onClick={handleReset}>
              Reset Settings
            </button>
            <button type="button" className="btn-save-pref" onClick={handleSave}>
              <i className="fa-solid fa-check"></i> Save Settings
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notify } from '../utils/toast';

export default function MyProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsEditModalOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const [skills, setSkills] = useState([
    'Figma & FigJam',
    'Design Systems',
    'User Research',
    'Wireframing',
    'Color Theory',
    'Blender 3D Basics',
    'Adobe Illustrator'
  ]);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Edit form state
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [location, setLocation] = useState(user.location);
  const [bio, setBio] = useState(user.bio);

  const calculateCompletion = () => {
    let score = 50;
    if (user.bio && user.bio.length > 20) score += 20;
    if (user.location) score += 15;
    if (skills.length >= 5) score += 15;
    return Math.min(score, 100);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateProfile({
      name: name.trim(),
      role: role.trim() || 'Creative Learner',
      location: location.trim() || 'Bandar Baru Nilai, Malaysia',
      bio: bio.trim() || 'Graphic design student building modern creative projects.'
    });

    setIsEditModalOpen(false);
    notify('Profile updated successfully!', 'success');
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const clean = newSkillInput.trim();
    if (!clean) return;

    if (skills.some(s => s.toLowerCase() === clean.toLowerCase())) {
      notify('This skill is already listed in your profile.', 'error');
      return;
    }

    setSkills(prev => [...prev, clean]);
    setNewSkillInput('');
    notify(`Skill "${clean}" added!`, 'success');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
    notify(`Removed skill "${skillToRemove}".`);
  };

  const completion = calculateCompletion();

  return (
    <div className="profile-page">
      {/* Cover and Header Banner */}
      <section className="profile-header-banner">
        <div className="profile-cover-gradient"></div>
        <div className="profile-banner-content">
          <div className="profile-avatar-giant">
            {user.avatarInitials}
            <button 
              type="button" 
              className="avatar-change-badge"
              onClick={() => notify('Profile avatar photo upload is active in demo mode.')}
              title="Change avatar photo"
            >
              <i className="fa-solid fa-camera"></i>
            </button>
          </div>

          <div className="profile-intro-text">
            <div className="profile-name-row">
              <h2>{user.name}</h2>
              <span className="profile-role-badge">{user.role}</span>
            </div>
            <p className="profile-location">
              <i className="fa-solid fa-location-dot"></i> {user.location} · <i className="fa-solid fa-envelope"></i> {user.email}
            </p>
            <p className="profile-bio-text">{user.bio}</p>
          </div>

          <div className="profile-actions-right">
            <button 
              type="button" 
              className="btn-edit-profile-action"
              onClick={() => {
                setName(user.name);
                setRole(user.role);
                setLocation(user.location);
                setBio(user.bio);
                setIsEditModalOpen(true);
              }}
            >
              <i className="fa-solid fa-pen"></i> Edit Profile
            </button>
          </div>
        </div>
      </section>

      {/* Profile Main Columns */}
      <div className="profile-columns-layout">
        {/* Left Column: Skills & Bio */}
        <div className="profile-left-col">
          {/* Profile Completion Card */}
          <div className="profile-card completion-card">
            <div className="completion-header">
              <strong>Profile Strength</strong>
              <span className="completion-val">{completion}%</span>
            </div>
            <div className="completion-bar-bg">
              <div className="completion-bar-fill" style={{ width: `${completion}%` }}></div>
            </div>
            <small className="completion-hint">
              {completion === 100 
                ? 'Your profile is fully completed and verified!' 
                : 'Add more skills and portfolio links to reach 100% profile strength.'}
            </small>
          </div>

          {/* Skills Management Card */}
          <div className="profile-card">
            <div className="card-header-simple">
              <h3><i className="fa-solid fa-certificate text-purple"></i> Design Skills</h3>
              <span className="text-muted">{skills.length} skills</span>
            </div>

            <div className="skills-tags-cloud">
              {skills.map((skill) => (
                <span key={skill} className="skill-pill-tag">
                  {skill}
                  <button 
                    type="button" 
                    className="skill-remove-btn"
                    onClick={() => handleRemoveSkill(skill)}
                    title={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Form */}
            <form className="add-skill-form" onSubmit={handleAddSkill}>
              <input 
                type="text" 
                placeholder="Add a new skill (e.g. Cinema 4D)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
              />
              <button type="submit" className="btn-add-skill">
                <i className="fa-solid fa-plus"></i> Add
              </button>
            </form>
          </div>

          {/* Social Links Card */}
          <div className="profile-card">
            <div className="card-header-simple">
              <h3><i className="fa-solid fa-share-nodes text-pink"></i> External Links</h3>
            </div>
            <div className="profile-links-list">
              <a href="#" className="ext-link-item" onClick={(e) => { e.preventDefault(); notify('Opening Figma Community portfolio link'); }}>
                <i className="fa-brands fa-figma text-pink"></i>
                <span>figma.com/@arezostudent</span>
              </a>
              <a href="#" className="ext-link-item" onClick={(e) => { e.preventDefault(); notify('Opening Behance showcase link'); }}>
                <i className="fa-brands fa-behance text-blue"></i>
                <span>behance.net/arezo-design</span>
              </a>
              <a href="#" className="ext-link-item" onClick={(e) => { e.preventDefault(); notify('Opening GitHub profile link'); }}>
                <i className="fa-brands fa-github text-dark"></i>
                <span>github.com/arezostudent</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Enrolled Classes & Academic Badges */}
        <div className="profile-right-col">
          {/* Active Courses Card */}
          <div className="profile-card">
            <div className="card-header-simple">
              <h3><i className="fa-solid fa-graduation-cap text-blue"></i> Enrolled Programs</h3>
            </div>

            <div className="profile-courses-list">
              <div className="profile-course-item">
                <div className="course-icon-cube bg-pink"><i className="fa-solid fa-palette"></i></div>
                <div className="course-main-meta">
                  <strong>UI/UX Design Masterclass & Brand Systems</strong>
                  <p>Instructor: Prof. Dr. Muhammad Shamsir · 68% Completed</p>
                  <div className="progress-bar-bg-mini">
                    <div className="progress-bar-fill" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>

              <div className="profile-course-item">
                <div className="course-icon-cube bg-purple"><i className="fa-solid fa-cubes"></i></div>
                <div className="course-main-meta">
                  <strong>3D Modeling & Blender Professional Suite</strong>
                  <p>Instructor: Prof. Dr. Khairullah · 40% Completed</p>
                  <div className="progress-bar-bg-mini">
                    <div className="progress-bar-fill" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>

              <div className="profile-course-item">
                <div className="course-icon-cube bg-yellow"><i className="fa-solid fa-pen-nib"></i></div>
                <div className="course-main-meta">
                  <strong>Logo & Brand Identity Basics</strong>
                  <p>Instructor: Sarah Jenkins · 85% Completed</p>
                  <div className="progress-bar-bg-mini">
                    <div className="progress-bar-fill" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Achievements / Certificates */}
          <div className="profile-card">
            <div className="card-header-simple">
              <h3><i className="fa-solid fa-award text-warning"></i> Badges & Certifications</h3>
            </div>
            <div className="badges-grid-list">
              <div className="badge-cert-card">
                <i className="fa-solid fa-shield-cat text-pink"></i>
                <strong>Figma Specialist</strong>
                <small>Issued Feb 2026</small>
              </div>
              <div className="badge-cert-card">
                <i className="fa-solid fa-trophy text-warning"></i>
                <strong>Top 5% Learner</strong>
                <small>Winter Sprint 2026</small>
              </div>
              <div className="badge-cert-card">
                <i className="fa-solid fa-medal text-blue"></i>
                <strong>Design Sprint Winner</strong>
                <small>Alpro Studio</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile Details</h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setIsEditModalOpen(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSaveProfile}>
              <div className="modal-body">
                <div className="form-field-group">
                  <label htmlFor="edit-name">Display Name *</label>
                  <input 
                    id="edit-name"
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-field-group">
                  <label htmlFor="edit-role">Headline / Role *</label>
                  <input 
                    id="edit-role"
                    type="text" 
                    value={role} 
                    onChange={e => setRole(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-field-group">
                  <label htmlFor="edit-location">Location</label>
                  <input 
                    id="edit-location"
                    type="text" 
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                  />
                </div>
                <div className="form-field-group">
                  <label htmlFor="edit-bio">Short Bio</label>
                  <textarea 
                    id="edit-bio"
                    rows="3" 
                    value={bio} 
                    onChange={e => setBio(e.target.value)} 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={!name.trim()}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

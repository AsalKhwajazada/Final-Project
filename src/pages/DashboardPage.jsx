import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notify } from '../utils/toast';

const INITIAL_COURSES = [
  {
    id: 1,
    title: 'UI/UX Design Masterclass',
    badge: 'UI/UX',
    color: 'pink',
    instructor: 'Prof. Dr. Muhammad Shamsir',
    lessons: '24 Lessons · 6 Weeks',
    progress: 68,
    activeLesson: 'Lesson 4: Auto-Layout 5.0 & Responsive Components',
    videoDuration: '24:18'
  },
  {
    id: 2,
    title: 'Logo & Brand Identity Basics',
    badge: 'Branding',
    color: 'blue',
    instructor: 'Sarah Jenkins',
    lessons: '16 Lessons · 4 Weeks',
    progress: 40,
    activeLesson: 'Lesson 3: Constructing Geometric Grid Systems',
    videoDuration: '18:45'
  },
  {
    id: 3,
    title: '3D Modeling & Blender Pro Suite',
    badge: '3D Art',
    color: 'purple',
    instructor: 'Prof. Dr. Khairullah',
    lessons: '32 Lessons · 8 Weeks',
    progress: 25,
    activeLesson: 'Lesson 2: Lighting Techniques with Cycles Renderer',
    videoDuration: '32:10'
  },
  {
    id: 4,
    title: 'Advanced Photoshop & Retouching',
    badge: 'Photoshop',
    color: 'yellow',
    instructor: 'Alex Rivera',
    lessons: '18 Lessons · 5 Weeks',
    progress: 85,
    activeLesson: 'Lesson 8: Frequency Separation Skin Retouching',
    videoDuration: '15:20'
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [activeCourseModal, setActiveCourseModal] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setActiveCourseModal(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenCourse = (cls) => {
    setActiveCourseModal(cls);
    setIsPlaying(false);
  };

  const handleCompleteCurrentLesson = () => {
    if (!activeCourseModal) return;
    setCourses(prev => prev.map(c => {
      if (c.id === activeCourseModal.id) {
        const nextProg = Math.min(100, c.progress + 10);
        return { ...c, progress: nextProg };
      }
      return c;
    }));
    notify(`Completed lesson! Course progress updated.`, 'success');
  };

  return (
    <div className="dashboard-page">
      {/* Hero Welcome Banner */}
      <section className="dash-hero-card">
        <div className="dash-hero-content">
          <span className="badge-pill">CREATIVE HUB 2026</span>
          <h1>Welcome back, {user.name}!</h1>
          <p>
            Continue your design journey today. You have <strong>2 assignments due this week</strong> and 
            new messages from your mentor in the UI/UX Masterclass.
          </p>
          <div className="hero-cta-group">
            <Link to="/assignments" className="btn-primary">
              <i className="fa-solid fa-list-check"></i> View Assignments
            </Link>
            <Link to="/find-instructor" className="btn-secondary">
              <i className="fa-solid fa-user-tie"></i> Book Mentor Session
            </Link>
          </div>
        </div>
        <div className="dash-hero-decoration">
          <i className="fa-solid fa-wand-magic-sparkles magic-icon"></i>
        </div>
      </section>

      {/* Stats Quick Grid */}
      <section className="stats-metric-grid">
        <div className="metric-card">
          <div className="metric-icon-box bg-purple">
            <i className="fa-solid fa-book-open"></i>
          </div>
          <div className="metric-info">
            <span className="metric-label">Enrolled Classes</span>
            <strong className="metric-val">{courses.length}</strong>
            <small className="metric-hint text-success"><i className="fa-solid fa-arrow-trend-up"></i> 2 in progress</small>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box bg-pink">
            <i className="fa-solid fa-folder-open"></i>
          </div>
          <div className="metric-info">
            <span className="metric-label">Pending Tasks</span>
            <strong className="metric-val">2</strong>
            <small className="metric-hint text-warning"><i className="fa-solid fa-clock"></i> Due in 48 hours</small>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box bg-blue">
            <i className="fa-solid fa-images"></i>
          </div>
          <div className="metric-info">
            <span className="metric-label">Portfolio Items</span>
            <strong className="metric-val">4</strong>
            <small className="metric-hint text-info"><i className="fa-solid fa-eye"></i> 142 views this week</small>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box bg-green">
            <i className="fa-solid fa-coins"></i>
          </div>
          <div className="metric-info">
            <span className="metric-label">Market Balance</span>
            <strong className="metric-val">120 RM</strong>
            <small className="metric-hint text-muted">Ready to spend</small>
          </div>
        </div>
      </section>

      {/* Two Column Layout for Classes & Highlights */}
      <div className="dash-columns-layout">
        {/* Left Column: Popular Design Classes */}
        <div className="dash-main-col">
          <div className="section-header-row">
            <div>
              <h2>Featured Design Classes</h2>
              <p>Top rated courses selected for your career track</p>
            </div>
            <Link to="/find-academy" className="view-all-link">
              View all <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className="classes-list-cards">
            {courses.map((cls) => (
              <div key={cls.id} className="course-card-horizontal">
                <div className={`course-badge-icon bg-${cls.color}`}>
                  <i className="fa-solid fa-palette"></i>
                </div>
                <div className="course-details">
                  <div className="course-title-row">
                    <h3>{cls.title}</h3>
                    <span className="course-tag">{cls.badge}</span>
                  </div>
                  <p className="course-instructor">
                    <i className="fa-solid fa-chalkboard-user"></i> {cls.instructor} · <small>{cls.lessons}</small>
                  </p>
                  <div className="course-progress-bar-wrap">
                    <div className="course-progress-bar" style={{ width: `${cls.progress}%` }}></div>
                  </div>
                </div>
                <div className="course-action-wrap">
                  <span className="progress-percent">{cls.progress}%</span>
                  <button 
                    type="button" 
                    className="btn-continue-class"
                    onClick={() => handleOpenCourse(cls)}
                  >
                    Continue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Mentors & Marketplace Quick Cards */}
        <div className="dash-side-col">
          {/* Top Mentors Card */}
          <div className="dash-widget-card">
            <div className="widget-header">
              <h3><i className="fa-solid fa-star text-warning"></i> Top Mentors</h3>
              <Link to="/find-instructor" className="widget-link">Explore</Link>
            </div>
            <div className="mentors-mini-list">
              <div className="mentor-mini-item">
                <img src="/images/c6f3394289ca9038f446be207c032d8a.jpg" alt="Prof. Shamsir" className="mentor-mini-img" />
                <div className="mentor-mini-info">
                  <strong>Prof. Dr. Muhammad Shamsir</strong>
                  <p>UI/UX Design Masterclass</p>
                  <span className="mentor-avail text-success"><i className="fa-solid fa-circle"></i> Available Tue</span>
                </div>
                <Link to="/find-instructor" className="mentor-mini-btn" title="View profile">
                  <i className="fa-solid fa-chevron-right"></i>
                </Link>
              </div>

              <div className="mentor-mini-item">
                <img src="/images/c6f3394289ca9038f446be207c032d8a.jpg" alt="Prof. Khairullah" className="mentor-mini-img" />
                <div className="mentor-mini-info">
                  <strong>Prof. Dr. Khairullah</strong>
                  <p>3D Modeling & Blender</p>
                  <span className="mentor-avail text-info"><i className="fa-solid fa-circle"></i> Available Thu</span>
                </div>
                <Link to="/find-instructor" className="mentor-mini-btn" title="View profile">
                  <i className="fa-solid fa-chevron-right"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* Design Academies Card */}
          <div className="dash-widget-card">
            <div className="widget-header">
              <h3><i className="fa-solid fa-school text-pink"></i> Partner Academies</h3>
              <Link to="/find-academy" className="widget-link">All</Link>
            </div>
            <div className="academy-mini-list">
              <div className="academy-item-link">
                <div className="academy-icon bg-pink"><i className="fa-solid fa-graduation-cap"></i></div>
                <div>
                  <strong>Alpro Design Studio</strong>
                  <small>Kuala Lumpur · 12 Active Courses</small>
                </div>
              </div>
              <div className="academy-item-link">
                <div className="academy-icon bg-blue"><i className="fa-solid fa-landmark"></i></div>
                <div>
                  <strong>Pekan Creative Hub</strong>
                  <small>Nilai, Malaysia · 8 Active Courses</small>
                </div>
              </div>
            </div>
          </div>

          {/* Asset Marketplace Teaser */}
          <div className="dash-widget-card">
            <div className="widget-header">
              <h3><i className="fa-solid fa-store text-purple"></i> Asset Marketplace</h3>
              <Link to="/asset-marketplace" className="widget-link">Shop</Link>
            </div>
            <div className="market-teaser-box">
              <p>Explore thousands of Figma UI kits, 3D icons, and font packs created by top creators.</p>
              <Link to="/asset-marketplace" className="btn-market-teaser">
                <i className="fa-solid fa-cart-shopping"></i> Browse 1,200+ Assets
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Classroom Lesson Video Modal */}
      {activeCourseModal && (
        <div className="modal-backdrop" onClick={() => setActiveCourseModal(null)}>
          <div className="modal-card course-player-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="course-tag">{activeCourseModal.badge}</span>
                <h3>{activeCourseModal.title}</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setActiveCourseModal(null)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="modal-body p-0">
              {/* Simulated Video Player */}
              <div className="course-video-viewport">
                <div className="video-player-screen">
                  <button 
                    type="button" 
                    className="video-play-trigger"
                    onClick={() => {
                      setIsPlaying(!isPlaying);
                      notify(isPlaying ? 'Video paused.' : 'Playing video lesson...');
                    }}
                  >
                    <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                  </button>
                  <span className="video-time-indicator">
                    {isPlaying ? 'Playing • 05:42' : '00:00'} / {activeCourseModal.videoDuration}
                  </span>
                </div>
                <div className="video-progress-tracker">
                  <div className="video-progress-fill" style={{ width: isPlaying ? '25%' : '0%' }}></div>
                </div>
              </div>

              <div className="course-player-details">
                <h4>{activeCourseModal.activeLesson}</h4>
                <p className="instructor-sub">Taught by <strong>{activeCourseModal.instructor}</strong></p>

                <div className="lesson-syllabus-list">
                  <div className="syllabus-item completed">
                    <i className="fa-solid fa-circle-check text-success"></i>
                    <span>1. Foundations & Design Principles</span>
                    <small>12:40</small>
                  </div>
                  <div className="syllabus-item completed">
                    <i className="fa-solid fa-circle-check text-success"></i>
                    <span>2. Wireframing & Information Architecture</span>
                    <small>18:30</small>
                  </div>
                  <div className="syllabus-item active">
                    <i className="fa-solid fa-circle-play text-primary"></i>
                    <span>3. Auto-Layout 5.0 in Practice (Current)</span>
                    <small>{activeCourseModal.videoDuration}</small>
                  </div>
                  <div className="syllabus-item locked">
                    <i className="fa-solid fa-lock text-muted"></i>
                    <span>4. Prototyping & Motion Transitions</span>
                    <small>22:00</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setActiveCourseModal(null)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn-primary"
                onClick={handleCompleteCurrentLesson}
              >
                <i className="fa-solid fa-check"></i> Mark Lesson Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { notify } from '../utils/toast';

const ACADEMIES_DATA = [
  {
    id: 1,
    name: 'Alpro Design Studio & Academy',
    badge: 'Premier Academy',
    color: 'pink',
    location: 'Bandar Baru Nilai, Negeri Sembilan, Malaysia',
    phone: '+60 6-799 1234',
    students: '340 Students',
    rating: '4.9 ★ (88 reviews)',
    description: 'Specialized in UI/UX product design, interactive prototypes, and design systems for enterprise software.',
    courses: ['UI/UX Bootcamp', 'Design Systems with Figma', 'Mobile Interaction Design'],
    openHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
    facilities: ['Dedicated Mac Labs with 27-inch 5K Displays', 'Wacom Cintiq Pro Drawing Desks', 'Design Thinking Collaborative Lounge', 'High-Speed Optical Fiber Network']
  },
  {
    id: 2,
    name: 'Pekan Creative Hub',
    badge: 'Certified Training Center',
    color: 'blue',
    location: 'Cyberjaya Innovation Quarter, Malaysia',
    phone: '+60 3-8312 5560',
    students: '210 Students',
    rating: '4.8 ★ (62 reviews)',
    description: 'Leading digital arts facility offering high-end Blender 3D rendering labs and motion graphics courses.',
    courses: ['Blender 3D Masterclass', 'After Effects Motion Graphics', 'Game Art Fundamentals'],
    openHours: 'Mon - Sat: 10:00 AM - 8:00 PM',
    facilities: ['RTX 4090 GPU Render Farm', 'VR / AR Testing Rig', 'Chroma Key Green Screen Studio', 'Motion Capture Room']
  },
  {
    id: 3,
    name: 'OK Graphic Center',
    badge: 'Industry Partner',
    color: 'purple',
    location: 'Mid Valley City, Kuala Lumpur, Malaysia',
    phone: '+60 3-2284 9901',
    students: '450 Students',
    rating: '5.0 ★ (140 reviews)',
    description: 'Corporate branding, typography, packaging design, and commercial brand strategy lab.',
    courses: ['Brand Identity Architecture', 'Commercial Packaging', 'Typography & Editorial'],
    openHours: 'Mon - Fri: 8:30 AM - 5:30 PM',
    facilities: ['Heidelberg Digital Print Proofer', 'Packaging Prototype Cutters', 'Rare Typographic Specimen Library', 'Pantone Color Formulation Lab']
  },
  {
    id: 4,
    name: 'Digital Design Institute Nilai',
    badge: 'Accredited Campus',
    color: 'yellow',
    location: 'Nilai Square Commercial Centre, Malaysia',
    phone: '+60 6-850 3344',
    students: '180 Students',
    rating: '4.7 ★ (45 reviews)',
    description: 'Hands-on foundation workshops for beginners entering illustration, vector graphics, and digital media.',
    courses: ['Adobe Illustrator Essentials', 'Vector Illustration', 'Digital Media Foundations'],
    openHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    facilities: ['Beginner Friendly Drawing Pads', 'Step-by-step Instructor Screens', 'Student Showcase Gallery Space', 'Study Pods with Free Coffee']
  }
];

export default function FindAcademyPage() {
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAcademy, setSelectedAcademy] = useState(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setSelectedAcademy(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = ACADEMIES_DATA.filter((academy) => {
    return (
      academy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      academy.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      academy.courses.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleEnroll = (academyName) => {
    notify(`Inquiry sent to ${academyName}! An admissions advisor will contact you.`, 'success');
  };

  return (
    <div className="find-academy-page">
      {/* Hero Banner */}
      <section className="academy-hero-banner">
        <div className="academy-hero-inner">
          <span className="badge-pill">CAMPUS NETWORK</span>
          <h1>Find a Design Academy</h1>
          <p>Discover certified physical and hybrid creative design centers across Malaysia and Southeast Asia.</p>

          <div className="hero-search-wrapper">
            <div className="search-input-field">
              <i className="fa-solid fa-graduation-cap"></i>
              <input 
                type="text" 
                placeholder="Search academy by name, city, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="button" 
              className="btn-search-submit"
              onClick={() => notify(`Found ${filtered.length} matching academies.`)}
            >
              SEARCH ACADEMIES
            </button>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="instructor-toolbar">
        <div className="results-count">
          Showing <strong>{filtered.length}</strong> accredited design academies
        </div>
        <div className="view-toggle-container">
          <button 
            type="button"
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <i className="fa-solid fa-list"></i> Academy Cards
          </button>
          <button 
            type="button"
            className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            <i className="fa-solid fa-map-location-dot"></i> Campus Map
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="academies-grid-layout">
          {filtered.map((academy) => (
            <div key={academy.id} className="academy-full-card">
              <div className="academy-header-part">
                <div className={`academy-icon-large bg-${academy.color}`}>
                  <i className="fa-solid fa-school"></i>
                </div>
                <div className="academy-title-area">
                  <div className="academy-badge-tag">{academy.badge}</div>
                  <h3>{academy.name}</h3>
                  <p className="academy-location-str">
                    <i className="fa-solid fa-location-dot"></i> {academy.location}
                  </p>
                </div>
                <div className="academy-score-pill">
                  {academy.rating}
                </div>
              </div>

              <div className="academy-body-part">
                <p className="academy-desc">{academy.description}</p>
                
                <div className="academy-courses-list">
                  <strong>Featured Programs:</strong>
                  <div className="program-chips">
                    {academy.courses.map((course, idx) => (
                      <span key={idx} className="program-chip">{course}</span>
                    ))}
                  </div>
                </div>

                <div className="academy-meta-info">
                  <span><i className="fa-solid fa-users"></i> {academy.students}</span>
                  <span><i className="fa-solid fa-phone"></i> {academy.phone}</span>
                  <span><i className="fa-regular fa-clock"></i> {academy.openHours}</span>
                </div>
              </div>

              <div className="academy-actions-footer">
                <button 
                  type="button" 
                  className="btn-academy-secondary"
                  onClick={() => setSelectedAcademy(academy)}
                >
                  <i className="fa-solid fa-circle-info"></i> More Details
                </button>
                <button 
                  type="button" 
                  className="btn-academy-primary"
                  onClick={() => handleEnroll(academy.name)}
                >
                  <i className="fa-solid fa-paper-plane"></i> Apply & Schedule Visit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Campus Map View */
        <div className="academy-map-view-shell">
          <div className="map-view-hero">
            <h3>GraphicDesignHUB Campus Map</h3>
            <p>Our official campus network covers key educational and creative regions.</p>
          </div>
          <div className="academy-map-image-wrap">
            <img 
              src="/images/d1e40b537f456a52df33f7ab89ce9cc8.jpg" 
              alt="Academy Campus Map" 
              className="academy-map-img" 
            />
            <div className="map-info-banner-bottom">
              <i className="fa-solid fa-location-crosshairs"></i> All campuses are equipped with high-speed Mac labs, Wacom drawing tables, and 3D rendering workstations.
            </div>
          </div>
        </div>
      )}

      {/* Academy Detail Modal */}
      {selectedAcademy && (
        <div className="modal-backdrop" onClick={() => setSelectedAcademy(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="academy-badge-tag">{selectedAcademy.badge}</span>
                <h3>{selectedAcademy.name}</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setSelectedAcademy(null)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Location:</strong> {selectedAcademy.location}</p>
              <p><strong>Contact:</strong> {selectedAcademy.phone} · {selectedAcademy.openHours}</p>
              <p><strong>About:</strong> {selectedAcademy.description}</p>
              
              <div>
                <strong className="block mb-2 text-primary">Campus Equipment & Facilities:</strong>
                <ul className="facilities-modal-list">
                  {selectedAcademy.facilities.map((fac, i) => (
                    <li key={i}><i className="fa-solid fa-circle-check text-success"></i> {fac}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setSelectedAcademy(null)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => {
                  handleEnroll(selectedAcademy.name);
                  setSelectedAcademy(null);
                }}
              >
                <i className="fa-solid fa-calendar-check"></i> Book Campus Tour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

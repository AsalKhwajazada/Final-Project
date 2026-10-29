import { useState, useEffect } from 'react';
import { notify } from '../utils/toast';

const INSTRUCTORS_DATA = [
  {
    id: 1,
    name: 'Prof. Dr. Muhammad Shamsir Bin Mohd Aris',
    tag: 'UI/UX Design Masterclass & Brand Identity',
    status: 'Visiting Consultant',
    address: 'Lot 193,194 Jalan Nilai Square 6, Bandar Baru Nilai, Malaysia',
    phone: '+60126504921',
    languages: 'English, Malay',
    specialty: 'uiux',
    availability: 'Tuesday, March 22',
    rating: '4.9 (128 reviews)',
    avatar: '/images/c6f3394289ca9038f446be207c032d8a.jpg',
    mapCoords: { x: '35%', y: '42%' }
  },
  {
    id: 2,
    name: 'Prof. Dr. Madya Khairullah',
    tag: '3D Modeling & Blender Professional Course',
    status: 'Senior Lecturer',
    address: 'Faculty of Creative Multimedia, Cyberjaya, Malaysia',
    phone: '+60126504922',
    languages: 'English, Malay',
    specialty: '3d',
    availability: 'Thursday, March 24',
    rating: '4.8 (94 reviews)',
    avatar: '/images/c6f3394289ca9038f446be207c032d8a.jpg',
    mapCoords: { x: '62%', y: '55%' }
  },
  {
    id: 3,
    name: 'Elena Rostova',
    tag: 'Visual Identity, Typography & Editorial Systems',
    status: 'Design Director',
    address: 'Kuala Lumpur Design District, Bangsar South',
    phone: '+60138942110',
    languages: 'English, Russian',
    specialty: 'branding',
    availability: 'Monday, March 21',
    rating: '5.0 (210 reviews)',
    avatar: '/images/c6f3394289ca9038f446be207c032d8a.jpg',
    mapCoords: { x: '48%', y: '30%' }
  },
  {
    id: 4,
    name: 'David Tan',
    tag: 'Digital Illustration & Concept Art in Procreate',
    status: 'Lead Concept Artist',
    address: 'George Town Arts Hub, Penang, Malaysia',
    phone: '+60174423981',
    languages: 'English, Mandarin',
    specialty: 'illustration',
    availability: 'Friday, March 25',
    rating: '4.9 (165 reviews)',
    avatar: '/images/c6f3394289ca9038f446be207c032d8a.jpg',
    mapCoords: { x: '25%', y: '68%' }
  }
];

export default function FindInstructorPage() {
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setSelectedInstructor(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredInstructors = INSTRUCTORS_DATA.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty = specialtyFilter === 'all' || mentor.specialty === specialtyFilter;

    return matchesSearch && matchesSpecialty;
  });

  const handleBooking = (mentor) => {
    setSelectedInstructor(mentor);
  };

  const confirmBooking = () => {
    notify(`Appointment scheduled with ${selectedInstructor.name} on ${selectedInstructor.availability}!`, 'success');
    setSelectedInstructor(null);
  };

  return (
    <div className="find-instructor-page">
      {/* Hero Banner */}
      <section className="instructor-hero-banner">
        <div className="instructor-hero-inner">
          <span className="badge-pill">MENTORSHIP DIRECTORY</span>
          <h1>Find an Instructor</h1>
          <p>Search verified industry mentors and schedule private 1-on-1 design critique sessions.</p>
          
          <div className="hero-search-wrapper">
            <div className="search-input-field">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input 
                type="text" 
                placeholder="Search mentor by name, skill, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="specialty-dropdown"
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
            >
              <option value="all">All Specialties</option>
              <option value="uiux">UI/UX Design</option>
              <option value="branding">Branding & Identity</option>
              <option value="3d">3D Modeling & Blender</option>
              <option value="illustration">Digital Illustration</option>
            </select>
            <button 
              type="button" 
              className="btn-search-submit"
              onClick={() => notify(`Found ${filteredInstructors.length} matching mentors.`)}
            >
              SEARCH
            </button>
          </div>
        </div>
      </section>

      {/* View Switcher Bar */}
      <div className="instructor-toolbar">
        <div className="results-count">
          Showing <strong>{filteredInstructors.length}</strong> available mentors
        </div>
        <div className="view-toggle-container">
          <button 
            type="button"
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <i className="fa-solid fa-list"></i> List View
          </button>
          <button 
            type="button"
            className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            <i className="fa-solid fa-map-location-dot"></i> Interactive Map
          </button>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'list' ? (
        <div className="instructors-cards-list">
          {filteredInstructors.length === 0 ? (
            <div className="empty-results-box">
              <i className="fa-solid fa-user-slash"></i>
              <h3>No mentors match your search</h3>
              <p>Try clearing your filters or search for another design skill.</p>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => { setSearchQuery(''); setSpecialtyFilter('all'); }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredInstructors.map((mentor) => (
              <div key={mentor.id} className="profile-mentor-card">
                <div className="mentor-avatar-box">
                  <img src={mentor.avatar} alt={mentor.name} />
                  <span className="mentor-rating"><i className="fa-solid fa-star"></i> {mentor.rating}</span>
                </div>
                <div className="mentor-info-box">
                  <div className="mentor-header-title">
                    <h3>{mentor.name}</h3>
                    <span className="mentor-status-tag">{mentor.status}</span>
                  </div>
                  <p className="mentor-tag">{mentor.tag}</p>
                  <p className="mentor-address-text">
                    <i className="fa-solid fa-location-dot"></i> {mentor.address}
                  </p>
                  <div className="mentor-meta-row">
                    <span><i className="fa-solid fa-globe"></i> https://graphicdesignhub.edu</span>
                    <span><i className="fa-solid fa-phone"></i> {mentor.phone}</span>
                    <span><i className="fa-solid fa-language"></i> {mentor.languages}</span>
                  </div>
                  <div className="mentor-card-footer">
                    <span className="next-avail-badge">
                      <i className="fa-regular fa-calendar-check"></i> Next available: {mentor.availability}
                    </span>
                    <button 
                      type="button" 
                      className="action-booking-btn"
                      onClick={() => handleBooking(mentor)}
                    >
                      Book 1-on-1 Session
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Map View */
        <div className="instructor-map-container">
          <div className="map-view-canvas">
            <div className="map-overlay-info">
              <h4>Interactive Mentor Locations</h4>
              <p>Click on any pin to view mentor profile and schedule a session.</p>
            </div>

            {/* Simulated Map Visual with Pins */}
            <div className="styled-map-graphic">
              {filteredInstructors.map((mentor) => (
                <div 
                  key={mentor.id} 
                  className="map-mentor-pin"
                  style={{ left: mentor.mapCoords.x, top: mentor.mapCoords.y }}
                  onClick={() => handleBooking(mentor)}
                  title={`${mentor.name} - ${mentor.tag}`}
                >
                  <div className="pin-marker">
                    <i className="fa-solid fa-chalkboard-user"></i>
                  </div>
                  <div className="pin-card-preview">
                    <strong>{mentor.name}</strong>
                    <small>{mentor.tag}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Dialog Modal */}
      {selectedInstructor && (
        <div className="modal-backdrop" onClick={() => setSelectedInstructor(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Schedule Session with {selectedInstructor.name}</h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setSelectedInstructor(null)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Topic:</strong> {selectedInstructor.tag}</p>
              <p><strong>Selected Date:</strong> {selectedInstructor.availability}</p>
              <p><strong>Location:</strong> Online (GraphicDesignHUB Video Room)</p>
              <div className="form-field-group">
                <label>Your question or project description for this session:</label>
                <textarea 
                  rows="3" 
                  placeholder="e.g. Please review my Figma mobile app wireframe and color hierarchy..." 
                  defaultValue="I would like a portfolio critique and guidance on user research methodology."
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setSelectedInstructor(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-primary"
                onClick={confirmBooking}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

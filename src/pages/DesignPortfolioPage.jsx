import { useState, useEffect } from 'react';
import { notify } from '../utils/toast';

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: 'Aurora Banking App UI/UX',
    category: 'uiux',
    categoryLabel: 'UI/UX · Mobile Concept',
    date: 104,
    views: 420,
    likes: 85,
    status: 'Published',
    bgColor: '#e4e9de',
    textColor: '#34483d',
    description: 'A minimalist neobank concept emphasizing frictionless peer-to-peer transfers and micro-savings.',
    tools: ['Figma', 'FigJam', 'Principle'],
    client: 'Academic Sprint 2026',
    challenge: 'Simplifying the crypto-fiat exchange flow for first-time non-technical users.'
  },
  {
    id: 2,
    title: 'Lumina Coffee Roasters Brand Identity',
    category: 'branding',
    categoryLabel: 'Branding · Visual Identity',
    date: 103,
    views: 310,
    likes: 62,
    status: 'Published',
    bgColor: '#f2e9d9',
    textColor: '#355340',
    description: 'Complete visual identity system including packaging labels, custom logotype, and menu cards.',
    tools: ['Adobe Illustrator', 'Photoshop', 'InDesign'],
    client: 'Lumina Specialty Roasters',
    challenge: 'Designing an organic luxury label system compliant with international food packaging guidelines.'
  },
  {
    id: 3,
    title: 'Cyberpunk Botanical Gardens',
    category: 'illustration',
    categoryLabel: 'Illustration · Digital Art',
    date: 102,
    views: 580,
    likes: 124,
    status: 'Published',
    bgColor: '#f4dce7',
    textColor: '#753b59',
    description: 'Isometric sci-fi concept art created with Blender 3D and finished with Photoshop digital paint.',
    tools: ['Blender 3D', 'Photoshop', 'Procreate'],
    client: 'Personal Concept Study',
    challenge: 'Balancing futuristic neon aesthetics with lush natural flora anatomy.'
  },
  {
    id: 4,
    title: 'EcoFestival Social Media Campaign',
    category: 'social',
    categoryLabel: 'Social Media · Advertising',
    date: 101,
    views: 190,
    likes: 38,
    status: 'Draft',
    bgColor: '#f1d5bd',
    textColor: '#50352b',
    description: 'Series of 10 animated Instagram carousel templates promoting zero-waste lifestyle tips.',
    tools: ['Figma', 'After Effects'],
    client: 'Green Nilai Initiative',
    challenge: 'Maximizing carousel swipe engagement rate through bite-sized data infographics.'
  }
];

export default function DesignPortfolioPage() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('uiux');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setSelectedCaseStudy(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredProjects = projects
    .filter(p => {
      const matchesCategory = activeFilter === 'all' || p.category === activeFilter;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'az') return a.title.localeCompare(b.title);
      return b.date - a.date;
    });

  const handleLike = (id) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
    notify('Appreciation recorded! ❤️', 'success');
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const categoryLabels = {
      branding: 'Branding · Visual Identity',
      uiux: 'UI/UX · Product Concept',
      illustration: 'Illustration · Digital Art',
      social: 'Social Media · Campaign'
    };

    const colors = {
      branding: { bg: '#f2e9d9', text: '#355340' },
      uiux: { bg: '#e4e9de', text: '#34483d' },
      illustration: { bg: '#f4dce7', text: '#753b59' },
      social: { bg: '#f1d5bd', text: '#50352b' }
    };

    const newProjectItem = {
      id: Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      categoryLabel: categoryLabels[newCategory] || 'Design Concept',
      date: Date.now(),
      views: 1,
      likes: 0,
      status: 'Draft',
      bgColor: colors[newCategory]?.bg || '#e4e9de',
      textColor: colors[newCategory]?.text || '#34483d',
      description: newDesc.trim() || 'Custom creative design work uploaded to student portfolio.',
      tools: ['Figma', 'Creative Cloud'],
      client: 'Independent Project',
      challenge: 'Exploring custom visual composition and user research.'
    };

    setProjects(prev => [newProjectItem, ...prev]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    notify(`"${newProjectItem.title}" has been added to your portfolio!`, 'success');
  };

  return (
    <div className="portfolio-page">
      {/* Portfolio Header Banner */}
      <section className="portfolio-hero">
        <div className="portfolio-hero-info">
          <span className="badge-pill">STUDENT SHOWCASE</span>
          <h1>Design Portfolio</h1>
          <p>
            Showcase your best academic and client design work. Receive feedback from instructors 
            and share your live case studies.
          </p>
        </div>
        <button 
          type="button" 
          className="btn-create-project"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="fa-solid fa-plus"></i> Upload New Project
        </button>
      </section>

      {/* Toolbar */}
      <div className="portfolio-toolbar">
        <div className="portfolio-tabs">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'uiux', label: 'UI/UX' },
            { id: 'branding', label: 'Branding' },
            { id: 'illustration', label: 'Illustration' },
            { id: 'social', label: 'Social Media' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`portfolio-tab-btn ${activeFilter === tab.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="portfolio-search-sort">
          <div className="search-field-mini">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              placeholder="Filter projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Most Recent</option>
            <option value="az">Title (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="portfolio-grid">
        {filteredProjects.map(project => (
          <article key={project.id} className="portfolio-card">
            <div 
              className="portfolio-art-cover"
              style={{ background: project.bgColor, color: project.textColor }}
            >
              <span className="art-serif-title">{project.title}</span>
              <span className={`status-pill ${project.status.toLowerCase()}`}>
                {project.status}
              </span>
            </div>

            <div className="portfolio-card-body">
              <div className="portfolio-title-row">
                <div>
                  <h3>{project.title}</h3>
                  <p className="portfolio-cat-label">{project.categoryLabel}</p>
                </div>
                <button 
                  type="button" 
                  className="btn-portfolio-more"
                  onClick={() => notify(`Options menu for "${project.title}"`)}
                >
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
              </div>

              <p className="portfolio-desc">{project.description}</p>

              <div className="portfolio-card-footer">
                <div className="portfolio-metrics">
                  <span><i className="fa-regular fa-eye"></i> {project.views}</span>
                  <button 
                    type="button" 
                    className="btn-like-heart"
                    onClick={() => handleLike(project.id)}
                  >
                    <i className="fa-solid fa-heart text-danger"></i> {project.likes}
                  </button>
                </div>
                <button 
                  type="button" 
                  className="btn-view-case-study"
                  onClick={() => setSelectedCaseStudy(project)}
                >
                  View Case Study
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Full Case Study Viewer Modal */}
      {selectedCaseStudy && (
        <div className="modal-backdrop" onClick={() => setSelectedCaseStudy(null)}>
          <div className="modal-card case-study-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge-pill">{selectedCaseStudy.categoryLabel}</span>
                <h3>{selectedCaseStudy.title}</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setSelectedCaseStudy(null)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div 
                className="case-study-hero-preview"
                style={{ background: selectedCaseStudy.bgColor, color: selectedCaseStudy.textColor }}
              >
                <h2>{selectedCaseStudy.title}</h2>
                <small>Case Study Presentation</small>
              </div>

              <div className="case-study-meta-grid">
                <div><span>Client / Track:</span><strong>{selectedCaseStudy.client}</strong></div>
                <div><span>Status:</span><strong className="text-success">{selectedCaseStudy.status}</strong></div>
                <div><span>Views:</span><strong>{selectedCaseStudy.views}</strong></div>
                <div><span>Likes:</span><strong>{selectedCaseStudy.likes} ❤️</strong></div>
              </div>

              <div className="case-study-content-block">
                <h4>Design Challenge & Problem Statement</h4>
                <p>{selectedCaseStudy.challenge}</p>
              </div>

              <div className="case-study-content-block">
                <h4>Design Solution</h4>
                <p>{selectedCaseStudy.description}</p>
              </div>

              <div>
                <h4 className="mb-2">Tools & Technologies Used:</h4>
                <div className="program-chips">
                  {selectedCaseStudy.tools.map((t, idx) => (
                    <span key={idx} className="program-chip"><i className="fa-solid fa-check"></i> {t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setSelectedCaseStudy(null)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => {
                  handleLike(selectedCaseStudy.id);
                  notify('Liked case study!');
                }}
              >
                <i className="fa-solid fa-heart"></i> Like this Project ({selectedCaseStudy.likes})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload New Project Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload Project to Portfolio</h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className="modal-body">
                <div className="form-field-group">
                  <label htmlFor="p-title">Project Title *</label>
                  <input 
                    id="p-title"
                    type="text" 
                    placeholder="e.g. Neo Wallet Mobile App"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-field-group">
                  <label htmlFor="p-category">Design Category *</label>
                  <select 
                    id="p-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="uiux">UI/UX Design</option>
                    <option value="branding">Branding & Logo</option>
                    <option value="illustration">Digital Illustration</option>
                    <option value="social">Social Media Design</option>
                  </select>
                </div>
                <div className="form-field-group">
                  <label htmlFor="p-desc">Short Summary / Concept Description</label>
                  <textarea 
                    id="p-desc"
                    rows="3" 
                    placeholder="Describe your design decisions, tools used, and problem solved..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={!newTitle.trim()}
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

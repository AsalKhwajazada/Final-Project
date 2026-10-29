import { useState, useEffect } from 'react';
import { notify } from '../utils/toast';

const INITIAL_ASSIGNMENTS = [
  {
    id: 1,
    title: 'Mobile Banking App Micro-Interactions',
    course: 'UI/UX Design Masterclass',
    due: 'March 25, 2026',
    progress: 75,
    status: 'In Progress',
    grade: 'Pending Review',
    brief: 'Create interactive Figma prototypes with smart animate transitions for checkout and wallet top-up.'
  },
  {
    id: 2,
    title: 'Low-Poly Isometric Coffee Shop in Blender',
    course: '3D Modeling & Blender',
    due: 'March 28, 2026',
    progress: 40,
    status: 'In Progress',
    grade: 'Pending Review',
    brief: 'Model, texture, and light an isometric indoor scene. Submit high-res render and .blend file.'
  },
  {
    id: 3,
    title: 'Brand Style Guide & Logo Construction Grid',
    course: 'Logo & Branding Basics',
    due: 'March 18, 2026',
    progress: 100,
    status: 'Submitted',
    grade: 'Awaiting Grade',
    brief: 'Deliver a vector brand manual with color palettes, typography scale, and safe zone guidelines.'
  },
  {
    id: 4,
    title: 'Editorial Magazine Cover & Typography Layout',
    course: 'Advanced Photoshop Suite',
    due: 'March 10, 2026',
    progress: 100,
    status: 'Completed',
    grade: '96 / 100 (A+)',
    brief: 'Design a print-ready A4 magazine cover with CMYK profile and balanced typographical hierarchy.'
  },
  {
    id: 5,
    title: 'Vector Character Expressions Sheet',
    course: 'Vector Illustration Academy',
    due: 'February 26, 2026',
    progress: 100,
    status: 'Completed',
    grade: '92 / 100 (A)',
    brief: 'Illustrate 6 facial expressions of a mascot character using pen tool and custom color palettes.'
  }
];

export default function MyAssignmentsPage() {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [activeTab, setActiveTab] = useState('all'); // all, active, submitted, completed
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState('');

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setSelectedTask(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTasks = assignments.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.course.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'active') return matchesSearch && task.status === 'In Progress';
    if (activeTab === 'submitted') return matchesSearch && task.status === 'Submitted';
    if (activeTab === 'completed') return matchesSearch && task.status === 'Completed';
    return matchesSearch;
  });

  const handleSubmitTask = (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    setAssignments(prev => prev.map(t => {
      if (t.id === selectedTask.id) {
        return {
          ...t,
          status: 'Submitted',
          progress: 100,
          grade: 'Submitted for Instructor Review'
        };
      }
      return t;
    }));

    notify(`Assignment "${selectedTask.title}" submitted successfully!`, 'success');
    setSelectedTask(null);
    setSubmissionUrl('');
  };

  return (
    <div className="assignments-page">
      {/* Banner */}
      <section className="assignments-hero">
        <div className="assignments-hero-text">
          <span className="badge-pill">COURSEWORK MANAGEMENT</span>
          <h1>My Assignments</h1>
          <p>
            Track pending tasks, view instructor rubrics, and upload your project deliverables.
          </p>
        </div>
        <div className="assignments-hero-stats">
          <div className="stat-pill-box">
            <span>In Progress:</span> <strong>{assignments.filter(a => a.status === 'In Progress').length}</strong>
          </div>
          <div className="stat-pill-box">
            <span>Submitted:</span> <strong>{assignments.filter(a => a.status === 'Submitted').length}</strong>
          </div>
          <div className="stat-pill-box">
            <span>Completed:</span> <strong>{assignments.filter(a => a.status === 'Completed').length}</strong>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="assignments-toolbar">
        <div className="assignments-tabs">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'active', label: 'In Progress' },
            { id: 'submitted', label: 'Submitted' },
            { id: 'completed', label: 'Completed' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`assign-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="assignments-search-wrap">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input 
            type="text" 
            placeholder="Search by assignment title or class name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Assignments Table Card */}
      <div className="assignments-table-card">
        <table className="assignments-table">
          <thead>
            <tr>
              <th>Assignment Title</th>
              <th>Class / Module</th>
              <th>Due Date</th>
              <th>Progress</th>
              <th>Evaluation / Grade</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-muted">
                  No assignments found in this view.
                </td>
              </tr>
            ) : (
              filteredTasks.map(task => (
                <tr key={task.id}>
                  <td>
                    <strong>{task.title}</strong>
                  </td>
                  <td>
                    <span className="course-name-cell">{task.course}</span>
                  </td>
                  <td>
                    <span className="due-date-cell"><i className="fa-regular fa-calendar"></i> {task.due}</span>
                  </td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${task.progress}%` }}></div>
                      </div>
                      <span className="progress-text">{task.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`grade-tag ${task.status === 'Completed' ? 'success' : 'muted'}`}>
                      {task.grade}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${task.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      type="button" 
                      className="btn-action-task"
                      onClick={() => setSelectedTask(task)}
                    >
                      {task.status === 'In Progress' ? 'Submit' : 'View Brief'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <div className="modal-backdrop" onClick={() => setSelectedTask(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedTask.title}</h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setSelectedTask(null)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitTask}>
              <div className="modal-body">
                <div className="task-detail-info">
                  <p><strong>Course:</strong> {selectedTask.course}</p>
                  <p><strong>Deadline:</strong> {selectedTask.due}</p>
                  <p><strong>Current Status:</strong> {selectedTask.status}</p>
                </div>

                <div className="task-brief-box">
                  <h4>Assignment Requirements:</h4>
                  <p>{selectedTask.brief}</p>
                </div>

                {selectedTask.status === 'In Progress' ? (
                  <div className="form-field-group">
                    <label htmlFor="f-link">Your Deliverable URL (Figma, GitHub, or Drive link) *</label>
                    <input 
                      id="f-link"
                      type="url" 
                      placeholder="https://www.figma.com/file/..."
                      value={submissionUrl}
                      onChange={(e) => setSubmissionUrl(e.target.value)}
                      required
                    />
                    <small>Make sure your file permissions are set to "Anyone with the link can view".</small>
                  </div>
                ) : (
                  <div className="info-callout">
                    <i className="fa-solid fa-circle-check text-success"></i> This assignment has been turned in. Feedback will appear here once marked by your instructor.
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setSelectedTask(null)}
                >
                  Close
                </button>
                {selectedTask.status === 'In Progress' && (
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={!submissionUrl.trim()}
                  >
                    Turn In Assignment
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

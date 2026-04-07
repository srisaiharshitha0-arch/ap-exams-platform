import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminPanel.css';

const AdminPanel = () => {

  const [exams, setExams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('exams');
  const [activeExamTab, setActiveExamTab] = useState('present');
  const [activeUserTab, setActiveUserTab] = useState('all');
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');
  const menuRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    officialLink: '',
    category: '',
    eligibility: '',
    lastDate: '',
    notificationDate: '',
    examType: 'present'
  });

  useEffect(() => {
    fetchExams();
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get('/api/exams');
      setExams(response.data);
    } catch (error) {
      toast.error('Error fetching exams');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.lastDate || !/\d{4}/.test(formData.lastDate)) {
      toast.error("Year is compulsory in Last Date");
      return;
    }
    try {
      if (editingExam) {
        await axios.put(`/api/admin/exams/${editingExam._id}`, formData);
        toast.success('Exam updated successfully');
      } else {
        await axios.post('/api/admin/exams', formData);
        toast.success('Exam added successfully');
      }
      fetchExams();
      resetForm();
    } catch (error) {
      toast.error('Error saving exam');
    }
  };

  const handleAddExam = (type) => {
    setFormData({ title: '', description: '', officialLink: '', category: '', eligibility: '', lastDate: '', notificationDate: '', examType: type });
    setEditingExam(null);
    setShowForm(true);
    setMenuOpen(false);
    setActiveSection('exams');
    setActiveExamTab(type);
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description,
      officialLink: exam.officialLink,
      category: exam.category,
      eligibility: exam.eligibility || '',
      lastDate: exam.lastDate || '',
      notificationDate: exam.notificationDate || '',
      examType: exam.examType || 'present'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await axios.delete(`/api/admin/exams/${id}`);
        toast.success('Exam deleted successfully');
        fetchExams();
      } catch (error) {
        toast.error('Error deleting exam');
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', officialLink: '', category: '', eligibility: '', lastDate: '', notificationDate: '', examType: 'present' });
    setEditingExam(null);
    setShowForm(false);
  };

  const presentExams = exams.filter(e => (e.examType || 'present') === 'present');
  const upcomingExams = exams.filter(e => e.examType === 'upcoming');

  const tabExams = activeExamTab === 'present' ? presentExams : upcomingExams;
  const activeExams = activeCategoryTab === 'all'
    ? tabExams
    : tabExams.filter(e => e.category === activeCategoryTab);

  // dynamic categories from current tab exams
  const categories = ['all', ...new Set(tabExams.map(e => e.category).filter(Boolean))];

  const maleUsers = users.filter(u => u.gender === 'male');
  const femaleUsers = users.filter(u => u.gender === 'female');
  const otherUsers = users.filter(u => !u.gender || u.gender === 'other');

  const getFilteredUsers = () => {
    if (activeUserTab === 'male') return maleUsers;
    if (activeUserTab === 'female') return femaleUsers;
    if (activeUserTab === 'other') return otherUsers;
    return users;
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <div className="admin-panel">

        <div className="admin-header">
          <h1>Admin Panel</h1>
          <div className="hamburger-wrapper" ref={menuRef}>
            <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
              <span></span><span></span><span></span>
            </button>
            {menuOpen && (
              <div className="hamburger-dropdown">
                <button className="dropdown-item" onClick={() => handleAddExam('present')}>+ Add Present Exam</button>
                <button className="dropdown-item" onClick={() => handleAddExam('upcoming')}>+ Add Upcoming Exam</button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => { setActiveSection('users'); setMenuOpen(false); setShowForm(false); }}>👥 Users List</button>
                <button className="dropdown-item" onClick={() => { setActiveSection('exams'); setMenuOpen(false); }}>📋 Exams List</button>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="admin-form-container">
            <h2>{editingExam ? 'Edit Exam' : formData.examType === 'upcoming' ? 'Add Upcoming Exam' : 'Add Present Exam'}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <input type="text" name="category" value={formData.category} onChange={handleChange} className="form-input" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows="3" required />
              </div>
              <div className="form-group">
                <label className="form-label">Official Link *</label>
                <input type="url" name="officialLink" value={formData.officialLink} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Eligibility</label>
                  <input type="text" name="eligibility" value={formData.eligibility} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    {formData.examType === 'upcoming' ? 'Expected Date' : 'Last Date'}
                  </label>
                  <input type="text" name="lastDate" value={formData.lastDate} onChange={handleChange} className="form-input" placeholder="e.g. 2026 / July 2026 / 20 July 2026" />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{editingExam ? 'Update Exam' : 'Add Exam'}</button>
                <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* EXAMS SECTION */}
        {activeSection === 'exams' && (
          <div className="admin-exams-list">
            <h2>All Exams ({exams.length})</h2>

            {/* Present / Upcoming Tabs */}
            <div className="exam-tabs">
              <button
                className={`exam-tab ${activeExamTab === 'present' ? 'active' : ''}`}
                onClick={() => { setActiveExamTab('present'); setActiveCategoryTab('all'); }}
              >
                Present Exams <span className="tab-count">{presentExams.length}</span>
              </button>
              <button
                className={`exam-tab ${activeExamTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => { setActiveExamTab('upcoming'); setActiveCategoryTab('all'); }}
              >
                Upcoming Exams <span className="tab-count">{upcomingExams.length}</span>
              </button>
            </div>

            {/* Category Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '12px 0' }}>
              <select
                value={activeCategoryTab}
                onChange={(e) => setActiveCategoryTab(e.target.value)}
                className="category-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>{activeExamTab === 'upcoming' ? 'Expected Date' : 'Last Date'}</th>
                    <th>Official Link</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeExams.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)' }}>
                        No {activeCategoryTab !== 'all' ? activeCategoryTab : activeExamTab} exams found
                      </td>
                    </tr>
                  ) : (
                    activeExams.map(exam => (
                      <tr key={exam._id}>
                        <td>{exam.title}</td>
                        <td>{exam.category}</td>
                        <td>{exam.lastDate || "Not specified"}</td>
                        <td><a href={exam.officialLink} target="_blank" rel="noopener noreferrer">View</a></td>
                        <td>
                          <button onClick={() => handleEdit(exam)} className="btn btn-secondary btn-small">Edit</button>
                          <button onClick={() => handleDelete(exam._id)} className="btn btn-danger btn-small">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS SECTION */}
        {activeSection === 'users' && (
          <div className="admin-exams-list">
            <h2>All Users ({users.length})</h2>
            <div className="exam-tabs">
              <button className={`exam-tab ${activeUserTab === 'all' ? 'active' : ''}`} onClick={() => setActiveUserTab('all')}>
                All <span className="tab-count">{users.length}</span>
              </button>
              <button className={`exam-tab ${activeUserTab === 'male' ? 'active' : ''}`} onClick={() => setActiveUserTab('male')}>
                Male <span className="tab-count">{maleUsers.length}</span>
              </button>
              <button className={`exam-tab ${activeUserTab === 'female' ? 'active' : ''}`} onClick={() => setActiveUserTab('female')}>
                Female <span className="tab-count">{femaleUsers.length}</span>
              </button>
              <button className={`exam-tab ${activeUserTab === 'other' ? 'active' : ''}`} onClick={() => setActiveUserTab('other')}>
                Other <span className="tab-count">{otherUsers.length}</span>
              </button>
            </div>
            <div className="admin-table">
              <table>
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Gender</th><th>Role</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {getFilteredUsers().map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`gender-badge gender-${user.gender || 'other'}`}>
                          {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Other'}
                        </span>
                      </td>
                      <td>{user.role}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;
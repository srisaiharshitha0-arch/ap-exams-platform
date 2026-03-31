import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "./DashboardPage.css";

const getInitials = (name) => {
  if (!name) return "U";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

const getAvatarColor = (gender) => {
  if (gender === 'male') return '#3b82f6';
  if (gender === 'female') return '#ec4899';
  return '#7c3aed';
};

const DashboardPage = () => {

  const { user, setUser } = useAuth();

  const [savedExams, setSavedExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("present");
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    fetchSavedExams();
  }, []);

  const fetchSavedExams = async () => {
    try {
      const response = await axios.get("/api/user/saved-exams");
      setSavedExams(response.data);
    } catch (error) {
      console.error("Error fetching saved exams:", error);
      toast.error("Error loading saved exams");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveExam = async (examId) => {
    try {
      await axios.delete(`/api/exams/${examId}/save`);
      setSavedExams(savedExams.filter(exam => exam._id !== examId));
      toast.success("Exam removed from saved list");
    } catch (error) {
      toast.error("Error removing exam");
    }
  };

  const handleNameSave = async () => {
    if (!newName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSavingName(true);
    try {
      const response = await axios.put("/api/user/profile", { name: newName.trim() });
      if (setUser) setUser({ ...user, name: response.data.name });
      toast.success("Name updated successfully");
      setIsEditingName(false);
    } catch (error) {
      toast.error("Error updating name");
    } finally {
      setSavingName(false);
    }
  };

  const presentSaved = savedExams.filter(e => (e.examType || 'present') === 'present');
  const upcomingSaved = savedExams.filter(e => e.examType === 'upcoming');
  const activeExams = activeTab === 'present' ? presentSaved : upcomingSaved;

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <div className="dashboard">

        <div className="dashboard-header">
          <h1>My Dashboard</h1>
        </div>

        <div className="dashboard-content">

          {/* PROFILE SECTION */}
          <div className="profile-section">
            <div className="profile-card">

              <div
                className="profile-avatar"
                style={{ backgroundColor: getAvatarColor(user?.gender) }}
              >
                {getInitials(user?.name)}
              </div>

              <div className="profile-details">

                <div className="profile-name-row">
                  {isEditingName ? (
                    <div className="name-edit-row">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="name-edit-input"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleNameSave();
                          if (e.key === 'Escape') setIsEditingName(false);
                        }}
                      />
                      <button onClick={handleNameSave} disabled={savingName} className="btn btn-primary btn-small">
                        {savingName ? "Saving..." : "Save"}
                      </button>
                      <button onClick={() => { setIsEditingName(false); setNewName(user?.name || ""); }} className="btn btn-secondary btn-small">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="name-display-row">
                      <h2 className="profile-name">{user?.name}</h2>
                      <button onClick={() => setIsEditingName(true)} className="edit-name-btn" title="Edit name">
                        ✏️
                      </button>
                    </div>
                  )}
                </div>

                <div className="profile-meta">
                  <span className="profile-meta-item">{user?.email}</span>
                  <span className="profile-meta-item">
                    Member since{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
                      : "N/A"}
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* SAVED EXAMS */}
          <div className="saved-exams-section">

            <h2>Saved Exams ({savedExams.length})</h2>

            <div className="saved-tabs">
              <button className={`saved-tab ${activeTab === 'present' ? 'active' : ''}`} onClick={() => setActiveTab('present')}>
                Present Exams <span className="tab-count">{presentSaved.length}</span>
              </button>
              <button className={`saved-tab ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
                Upcoming Exams <span className="tab-count">{upcomingSaved.length}</span>
              </button>
            </div>

            {activeExams.length === 0 ? (
              <div className="empty-state">
                <p>No {activeTab === 'present' ? 'present' : 'upcoming'} exams saved yet.</p>
              </div>
            ) : (
              <div className="saved-exams-list">
                {activeExams.map((exam) => (
                  <div key={exam._id} className="saved-exam-item">
                    <div className="saved-exam-info">
                      <h3>{exam.title}</h3>
                      <p>{exam.description}</p>
                      <span className="category-badge">{exam.category}</span>
                    </div>
                    <div className="saved-exam-actions">
                      <a href={exam.officialLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Visit Website
                      </a>
                      <button onClick={() => handleRemoveExam(exam._id)} className="btn btn-danger">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );

};

export default DashboardPage;
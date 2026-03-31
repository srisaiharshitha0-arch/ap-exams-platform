import React, { useState, useEffect } from "react";
import axios from "axios";
import ExamCard from "../components/ExamCard";
import "./ExamsPage.css";

const ExamsPage = () => {

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeTab, setActiveTab] = useState("present");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get("/api/exams");
      setExams(response.data || []);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setSelectedCategory("");
  };

  const presentExams = exams.filter(e => (e.examType || 'present') === 'present');
  const upcomingExams = exams.filter(e => e.examType === 'upcoming');

  const activeExams = activeTab === 'present' ? presentExams : upcomingExams;

  const categories = [
    ...new Set(activeExams.map((exam) => exam.category).filter(Boolean)),
  ];

  const filteredExams = activeExams.filter((exam) => {
    const title = exam.title || "";
    const description = exam.description || "";

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory || exam.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">

      <div className="homepage-header">
        <h1 className="homepage-title">
          Explore Government Exams & Opportunities
        </h1>
        <p className="homepage-subtitle">
          Browse AP Government exam categories and visit official recruitment websites.
        </p>
      </div>

      {/* Tabs */}
      <div className="exam-tabs">
        <button
          className={`exam-tab ${activeTab === 'present' ? 'active' : ''}`}
          onClick={() => handleTabChange('present')}
        >
          Present Exams
          <span className="tab-count">{presentExams.length}</span>
        </button>
        <button
          className={`exam-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => handleTabChange('upcoming')}
        >
          Upcoming Exams
          <span className="tab-count">{upcomingExams.length}</span>
        </button>
      </div>

      {/* Search & Filter - inside each tab */}
      <div className="filters">
        <input
          type="text"
          placeholder={`Search ${activeTab === 'present' ? 'present' : 'upcoming'} exams...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-filter"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>

      {filteredExams.length === 0 ? (
        <div className="no-results">
          <p>No {activeTab === 'present' ? 'present' : 'upcoming'} exams found</p>
        </div>
      ) : (
        <div className="exams-grid">
          {filteredExams.map((exam) => (
            <ExamCard key={exam._id} exam={exam} />
          ))}
        </div>
      )}

    </div>
  );

};

export default ExamsPage;
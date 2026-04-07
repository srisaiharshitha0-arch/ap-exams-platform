import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./ExamCard.css";

const formatSmartDate = (dateStr) => {
  if (!dateStr) return "Not specified";
  const str = dateStr.trim();

  if (/^\d{4}$/.test(str)) return str;

  if (/^\d{4}-\d{2}$/.test(str)) {
    const [year, month] = str.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-IN", {
      year: "numeric", month: "short",
    });
  }

  if (/^[A-Za-z]+\s+\d{4}$/.test(str)) {
    return new Date(str).toLocaleDateString("en-IN", {
      year: "numeric", month: "short",
    });
  }

  const parsed = new Date(str);
  if (isNaN(parsed)) return str; // ✅ Invalid date ఐతే as-is చూపిస్తుంది
  return parsed.toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });
};

const ExamCard = ({ exam, onSaveToggle }) => {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);


useEffect(() => {
    checkIfSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam._id, isAuthenticated]);
  const checkIfSaved = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await axios.get("/api/user/saved-exams");
      const savedExamIds = response.data.map((saved) => saved.examId._id);
      setIsSaved(savedExamIds.includes(exam._id));
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to save exams");
      return;
    }
    setLoading(true);
    try {
      if (isSaved) {
        await axios.delete(`/api/exams/${exam._id}/save`);
        setIsSaved(false);
        toast.success("Exam removed from saved list");
      } else {
        await axios.post(`/api/exams/${exam._id}/save`);
        setIsSaved(true);
        toast.success("Exam saved successfully");
      }
      if (onSaveToggle) onSaveToggle();
    } catch (error) {
      toast.error("Error saving exam");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CHANGE — upcoming exams కి "Expected Date", present కి "Last Date"
  const dateLabel = exam.examType === 'upcoming' ? 'Expected Date' : 'Last Date';

  return (
    <div className="exam-card">
      <div>
        <div className="exam-card-header">
          <h3 className="exam-title">{exam.title}</h3>
          <span className="exam-category">{exam.category}</span>
        </div>

        <p className="exam-description">{exam.description}</p>

        <p className="exam-eligibility">
          <strong>Eligibility:</strong>{" "}
          {exam.eligibility ? exam.eligibility : "Not specified"}
        </p>

        <p className="exam-date">
          <strong>{dateLabel}:</strong>{" "}
          <span className="last-date">
            {formatSmartDate(exam.lastDate)}
          </span>
        </p>
      </div>

      <div className="exam-actions">
        <a href={exam.officialLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Visit Official Website
        </a>
        {isAuthenticated && (
          <button onClick={handleSaveToggle} disabled={loading} className={`btn ${isSaved ? "btn-danger" : "btn-secondary"}`}>
            {loading ? "Loading..." : isSaved ? "Remove" : "Save"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamCard;
import React, { useContext, useEffect, useState } from 'react';
import { UploadContext } from '../context/UploadContext';
import { MdOutlineCheckCircle } from 'react-icons/md';
import './Summary.css';

const Summary = () => {
  const { selectedFile } = useContext(UploadContext);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!selectedFile) return;

      const fileName = typeof selectedFile === 'string'
        ? selectedFile
        : selectedFile?.name;

      const cacheKey = `${fileName}_summary`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        setSummaryData(JSON.parse(cached));
      } else {
        try {
          setLoading(true);
          const response = await fetch(
            `https://02c9-35-185-161-252.ngrok-free.app/generate-summary/${fileName}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            }
          );

          const data = await response.json();
          setSummaryData(data);
          localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (error) {
          console.error('Error fetching summary:', error);
          setSummaryData({ error: 'Unable to fetch summary.' });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSummary();
  }, [selectedFile]);

  if (!selectedFile) {
    return (
      <div className="summary-container">
        <p className="placeholder">📄 Upload a document first to get started.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="summary-container">
        <p className="loading">⏳ Generating summary...</p>
      </div>
    );
  }

  if (summaryData?.error) {
    return (
      <div className="summary-container">
        <p className="error">{summaryData.error}</p>
      </div>
    );
  }

  return (
    <div className="summary-container">
      <p className="section-title">📘 Document Overview</p>
      <div className="overview-box">
        <p>{summaryData?.document_overview}</p>
      </div>

      <p className="section-title">🔑 Key Points</p>
      <ul className="key-points">
        {summaryData?.key_points?.map((point, index) => (
          <li key={index} className="key-point">
            <MdOutlineCheckCircle className="icon" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <p className="section-title">🧵 Main Topics</p>
      <div className="topic-boxes">
        {summaryData?.main_topics?.map((topic, index) => (
          <div className="topic" key={index}>{topic}</div>
        ))}
      </div>
    </div>
  );
};

export default Summary;

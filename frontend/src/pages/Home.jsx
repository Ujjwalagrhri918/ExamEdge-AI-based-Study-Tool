import React, { useState } from "react";
import "./Home.css";
import { useContext } from "react";
import { UploadContext } from "../context/UploadContext.jsx";

const Home = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const { addUpload, selectFile, URL } = useContext(UploadContext);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await fetch(
        `${URL}/upload-pdf/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        setMessage(`✅ ${result.message}`);

        addUpload({
          original: result.original_filename,
          unique: result.unique_filename,
        });

        // Optionally set the selected file if you want to navigate to summary
        selectFile(result.unique_filename);
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      setMessage("⚠️ Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="home-container">
      <h1 className="welcome-heading">
        Welcome to <span className="brand">ExamEdge</span>
      </h1>
      <p className="tagline">
        Your intelligent assistant for academic excellence 🚀
      </p>
      <p className="daily-message">
        💡 “Success usually comes to those who are too busy to be looking for
        it.”
      </p>

      <div className="features-section">
        <div className="feature-card">📄 Summarize PDFs & PPTs <span>Concise Summarization In Seconds</span></div>
        <div className="feature-card">❓ Generate MCQs Instantly<span>Test Your Content understanding</span></div>
        <div className="feature-card">🧠 Chat with Document<span>Clear Doubts using the Q&A Feature</span></div>
        <div className="feature-card">📚 Resource Suggestions<span>Get Additional Learning Resources based on you Content</span></div>
        <div className="feature-card">👩‍🏫 Expert Help<span>Appointment Booking feature to connect to Domain Experts</span></div>
      </div>

      <div
        className="upload-box"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p>Drag and drop your PDF here or </p>
        <p>click below to select a file.</p>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
      </div>
      <div  className="upload-container">
      <button
        className="upload-button"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Processing..." : "Process Document"}
      </button>

      {message && <p className="upload-message">{message}</p>}
    </div>
    </div>
  );
};

export default Home;

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadContext } from '../context/UploadContext';
import './ExpertHelp.css';

const ExpertHelp = () => {
  const { selectedFile, URL } = useContext(UploadContext);
  const [faculties, setFaculties] = useState([]);
  const navigate = useNavigate();

  const handleBookSlot = (faculty, slot) => {
    navigate('/appointment', { state: { faculty, slot } });
  };

  useEffect(() => {
    const fetchFaculties = async () => {
      if (!selectedFile) return;

      try {
        const response = await fetch(`${URL}/fetch-faculties/${selectedFile}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        setFaculties(data.faculties || []);
      } catch (error) {
        console.error('Error fetching faculties:', error);
      }
    };

    fetchFaculties();
  }, [selectedFile]);

  return (
    <div className="expert-help-container">
      {faculties.length === 0 ? (
        <p>No experts available or file not selected.</p>
      ) : (
        <div className="faculty-list">
          {faculties.map((faculty) => (
            <div key={faculty.id} className="faculty-card">
              <img src={faculty.image} alt={faculty.name} />
              <div className="faculty-info">
                <h3>{faculty.name}</h3>
                <p className="title-only">{faculty.title}</p>
                <p><strong>Expertise:</strong> {faculty.expertise.join(', ')}</p>
                <p>📅 {faculty.experience_years} years experience</p>
                <p>💯 Satisfaction: {faculty.satisfaction_rate}</p>
                <p>⭐ Rating: {faculty.rating}</p>
                <p><strong>Price:</strong> ₹{faculty.session_price}</p>
                <p><strong>Contact:</strong> <a href={`mailto:${faculty.contact_email}`}>{faculty.contact_email}</a></p>

                <p><strong>Free Slots:</strong></p>
                <div className="slot-container">
                  {faculty.free_sessions_available.map((slot, index) => (
                    <div
                      key={index}
                      className="slot-box"
                      onClick={() => handleBookSlot(faculty, slot)}
                    >
                      {new Date(slot).toLocaleString()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertHelp;

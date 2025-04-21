import React, { useContext, useEffect, useState } from 'react';
import { UploadContext } from '../context/UploadContext';
import './ExpertHelp.css';  // CSS file for styling


const ExpertHelp = () => {
  const { selectedFile } = useContext(UploadContext);
  const [faculties, setFaculties] = useState([]);

  const handleBookSlot = (facultyId, slot) => {
    alert(`Appointment booked with Faculty ID: ${facultyId} at ${new Date(slot).toLocaleString()}`);
    // You can navigate to another page or update state to reflect booked status
  };

  useEffect(() => {
    const fetchFaculties = async () => {
      if (!selectedFile) return;

      try {
        const response = await fetch(
          `https://02c9-35-185-161-252.ngrok-free.app/fetch-faculties/${selectedFile}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

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
                      onClick={() => handleBookSlot(faculty.id, slot)}
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

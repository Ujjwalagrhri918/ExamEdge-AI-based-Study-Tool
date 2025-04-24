import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import "./AppointmentInfo.css";

const AppointmentInfo = () => {
  const { user } = useAuth(); // Get the user info from AuthContext
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Get the appointment information from localStorage
    if (user && user.email) {
      const storedAppointments =
        JSON.parse(localStorage.getItem(`${user.email}_appointments`)) || [];
      setAppointments(storedAppointments);
    }
  }, [user]);

  return (
    <>
      <h2>Your Appointments</h2>
      <div className="appointment-info-container">
        {appointments.length > 0 ? (
          <div className="appointments-list">
            {appointments.map((appointment, index) => (
              <div key={index} className="appointment-card">
                <div className="appointment-detail">
                  <strong>Faculty Name:</strong> {appointment.faculty_name}
                </div>
                <div className="appointment-detail">
                  <strong>Slot:</strong> {appointment.slot}
                </div>
                <div className="appointment-detail">
                  <strong>Language:</strong> {appointment.language}
                </div>
                <div className="appointment-detail">
                  <strong>Mode:</strong> {appointment.mode}
                </div>
                <div className="appointment-detail">
                  <strong>Description:</strong> {appointment.description}
                </div>
                <div className="appointment-detail">
                  <strong>Created At:</strong> {appointment.createdAt}
                </div>
                <div className="appointment-detail">
                  <strong>Status:</strong> {appointment.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-appointments">No appointments found.</div>
        )}
      </div>
    </>
  );
};

export default AppointmentInfo;

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import './Appointment.css';
import { useAuth } from "../auth/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Appointment = () => {
  const { state } = useLocation();
  const { faculty, slot } = state;
  const { db, user } = useAuth();

  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [mode, setMode] = useState('Video');
  const [agreed, setAgreed] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);  // New state to manage QR code visibility

  if (!faculty || !slot) {
    return <p>Error: Faculty or slot not provided.</p>;
  }

  const serviceTaxRate = 0.18;
  const taxAmount = faculty.session_price * serviceTaxRate;
  const totalAmount = faculty.session_price + taxAmount;

  const handleProceedToPayment = () => {
    if (!description.trim()) {
      alert('Please describe your query.');
      return;
    }
    if (!language) {
      alert('Please select your preferred language.');
      return;
    }
    if (!mode) {
      alert('Please select your preferred mode.');
      return;
    }
    if (!agreed) {
      alert('Please agree to the session policies to proceed.');
      return;
    }

    setShowQRCode(true); // Show QR code after validation
  };

  const handleConfirm = async () => {
    try {
      // Prepare the template parameters for the email
      const templateParams = {
        faculty_name: faculty.name,
        slot: new Date(slot).toLocaleString(),
        language,
        mode,
        description,
        price: totalAmount.toFixed(2),
        email: user.email,
      };
  
      // Send confirmation email via EmailJS
      const response = await emailjs.send(
        "service_u5dy6fw",            // Replace with your actual service ID
        "template_b0kzunv",           // Replace with your actual template ID
        templateParams,
        "3LpnVeh9Q8mG-Ay71" // You can keep this dynamic
      );
  
      // Log response for debugging
      console.log("Email sent successfully:", response);
  
      // Create appointment data to store in local storage
      const appointmentData = {
        faculty_name: faculty.name,
        slot: new Date(slot).toLocaleString(),
        language,
        mode,
        description,
        status: "Booked",  // You can adjust this as needed
        createdAt: new Date().toLocaleString(),  // Add created time
      };
  
      // Retrieve existing appointments from local storage or initialize an empty array
      const existingAppointments = JSON.parse(localStorage.getItem(`${user.email}_appointments`)) || [];
  
      // Add the new appointment to the existing appointments array
      existingAppointments.push(appointmentData);
  
      // Store the updated appointments array back to local storage
      localStorage.setItem(`${user.email}_appointments`, JSON.stringify(existingAppointments));
  
      // Set the payment completion flag
      setPaymentComplete(true);
  
      // Show success message
      alert("✅ Appointment booked and confirmation email sent!");
    } catch (error) {
      console.error("EmailJS error:", error);
  
      // Enhanced error handling
      if (error.response) {
        console.error("Error response:", error.response);
        alert(`Error sending email: ${error.response.status} - ${error.response.data}`);
      } else {
        console.error("Error sending email:", error.message);
        alert("Payment succeeded but failed to send confirmation email.");
      }
    }
  };
  

  return (
    <div className="appointment-container">
      <h3>🗓️ Confirm Your Appointment</h3>

      <div className="faculty-summary">
        <img src={faculty.image} alt={faculty.name} />
        <div>
          <h2>{faculty.name}</h2>
          <p>{faculty.title}</p>
          <p><strong>Slot:</strong><br />
            Local: {new Date(slot).toLocaleString()}<br />
            IST: {new Date(slot).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
          <p><strong>Price:</strong> ₹{faculty.session_price}</p>
          <p><strong>Expertise:</strong> {faculty.expertise?.join(', ')}</p>
        </div>
      </div>

      <label>Describe your query:<span style={{ color: 'red' }}> *</span></label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Explain your doubts or what help you need..."
        required
      />

      <label>Preferred Language:<span style={{ color: 'red' }}> *</span></label>
      <select value={language} onChange={(e) => setLanguage(e.target.value)} required>
        <option>English</option>
        <option>Hindi</option>
        <option>Tamil</option>
        <option>Telugu</option>
        <option>Marathi</option>
      </select>

      <label>Preferred Mode:<span style={{ color: 'red' }}> *</span></label>
      <select value={mode} onChange={(e) => setMode(e.target.value)} required>
        <option value="Video">🖥️ Video Call</option>
        <option value="Audio">📞 Audio Call</option>
        <option value="Chat">💬 Chat</option>
      </select>

      <div className="session-policy">
        <h4>📌 Session Notes</h4>
        <ul>
          <li>⏱️ Sessions are 30 minutes long.</li>
          <li>❌ No-shows without notice are non-refundable.</li>
          <li>🔁 You can reschedule up to 2 hours in advance.</li>
        </ul>
      </div>

      <div className="agreement">
        <input
          type="checkbox"
          checked={agreed}
          onChange={() => setAgreed(!agreed)}
        />
        <label>I agree to the above session policies<span style={{ color: 'red' }}> *</span></label>
      </div>

      <div className="total-amount">
        <p><strong>Session Fee:</strong> ₹{faculty.session_price}</p>
        <p><strong>Service Tax (18%):</strong> ₹{taxAmount.toFixed(2)}</p>
        <p><strong>Total Payable:</strong> ₹{totalAmount.toFixed(2)}</p>
      </div>

      {!showQRCode && !paymentComplete && (
        <button
          className="payment-btn"
          onClick={handleProceedToPayment}
        >
          💳 Proceed to Payment
        </button>
      )}

      {showQRCode && !paymentComplete && (
        <div className="qr-payment-section">
          <h4>📱 Scan to Pay</h4>
          {/* Use a static or random QR code from an external service */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=Random&size=180x180`}
            alt="QR Code"
            width={180}
            height={180}
          />
          <p>Pay ₹{totalAmount.toFixed(2)} using UPI above</p>

          <button className="payment-btn" onClick={() => {
            setShowPayment(true);
            setShowQRCode(false); // hide QR after confirming
          }}>
            ✅ I've Paid – Proceed
          </button>
        </div>
      )}

      {showPayment && !paymentComplete && (
        <div className="payment-section">
          <h4>🔒 Confirming Payment...</h4>
          <p>Click below to confirm and receive email confirmation.</p>
          <button className="payment-btn" onClick={handleConfirm}>📧 Send Confirmation Email</button>
        </div>
      )}

      {paymentComplete && (
        <div className="payment-success">
          <h4>🎉 Payment Successful!</h4>
          <p>Your appointment is confirmed and a confirmation has been sent to your email.</p>
        </div>
      )}
    </div>
  );
};

export default Appointment;

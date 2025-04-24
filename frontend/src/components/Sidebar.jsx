import "./Sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import {
  FiAlignLeft,
  FiMenu,
  FiSettings,
  FiPlus,
  FiClock,
  FiTrash2,
  FiUser,
  FiCalendar,
} from "react-icons/fi";
import { UploadContext } from "../context/UploadContext.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { uploads, selectFile, deleteFile } = useContext(UploadContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Reverse the uploads array to show recent ones first
  const reversedUploads = [...uploads].reverse();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Handle navigation to appointments
  const handleMyAppointments = () => {
    navigate("/appointments");
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Top Section */}
      <div className="sidebar-top">
        <button
          className="menu-button"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FiMenu />
        </button>

        <Link to="/">
          <div className="sidebar-item">
            <FiPlus />
            {!collapsed && <span>New Document</span>}
          </div>
        </Link>

        <div className="sidebar-item">
          <FiClock onClick={() => setCollapsed(!collapsed)} />
          {!collapsed && <span>Recent Chats</span>}
        </div>

        {!collapsed && (
          <div className="recent-chats-list">
            {reversedUploads.length > 0 ? (
              reversedUploads.map((file, index) => (
                <div key={index} className="chat-box-wrapper">
                  <Link
                    to="/summary"
                    className="chat-link"
                    onClick={() => selectFile(file.unique)}
                    state={{ fileName: file.unique }}
                  >
                    <div className="chat-box">
                      <FiAlignLeft />
                      {file.original}
                    </div>
                  </Link>
                  <button
                    className="delete-button"
                    onClick={() => deleteFile(file.unique)}
                    title="Delete chat"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))
            ) : (
              <div className="no-chats">No recent uploads</div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <div className="sidebar-item profile-button">
          <FiUser />
          {!collapsed && (
            <span className="user-info">
              {user ? (
                <div className="user-details">
                  <span className="user-name">
                    {user.displayName || user.email}
                  </span>
                  <div className="signed-in-container">
                    <button className="signed-in-button" onClick={handleLogout}>
                      Signed In
                    </button>
                    <span className="signout-tooltip">Sign Out</span>
                  </div>
                </div>
              ) : (
                <Link to="/auth" className="profile-link">
                  Profile
                </Link>
              )}
            </span>
          )}
        </div>

        <div className="sidebar-item settings-button">
          <FiSettings />
          {!collapsed && <span>Settings</span>}
        </div>

        {/* My Appointment Button */}
        <Link to="/appointments">
          <div className="sidebar-item">
            <FiCalendar />
            {!collapsed && <span>My Appointments</span>}
          </div>
        </Link>
      </div>
    </div>
  );
}

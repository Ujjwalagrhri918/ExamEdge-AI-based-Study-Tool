import "./Sidebar.css";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { FiAlignLeft, FiMenu, FiSettings, FiPlus, FiClock, FiTrash2 } from "react-icons/fi";
import { UploadContext } from "../context/UploadContext.jsx";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { uploads, selectFile, deleteFile } = useContext(UploadContext);

  // Reverse the uploads array to show recent ones first
  const reversedUploads = [...uploads].reverse();

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Top Section */}
      <div className="sidebar-top">
        <button className="menu-button" onClick={() => setCollapsed(!collapsed)}>
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
        <div className="sidebar-item settings-button">
          <FiSettings />
          {!collapsed && <span>Settings</span>}
        </div>
      </div>
    </div>
  );
}

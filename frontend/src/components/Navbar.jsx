import './Navbar.css';
import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiFileText,
  FiList,
  FiBookOpen,
  FiMessageCircle,
  FiHelpCircle,
} from 'react-icons/fi';

export default function Navbar() {
  return (
    <div className="navbar">
      <NavLink to="/" className="nav-item">
        <FiHome className="nav-icon" />
        <span>Home</span>
      </NavLink>

      <NavLink to="/summary" className="nav-item">
        <FiFileText className="nav-icon" />
        <span>Summary</span>
      </NavLink>

      <NavLink to="/mcqs" className="nav-item">
        <FiList className="nav-icon" />
        <span>MCQs</span>
      </NavLink>

      <NavLink to="/resources" className="nav-item">
        <FiBookOpen className="nav-icon" />
        <span>Resources</span>
      </NavLink>

      <NavLink to="/chat" className="nav-item">
        <FiMessageCircle className="nav-icon" />
        <span>Chat with Document</span>
      </NavLink>

      <NavLink to="/expert" className="nav-item">
        <FiHelpCircle className="nav-icon" />
        <span>Expert Help</span>
      </NavLink>
    </div>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav>
      <div className="nav-left">
        <Link to="/">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <div className="nav-right">
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;


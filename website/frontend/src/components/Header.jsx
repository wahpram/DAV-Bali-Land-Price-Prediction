// src/components/Header.jsx
import React from 'react';
import './Header.css';
import topLogo from '../assets/react.svg'; // Add your top logo image in the assets folder

const Header = () => {
  return (
    <div className="header">
      <img src={topLogo} alt="Top Logo" className="top-logo" />
    </div>
  );
};

export default Header;

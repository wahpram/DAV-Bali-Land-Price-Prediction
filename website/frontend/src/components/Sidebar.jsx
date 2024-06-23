import React, { useState } from 'react';
import './Sidebar.css';
import sidebarLogo from '../assets/landit.png';

const Sidebar = ({ onPageChange }) => {
  const [activePage, setActivePage] = useState('dashboard');

  const handlePageChange = (page) => {
    setActivePage(page);
    onPageChange(page);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={sidebarLogo} alt="Sidebar Logo" className="sidebar-logo-1" />
        <span className="sidebar-title-1">LAND IT</span>
      </div>
      
      <div
        className={activePage === 'dashboard' ? 'sidebar-box-1-active' : 'sidebar-box-1-inactive'}
        onClick={() => handlePageChange('dashboard')}
      >
        <div className='sidebar-box-2'>
          <img src="https://img.icons8.com/ios-filled/50/FFFFFF/home.png" alt="Dashboard" className='sidebar-logo-2'/>
        </div>
        <span className="sidebar-title-2">Land Overview</span>
      </div>
      
      <div
        className={activePage === 'pricePrediction' ? 'sidebar-box-1-active' : 'sidebar-box-1-inactive'}
        onClick={() => handlePageChange('pricePrediction')}
      >
        <div className='sidebar-box-2'>
          <img src="https://img.icons8.com/windows/96/FFFFFF/total-sales--v1.png" className='sidebar-logo-2'/>
        </div>
        <span className="sidebar-title-2">Price Prediction</span>
      </div>
    </div>
  );
};

export default Sidebar;

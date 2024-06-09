// src/components/Sidebar.jsx
import React from 'react';
import './Sidebar.css';
import sidebarLogo from '../assets/landit.png'; // Add your sidebar logo image in the assets folder


const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={sidebarLogo} alt="Sidebar Logo" className="sidebar-logo-1" />
        <span className="sidebar-title-1">LAND IT</span>
      </div>
      
      <div className='sidebar-box-1-active'>
        <div className='sidebar-box-2'>
        <img src="https://img.icons8.com/ios-filled/50/FFFFFF/home.png" alt="Dashboard" className='sidebar-logo-2'/>
        </div>
        <span className="sidebar-title-2">Land Overview</span>
      </div>
      
      <div className='sidebar-box-1-inactive'>
        <div className='sidebar-box-2'>
          <img src="https://img.icons8.com/windows/96/FFFFFF/total-sales--v1.png" className='sidebar-logo-2'/>
        </div>
        <span className="sidebar-title-2">Price Prediction</span>
      </div>
    </div>
  );
};

export default Sidebar;

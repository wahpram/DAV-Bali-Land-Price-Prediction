// src/components/MainContent.jsx
import React from 'react';
import Chart from './Chart';
import './MainContent.css';

const MainContent = () => {
  return (
    <div className="main-content-back">
      <div className="main-content">
        <h2>Dashboard</h2>
        <Chart />
      </div>
      <div className="main-content">
        <h2>Price Pred</h2>
        <Chart />
      </div>
      <div className="main-content">
        <h2>Dashboard</h2>
        <Chart />
      </div>
    </div>
    
  );
};

export default MainContent;

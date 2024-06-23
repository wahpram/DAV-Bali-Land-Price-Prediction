import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PricePrediction from './components/PricePrediction'; // Assuming you have a PricePrediction component
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      <div className="dashboard">
        <Sidebar onPageChange={handlePageChange} />
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'pricePrediction' && <PricePrediction />}
      </div>
    </div>
  );
}

export default App;

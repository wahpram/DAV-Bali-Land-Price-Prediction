import React, { useState } from 'react';
import axios from 'axios';
import './PredictCard.css'; // Assuming you have CSS for styling

const PredictCard = ({ onPredictionResult }) => {
  const [selectedRegency, setSelectedRegency] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegencyChange = (event) => {
    setSelectedRegency(event.target.value);
  };

  const handleSubdistrictChange = (event) => {
    setSelectedSubdistrict(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleButtonClick = () => {
    setIsLoading(true);

    const formData = {
      day: selectedDay,
      month: selectedMonth,
      regency: selectedRegency,
      subdistrict: selectedSubdistrict
    };

    console.log(formData)

    axios.post('http://127.0.0.1:5000/api/predict-one', formData)
      .then(response => {
        onPredictionResult(response.data); // Send prediction result to parent component
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Prediction error:', error);
        setIsLoading(false);
      });
  };
  return (
    <div className="predict-card-base">
      <div className="predict-card-header">
        <h2>Predict Land Prices</h2>
      </div>

      <div className="predict-card-content">
        <div className='predict-card-content-input'>
          <h3>Regency</h3>
          <div className="predict-card-content-input-dropdown">
            <select
              value={selectedRegency}
              onChange={handleRegencyChange}
            >
              <option value="" disabled>Select an option</option>
              <option value="1">Regency 1</option>
              <option value="2">Regency 2</option>
              <option value="3">Regency 3</option>
            </select>
          </div>
        </div>

        <div className='predict-card-content-input'>
          <h3>Subdistrict</h3>
          <div className="predict-card-content-input-dropdown">
            <select
              value={selectedSubdistrict}
              onChange={handleSubdistrictChange}
            >
              <option value="" disabled>Select an option</option>
              <option value="1">Subdistrict 1</option>
              <option value="2">Subdistrict 2</option>
              <option value="3">Subdistrict 3</option>
            </select>
          </div>
        </div>

        <div className='predict-card-content-input'>
          <h3>Year</h3>
          <div className="predict-card-content-input-dropdown">
            <select
              value={selectedYear}
              onChange={handleYearChange}
            >
              <option value="" disabled>Select an option</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
            </select>
          </div>
        </div>

        <div className='predict-card-content-input'>
          <h3>Month</h3>
          <div className="predict-card-content-input-dropdown">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              <option value="" disabled>Select an option</option>
              <option value="1">Month 1</option>
              <option value="2">Month 2</option>
              <option value="3">Month 3</option>
            </select>
          </div>
        </div>

        <div className='predict-card-content-input'>
          <h3>Day</h3>
          <div className="predict-card-content-input-dropdown">
            <select
              value={selectedDay}
              onChange={handleDayChange}
            >
              <option value="" disabled>Select an option</option>
              <option value="1">Day 1</option>
              <option value="2">Day 2</option>
              <option value="3">Day 3</option>
            </select>
          </div>
        </div>
      </div>
      <button onClick={handleButtonClick} className="predict-button" disabled={isLoading}>
        {isLoading ? 'Predicting...' : 'Predict'}
      </button>
    </div>
  );
};

export default PredictCard;

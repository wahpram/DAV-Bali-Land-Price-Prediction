import React, { useState } from 'react';
import axios from 'axios';
import './PredictCard.css'; 

const regencyData = [
  { id: '1', name: 'Bangli', subdistricts: ['Kintamani', 'Bangli'] },
  { id: '2', name: 'Jembrana', subdistricts:  ['Pekutatan', 'Jembrana', 'Negara', 'Mendoyo', 'Melaya'] },
  { id: '3', name: 'Karangasem', subdistricts:  ['Manggis', 'Karangasem', 'Kubu', 'Selat', 'Abang', 'Sidemen', 'Bebandem', 'Rendang'] },
  { id: '4', name: 'Klungkung', subdistricts: ['Nusa Penida', 'Banjarangkan', 'Klungkung', 'Dawan'] },
  { id: '5', name: 'Buleleng', subdistricts: ['Banjar', 'Buleleng', 'Kubu Tambahan', 'Sukasada', 'Gerokgak', 'Sawan', 'Tejakula', 'Busung Biu', 'Seririt'] },
  { id: '6', name: 'Tabanan', subdistricts: ['Selemadeg Barat', 'Kerambitan', 'Kediri', 'Selemadeg', 'Selemadeg Timur', 'Tabanan', 'Penebel', 'Marga', 'Pupuan'] },
  { id: '7', name: 'Gianyar', subdistricts:  ['Ubud', 'Sukawati', 'Tampaksiring', 'Gianyar', 'Tegallalang', 'Blahbatuh', 'Payangan'] },
  { id: '8', name: 'Denpasar', subdistricts: ['Denpasar Timur', 'Denpasar Barat', 'Denpasar Utara', 'Denpasar Selatan'] },
  { id: '9', name: 'Badung', subdistricts: ['Kuta Selatan', 'Kuta', 'Kuta Utara', 'Mengwi', 'Abiansemal', 'Petang'] },
];

const months = [
  { id: 1, name: 'January' },
  { id: 2, name: 'February' },
  { id: 3, name: 'March' },
  { id: 4, name: 'April' },
  { id: 5, name: 'May' },
  { id: 6, name: 'June' },
  { id: 7, name: 'July' },
  { id: 8, name: 'August' },
  { id: 9, name: 'September' },
  { id: 10, name: 'October' },
  { id: 11, name: 'November' },
  { id: 12, name: 'December' },
];
// const days = Array.from({ length: 31 }, (_, i) => i + 1); // 1 to 31

const PredictCard = ({ onPredictionResult }) => {
  const [selectedRegency, setSelectedRegency] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  // const [selectedDate, setSelectedDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegencyChange = (event) => {
    setSelectedRegency(event.target.value);
    setSelectedSubdistrict(''); // Reset subdistrict when regency changes
  };

  const handleSubdistrictChange = (event) => {
    setSelectedSubdistrict(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // const handleDateChange = (event) => {
  //   setSelectedDate(event.target.value);
  // };

  const handleButtonClick = () => {
    setIsLoading(true);

    const formData = {
      month: selectedMonth,
      regency: selectedRegency,
      subdistrict: selectedSubdistrict
    };

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

  const getSubdistrictOptions = () => {
    if (!selectedRegency) return [];
    const regency = regencyData.find(r => r.id === selectedRegency);
    return regency ? regency.subdistricts : [];
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
              {regencyData.map(regency => (
                <option key={regency.id} value={regency.id}>{regency.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className='predict-card-content-input'>
          <h3>Subdistrict</h3>
          <div className="predict-card-content-input-dropdown">
            <select
              value={selectedSubdistrict}
              onChange={handleSubdistrictChange}
              disabled={!selectedRegency}
            >
              <option value="" disabled>Select an option</option>
              {getSubdistrictOptions().map((subdistrict, index) => (
                <option key={index} value={subdistrict}>{subdistrict}</option>
              ))}
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
              {months.map((month) => (
                <option key={month.id} value={month.id}>{month.name}</option>
              ))}
            </select>
          </div>
        </div>
{/* 
        <div className='predict-card-content-input'>
          <h3>Date</h3>
          <div className="predict-card-content-input-dropdown">
            <select
              value={selectedDate}
              onChange={handleDateChange}
            >
              <option value="" disabled>Select an option</option>
              {days.map((day, index) => (
                <option key={index} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div> */}
      </div>
      <button onClick={handleButtonClick} className="predict-button" disabled={isLoading}>
        {isLoading ? 'Predicting...' : 'Predict'}
      </button>
    </div>
  );
};

export default PredictCard;

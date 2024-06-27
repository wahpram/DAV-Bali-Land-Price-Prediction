import React, { useState, useEffect } from 'react';
import PredictCard from './PredictCard';
import AnalyticCard from './AnalyticCard';
import './PricePrediction.css';
import PredictCardResult from './PredictCardResult';
import BarChart from './BarChart'


const PricePrediction = () => {

  const [datas, setDatas] = useState([]);
  const [avgPriceTotalPerM2, setAvgPriceTotalPerM2] = useState([]);
  const [predictedPrices, setPredictedPrices] = useState({});
  const [error, setError] = useState('');


  useEffect(() => {
    fetchDatas();
    fetchAvgPriceTotalPerM2();
  }, []);

  const fetchDatas = async () => {
    const response = await fetch('http://127.0.0.1:5000/api/data');
    const data = await response.json();
    const sortedData = data.datas.sort((a, b) => a.price_per_m2 - b.price_per_m2);
    setDatas(sortedData);
    console.log(sortedData)
  };

  const fetchAvgPriceTotalPerM2= async () => {
    const response = await fetch('http://127.0.0.1:5000/api/data/avg-price-m2');
    const data = await response.json();
    setAvgPriceTotalPerM2(data);
    // console.log(data)
  };
  
  const formatLandPrice = (amount) => {
    const oneAre = 100 * Math.round(amount);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
    }).format(oneAre);
  };
  
  const analyticData = [
    { title: 'Average Land Price in Bali (m²)', value: `${avgPriceTotalPerM2.average_price_per_m2}`, image: "https://img.icons8.com/ios-filled/100/FFFFFf/money-bag.png" },
    { title: 'Lowest Land Price per (100m²)', value: datas.length > 0 ? formatLandPrice(datas[0].price_per_m2) : 'Loading...', image: "https://img.icons8.com/ios-filled/50/FFFFFf/nui2.png" },
    { title: 'Highest Land Price per (100m²)', value: datas.length > 0 ? formatLandPrice(datas[datas.length - 1].price_per_m2) : 'Loading...', image: "https://img.icons8.com/ios-filled/50/FFFFFF/country.png" },
    { title: 'Land For Sale', value: datas.length > 0 ? datas.length : 'Loading...', image: "https://img.icons8.com/ios-glyphs/30/FFFFFf/handshake--v1.png" },
  ];

  
  const handlePredictionResult = (predictions) => {
    setPredictedPrices(predictions);
    console.log(predictions)
  };

  return (
    <div className="base">
      <h2>Price Prediction</h2>

      <div className='AnalyticCard'>
        {analyticData.map((data, index) => (
          <AnalyticCard key={index} title={data.title} value={data.value} image={data.image} />
        ))}
      </div>

      <div className='main-content'>
        <div className="predict-main-content-container">
          <PredictCard onPredictionResult={handlePredictionResult} />
          {Object.keys(predictedPrices).length > 0 && <PredictCardResult data={predictedPrices} />}
        </div>
      </div>

      <div className='main-content'>
        <div className="predict-main-content-chart-container">
          <h2>Model Prediction Chart</h2>
          {Object.keys(predictedPrices).length > 0 && <BarChart data={predictedPrices} type="prediction" />}
        </div>
      </div>
    </div>
  );
};

export default PricePrediction;

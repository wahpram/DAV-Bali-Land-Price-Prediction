import React, { useState } from 'react';
import PredictCard from './PredictCard';
import AnalyticCard from './AnalyticCard';
import './PricePrediction.css';
import PredictCardResult from './PredictCardResult';
import Chart from './Chart';

const analyticData = [
  { title: 'Average Land Price in Bali', value: "$54,000", image: "https://img.icons8.com/ios-filled/100/FFFFFf/money-bag.png" },
  { title: 'Land Prices Checked This Month', value: "2,300", image: "https://img.icons8.com/ios-filled/50/FFFFFf/nui2.png" },
  { title: 'New Lands', value: "2,300", image: "https://img.icons8.com/ios-filled/50/FFFFFF/country.png" },
  { title: 'Land Sold This Month', value: "573", image: "https://img.icons8.com/ios-glyphs/30/FFFFFf/handshake--v1.png" },
];

const PricePrediction = () => {
  const [predictedPrices, setPredictedPrices] = useState({});
  const [error, setError] = useState('');

  const handlePredictionResult = (predictions) => {
    setPredictedPrices(predictions);
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
          {Object.keys(predictedPrices).length > 0 && <PredictCardResult predictedPrices={predictedPrices} />}
        </div>
      </div>

      <div className='main-content'>
        <div className="main-content-container">
          <Chart />
        </div>
      </div>
    </div>
  );
};

export default PricePrediction;

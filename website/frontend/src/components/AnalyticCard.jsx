// src/components/AnalyticCard.jsx
import React from 'react';
import './AnalyticCard.css';

const AnalyticCard = ({ title, value, image }) => {
  return (
    <div className='AnalyticCard-box'>
        <div className='AnalyticCard-Text-Box'>          
            <div className='AnalyticCard-Text-Box-1'>
                <span>{title}</span>
            </div>
            <div className='AnalyticCard-Text-Box-2'>
                <span>{value}</span>
            </div>
        </div>

        <div>
            <div className='AnalyticCard-Image-Box'>
                <img src={image}/>
            </div>
        </div>
        
    </div>
  );
};

export default AnalyticCard;

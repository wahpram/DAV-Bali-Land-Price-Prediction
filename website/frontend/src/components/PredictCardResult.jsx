import React from "react";
import './PredictCardResult.css'

const PredictCardResult = ({predictedPrices}) => {
    console.log('Predicted Prices:', predictedPrices);
    return (
      <div className="predict-card-result-base">
        <div className="predict-card-result-header"> 
            <h2>Predicted Land Prices</h2>
        </div>

        <div className="predict-card-result-content">
            <div className='predict-card-result-content-output'>
                
                <h3>Predicted Price</h3>
                <div className="predict-card-result-content-output-box">
                    <h4>{predictedPrices.xgb_pred}/m<sup>2</sup></h4>
                </div>
            </div>

            <div className='predict-card-result-content-output'>
                <h3>Model Used</h3>
                <div className="predict-card-result-content-output-box">
                    <h4>XGBoost</h4>
                </div>
            </div>
            
        </div>

        <div className="predict-card-result-content">
            <div className='predict-card-result-content-output'>
                
                <h3>Predicted Price</h3>
                <div className="predict-card-result-content-output-box">
                    <h4>{predictedPrices.rfr_pred}/m<sup>2</sup></h4>
                </div>
            </div>

            <div className='predict-card-result-content-output'>
                <h3>Model Used</h3>
                <div className="predict-card-result-content-output-box">
                    <h4>Random Forest Regressor</h4>
                </div>
            </div>
        </div>

        <div className="predict-card-result-content">
            <div className='predict-card-result-content-output'>
                
                <h3>Predicted Price</h3>
                <div className="predict-card-result-content-output-box">
                    <h4>{predictedPrices.mlr_pred}/m<sup>2</sup></h4>
                </div>
            </div>

            <div className='predict-card-result-content-output'>
                <h3>Model Used</h3>
                <div className="predict-card-result-content-output-box">
                    <h4>Multi Linear Regression</h4>
                </div>
            </div>
        </div>
      </div>
    );
  };
  
  export default PredictCardResult;
  
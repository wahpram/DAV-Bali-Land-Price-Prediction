import React from "react";
import './PredictCardResult.css'

const PredictCardResult = ({data}) => {
    console.log('Predicted Card Result JSX:', data);
    return (
      <div className="predict-card-result-base">
        <div className="predict-card-result-header"> 
            <h2>Predicted Land Prices</h2>
        </div>

        <div className="predict-card-result-content">
            <div className='predict-card-result-content-output'>
                
                <h3>Predicted Price</h3>
                <div className="predict-card-result-content-output-box">
                    <h4>{data.xgb_pred}/m<sup>2</sup></h4>
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
                    <h4>{data.rfr_pred}/m<sup>2</sup></h4>
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
                    <h4>{data.mlr_pred}/m<sup>2</sup></h4>
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
  
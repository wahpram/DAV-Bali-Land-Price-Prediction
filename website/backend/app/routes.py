import os
import joblib
import numpy as np
import pandas as pd
import datetime
from app import app, db
from flask import jsonify, render_template, request

base_dir = os.path.dirname(os.path.abspath(__file__))

xgb_model = os.path.join(base_dir, '..', '..', '..', 'models', 'xgboost_model.pkl')
rfr_model = os.path.join(base_dir, '..', '..', '..', 'models', 'rfr_model.pkl')
mlr_model = os.path.join(base_dir, '..', '..', '..', 'models', 'mlr_model.pkl')
subdistrict_label_encoder = os.path.join(base_dir, '..', '..', '..', 'models', 'subdistrict_encode.pkl')
regency_label_encoder = os.path.join(base_dir, '..', '..', '..', 'models', 'regency_encode.pkl')

xgb_model = joblib.load(xgb_model)
rfr_model = joblib.load(rfr_model)
mlr_model = joblib.load(mlr_model)
subdistrict_label_encoder = joblib.load(subdistrict_label_encoder)
regency_label_encoder = joblib.load(regency_label_encoder)

collection = db['tanah_bali_clean']

def format_rupiah(amount):
    rounded_amount = round(amount)
    amount_str = f"{rounded_amount:,.2f}"
    parts = amount_str.split(".")
    parts[0] = parts[0].replace(",", ".")
    return f"Rp{parts[0]},{parts[1]}"


@app.route('/api/data', methods=['GET'])
def get_data():
    cursor = collection.find()
    data = list(cursor)
    
    for item in data:
        item.pop('_id', None)
    
    return jsonify(data)


@app.route('/api/data/avg-price-total', methods=['GET'])
def get_avg_price_total():
    pipeline = [
        {"$group": {"_id": "$regency", "avg_price_total": {"$avg": "$price_total"}}}
    ]
    results = list(collection.aggregate(pipeline))
    
    response = []
    for result in results:
        regency_data = {
            "regency": result["_id"],
            "average_price_total": format_rupiah(result["avg_price_total"])
        }
        response.append(regency_data)

    return jsonify(response)


@app.route('/api/data/avg-price-m2', methods=['GET'])
def get_avg_price_per_m2():
    pipeline = [
        {"$group": {"_id": "$regency", "avg_price_per_m2": {"$avg": "$price_per_m2"}}}
    ]
    
    results = list(collection.aggregate(pipeline))
    
    response = []
    for result in results:
        regency_data = {
            "regency": result["_id"],
            "average_price_per_m2": format_rupiah(result["avg_price_per_m2"])
        }
        response.append(regency_data)

    return jsonify(response)


@app.route('/api/prediction', methods=['POST'])
def prediction():
    try:
        data = request.json
        
        day = data.get('day')
        month = data.get('month')
        regency = data.get('regency')
        subdistrict = data.get('subdistrict')
        
        if not all([day, month, regency, subdistrict]):
            return jsonify({'error': 'Invalid input data'}), 400
        
        new_data = {
            'month': [month],
            'day': [day],
            'subdistrict': [subdistrict],
            'regency': [regency]
        }
        new_df = pd.DataFrame(new_data)
        
        new_df['regency_encoded'] = new_df['regency'].apply(lambda x: regency_label_encoder.get(x, -1))
        new_df['subdistrict_encoded'] = new_df['subdistrict'].apply(lambda x: subdistrict_label_encoder.get(x, -1))

        new_df.drop(['subdistrict', 'regency'], axis=1, inplace=True)
        
        xgb_pred = xgb_model.predict(new_df)
        xgb_pred = float(np.exp(xgb_pred[0]))
        xgb_pred = format_rupiah(xgb_pred)
        
        rfr_pred = rfr_model.predict(new_df)
        rfr_pred = float(np.exp(rfr_pred[0]))
        rfr_pred = format_rupiah(rfr_pred)
        
        mlr_pred = mlr_model.predict(new_df)
        mlr_pred = float(np.exp(mlr_pred[0]))
        mlr_pred = format_rupiah(mlr_pred)
        
        predictions = {
            'xgb_pred': xgb_pred,
            'rfr_pred': rfr_pred,
            'mlr_pred': mlr_pred
        }
        
        return jsonify(predictions)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

@app.route('/')
def index():
    return render_template('index.html')

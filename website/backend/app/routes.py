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

    return jsonify({'datas': data})


@app.route('/api/data/avg-price-total/regency', methods=['GET'])
def get_avg_price_total_regency():
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


@app.route('/api/data/avg-price-total', methods=['GET'])
def get_avg_price_total():
    pipeline = [
        {"$group": {"_id": None, "avg_price_total": {"$avg": "$price_total"}}}
    ]
    results = list(collection.aggregate(pipeline))
    
    if results:
        avg_price_total = results[0]['avg_price_total']
        avg_price_total_formatted = format_rupiah(avg_price_total)
        response = {"average_price_total": avg_price_total_formatted}
    else:
        response = {"average_price_total": "N/A"}
    
    return jsonify(response)


@app.route('/api/data/avg-price-m2', methods=['GET'])
def get_avg_price_per_m2():
    pipeline = [
        {"$group": {"_id": None, "avg_price_per_m2": {"$avg": "$price_per_m2"}}}
    ]
    results = list(collection.aggregate(pipeline))
    
    if results:
        avg_price_total = results[0]['avg_price_per_m2']
        avg_price_total_formatted = format_rupiah(avg_price_total)
        response = {"average_price_per_m2": avg_price_total_formatted}
    else:
        response = {"average_price_per_m2": "N/A"}
    
    return jsonify(response)


@app.route('/api/data/avg-price-m2/regency', methods=['GET'])
def get_avg_price_per_m2_regency():
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


@app.route('/api/data/avg-price-per-m/regency/<regency>', methods=['GET'])
def get_avg_per_m_subd(regency):
    pipeline = [
        {"$match": {"regency": regency}},
        {"$group": {
            "_id": "$subdistrict",
            "avg_price_per_m2": {"$avg": "$price_per_m2"}
        }}
    ] 

    results = list(collection.aggregate(pipeline))

    response = []
    for result in results:
        subdistrict_data = {
            "subdistrict": result["_id"],
            "average_price_per_m2": format_rupiah(result["avg_price_per_m2"])
        }
        response.append(subdistrict_data)

    return jsonify(response)


@app.route('/api/data/avg-price-total/regency/<regency>', methods=['GET'])
def get_avg_total_subd(regency):
    pipeline = [
        {"$match": {"regency": regency}},
        {"$group": {
            "_id": "$subdistrict",
            "avg_price_total": {"$avg": "$price_total"}
        }}
    ] 

    results = list(collection.aggregate(pipeline))

    response = []
    for result in results:
        subdistrict_data = {
            "subdistrict": result["_id"],
            "average_price_total": format_rupiah(result["avg_price_total"])
        }
        response.append(subdistrict_data)

    return jsonify(response)


@app.route('/api/predict-one', methods=['POST'])
def predict_one():
    try:
        data = request.json

        month = data.get('month')
        regency = data.get('regency')
        subdistrict = data.get('subdistrict')

        if not all([month, regency, subdistrict]):
            return jsonify({'error': 'Invalid input data'}), 400
        
        new_data = {
            'month': [month],
            'subdistrict': [subdistrict],
            'regency': [regency]
        }
        new_df = pd.DataFrame(new_data)
        columns_to_convert = ['month']

        for col in columns_to_convert:
            if col in new_df.columns:
                new_df[col] = new_df[col].astype(int)
        
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
    

@app.route('/api/predict-subdistricts', methods=['POST'])
def predict_all_subdistricts():
    try:
        data = request.json
        
        regency = data.get('regency')
        month = data.get('month')
        
        if not all([month, regency]):
            return jsonify({'error': 'Invalid input data'}), 400
        
        pipeline = [
            {'$match': {'regency': regency}},
            {'$group': {'_id': '$subdistrict'}},
            {'$project': {'subdistrict': '$_id', '_id': 0}}
        ]
        
        subdistricts_cursor = collection.aggregate(pipeline)
        subdistricts = [doc['subdistrict'] for doc in subdistricts_cursor]
        
        predictions = {}
        
        for subdistrict in subdistricts:
            new_data = {
                'month': [month],
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
            
            predictions[subdistrict] = {
                'xgb_pred': xgb_pred,
                'rfr_pred': rfr_pred,
                'mlr_pred': mlr_pred
            }
        
        return jsonify(predictions)
    
    except KeyError as e:
        return jsonify({'error': f'Missing key in input data: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/predict-all', methods=['POST'])
def predict_all():
    try:
        data = request.json
        
        month = data.get('month')
        
        if not month:
            return jsonify({'error': 'Invalid input data'}), 400
        
        # MongoDB aggregation pipeline to fetch distinct combinations of regency and subdistrict
        pipeline = [
            {'$group': {'_id': {'regency': '$regency', 'subdistrict': '$subdistrict'}}},
            {'$project': {'regency': '$_id.regency', 'subdistrict': '$_id.subdistrict', '_id': 0}}
        ]
        
        regencies_subdistricts_cursor = collection.aggregate(pipeline)
        
        predictions = {}
        
        for doc in regencies_subdistricts_cursor:
            regency = doc['regency']
            subdistrict = doc['subdistrict']
            
            new_data = {
                'month': [month],
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
            
            if regency not in predictions:
                predictions[regency] = {}
            
            predictions[regency][subdistrict] = {
                'xgb_pred': xgb_pred,
                'rfr_pred': rfr_pred,
                'mlr_pred': mlr_pred
            }
        
        return jsonify(predictions)
    
    except KeyError as e:
        return jsonify({'error': f'Missing key in input data: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/')
def index():
    return render_template('index.html')

# @app.route('/price-predict')
# def pricepredict():
#     return render_template('pricepredict.html')

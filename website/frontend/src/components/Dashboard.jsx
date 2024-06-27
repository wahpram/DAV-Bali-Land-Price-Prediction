import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import AnalyticCard from './AnalyticCard';
import SummaryTab from './SummaryTab';
import CustomCarousel from './Carousel';


const Dashboard = () => {
  const [datas, setDatas] = useState([]);
  const [avgPriceTotal, setAvgPriceTotal] = useState([]);
  const [avgPricePerM2, setAvgPricePerM2] = useState([]);
  const [avgPriceTotalPerM2, setAvgPriceTotalPerM2] = useState([]);

  useEffect(() => {
    fetchDatas();
    fetchAvgPriceTotal();
    fetchAvgPricePerM2();
    fetchAvgPriceTotalPerM2();
  }, []);

  const fetchDatas = async () => {
    const response = await fetch('http://127.0.0.1:5000/api/data');
    const data = await response.json();
    const sortedData = data.datas.sort((a, b) => a.price_per_m2 - b.price_per_m2);
    setDatas(sortedData);
    console.log(sortedData)
  };

  const fetchAvgPriceTotal = async () => {
    const response = await fetch('http://127.0.0.1:5000/api/data/avg-price-total/regency');
    const data = await response.json();
    const sortedData = data.sort((a, b) =>
      parseFloat(a.average_price_total.replace(/[^\d.-]/g, '')) - parseFloat(b.average_price_total.replace(/[^\d.-]/g, ''))
    );
    setAvgPriceTotal(sortedData);
    // console.log(data)
  };

  const fetchAvgPricePerM2 = async () => {
    const response = await fetch('http://127.0.0.1:5000/api/data/avg-price-m2/regency');
    const data = await response.json();
    const sortedData = data.sort((a, b) =>
      parseFloat(a.average_price_per_m2.replace(/[^\d.-]/g, '')) - parseFloat(b.average_price_per_m2.replace(/[^\d.-]/g, ''))
    );
    setAvgPricePerM2(sortedData);
    // console.log(data)
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


  return (
    <div className="base">
      <div>
        <h2>Dashboard</h2>
      </div>
      
      <div className='AnalyticCard'>
        {analyticData.map((data, index) => (
          <AnalyticCard key={index} title={data.title} value={data.value} image={data.image} />
        ))}
      </div>

      <div className="main-content-container">
        <div className="main-content">
          <h2>Land Price Overview</h2>
          <CustomCarousel chart_data={avgPricePerM2} data_origin="dashboard"/>
        </div>

        <div className="summary-card-container">
          <div className='SummaryTab'>
            <h2>Price Rankings</h2>
            <h3>Lowest to Highest (per 100m<sup>2</sup>)</h3>
            {datas.slice(0, 12).map((sortedData, index) => (
              <SummaryTab
                key={index}
                subdistrict={sortedData.subdistrict}
                regency={sortedData.regency}
                price={formatLandPrice(sortedData.price_per_m2)}
              />
            ))}
          </div>

          <div className='SummaryTab'>
            <h2>Average Price Total</h2>
            <h3>For Each Regency</h3>
            {avgPriceTotal.map((data, index) => (
              <SummaryTab
                key={index}
                subdistrict={data.regency}
                price={data.average_price_total}
              />
            ))}
          </div>

          <div className='SummaryTab'>
            <h2>Average Price per m<sup>2</sup></h2>
            <h3>For Each Regency</h3>
            {avgPricePerM2.map((data, index) => (
              <SummaryTab
                key={index}
                subdistrict={data.regency}
                price={data.average_price_per_m2}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

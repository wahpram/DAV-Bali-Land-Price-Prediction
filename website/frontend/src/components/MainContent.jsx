// src/components/MainContent.jsx
import React from 'react';
import Chart from './Chart';
import './MainContent.css';
import AnalyticCard from './AnalyticCard';
import SummaryTab from './SummaryTab';

import sidebarLogo from '../assets/landit.png'; // Add your sidebar logo image in the assets folder
import sidebarLogo2 from '../assets/react.svg'; // Add your sidebar logo image in the assets folder

const analyticData = [
  { title: 'Average Land Price in Bali', value: "$54,000", image: sidebarLogo },
  { title: 'Land Prices Checked This Month', value: "2,300", image: sidebarLogo2 },
  { title: 'New Lands', value: "2,300", image: sidebarLogo2 },
  { title: 'Land Sold This Month', value: "573", image: sidebarLogo2 },
];

const priceOverview = [
  { subdistrict: 'Subdistrict', regency: 'Regency', price: 'Price'},
  { subdistrict: 'Ubud', regency: 'Gianyar', price: '300.200.000'},
  { subdistrict: 'Denpasar Selatan', regency: 'Denpasar', price: '500.200.000'},
  { subdistrict: 'Ubud', regency: 'Gianyar', price: '130.200.000'},
  { subdistrict: 'Ubud', regency: 'Gianyar', price: '320.200.000'},
  { subdistrict: 'Denpasar Selatan', regency: 'Denpasar', price: '900.200.000'},
  { subdistrict: 'Ubud', regency: 'Gianyar', price: '50.200.000'},
  { subdistrict: 'Denpasar Selatan', regency: 'Denpasar', price: '800.200.000'},
  { subdistrict: 'Ubud', regency: 'Gianyar', price: '200.200.000'}
];

// const landforsaleOverview = [
//   { subdistrict: 'Subdistrict', regency: 'Regency', total: 'Total'},
//   { subdistrict: 'Ubud', regency: 'Gianyar', total: '51'},
//   { subdistrict: 'Denpasar Selatan', regency: 'Denpasar', total: '32'},
//   { subdistrict: 'Ubud', regency: 'Gianyar', total: '45'},
//   { subdistrict: 'Ubud', regency: 'Gianyar', total: '32'}
// ];

const MainContent = () => {
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
          <h2>Price Chart</h2>
          <Chart />
        </div>

        <div className='SummaryTab'>
          <h2>Price Rankings</h2>
          <h3>Highest to Lowest</h3>
          {priceOverview.map((priceData, index) => (
          <SummaryTab key={index} subdistrict={priceData.subdistrict} regency={priceData.regency} price={priceData.price}/>
          ))}
        </div>
        
        {/* <div className='SummaryTab'>
          <h2>Land for Sale</h2>
          <h3>Most to Least</h3>
          {landforsaleOverview.map((landData, index) => (
          <SummaryTab key={index} subdistrict={landData.subdistrict} regency={landData.regency} price={landData.total}/>
          ))}
        </div> */}

      </div>
    </div>
    
  );
};

export default MainContent;

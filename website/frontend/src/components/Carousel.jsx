// src/components/Carousel.jsx
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Carousel.css';

import MapChart from './MapChart'; // Import MapChart component
import BarChart from './BarChart';

const CustomCarousel = ({ map_chart_data, bar_chart_data, data_origin }) => {
  // console.log("MAP CHART DATA", map_chart_data)
  // console.log("BAR CHART DATA", bar_chart_data)
  return (
    <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} autoPlay={true} interval={4500} >
      <div>
      <h2>Average Land Prices on Each Subdistrict in Bali (m²)</h2>
        <MapChart data={map_chart_data}/>
        {/* <p className="legend">Map 1</p> */}
      </div>
      <div>
      <h2>Average Land Prices on Each Regency in Bali (m²)</h2>
        <BarChart data={bar_chart_data} type={data_origin}/>
        {/* <p className="legend">Map 2</p> */}
      </div>
    </Carousel>
  );
};

export default CustomCarousel;

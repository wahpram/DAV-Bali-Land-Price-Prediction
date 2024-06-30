// src/components/Carousel.jsx
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Carousel.css';

import MapChart from './MapChart'; // Import MapChart component
import BarChart from './BarChart';

const CustomCarousel = ({ chart_data, data_origin }) => {
  return (
    <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} autoPlay={true} interval={3000}>
      <div>
        <MapChart />
        {/* <p className="legend">Map 1</p> */}
      </div>
      <div>
        <BarChart data={chart_data} type={data_origin}/>
        {/* <p className="legend">Map 2</p> */}
      </div>
      <div>
        <MapChart />
        {/* <p className="legend">Map 3</p> */}
      </div>
    </Carousel>
  );
};

export default CustomCarousel;

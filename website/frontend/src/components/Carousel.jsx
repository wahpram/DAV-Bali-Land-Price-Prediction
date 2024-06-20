// src/components/Carousel.jsx
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Carousel.css';

import Chart from './Chart';

const CustomCarousel = () => {
  return (
    <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} autoPlay={true} interval={3000}>
      <div>
        <Chart /> {/* Add the Chart component as a slide */}
        {/* <p className="legend">Chart</p> */}
      </div>
      <div>
        <Chart /> {/* Add the Chart component as a slide */}
        {/* <p className="legend">Chart</p> */}
      </div>
      <div>
        <Chart /> {/* Add the Chart component as a slide */}
        {/* <p className="legend">Chart</p> */}
      </div>
    </Carousel>
  );
};

export default CustomCarousel;

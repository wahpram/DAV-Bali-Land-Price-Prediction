// src/components/MapChart.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3'; // Import D3 library
import './MapChart.css'; // CSS file for styling the map

const formatPrice = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(amount);
};

const groupByRegency = (data) => {
  return data.reduce((acc, item) => {
    if (!acc[item.regency]) {
      acc[item.regency] = {};
    }
    
    if (!acc[item.regency][item.subdistrict]) {
      acc[item.regency][item.subdistrict] = {
        total_price_per_m2: 0,
        count: 0
      };
    }

    acc[item.regency][item.subdistrict].total_price_per_m2 += item.price_per_m2;
    acc[item.regency][item.subdistrict].count++;

    return acc;
  }, {});
};



const MapChart = ({ data }) => {
  const svgRef = useRef(null);
  
  useEffect(() => {
    // console.log("Incoming data:", data);

    const groupRegencyData = groupByRegency(data);
    console.log("Parsed data:", groupRegencyData);

    // Calculate average price per m² for each subdistrict within each regency
    Object.keys(groupRegencyData).forEach(regency => {
      Object.keys(groupRegencyData[regency]).forEach(subdistrict => {
        const { total_price_per_m2, count } = groupRegencyData[regency][subdistrict];
        groupRegencyData[regency][subdistrict].average_price_per_m2 = total_price_per_m2 / count;
      });
    });

    console.log("Processed Data: ", groupRegencyData);
    
    // Define dimensions and margins
    const width = 900;
    const height = 400;
    const margin = { top: 100, right: 30, bottom: 100, left: 30 };

    // Fetch GeoJSON data
    fetch('/src/components/bali.geojson')
      .then(response => response.json())
      .then(data => {
        // Remove existing SVG content if any
        d3.select(svgRef.current).selectAll('*').remove();

        // Create SVG container
        const svg = d3.select(svgRef.current)
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Define a projection (e.g., Mercator)
        const projection = d3.geoMercator()
          .fitSize([width, height], data);

        // Create a path generator
        const path = d3.geoPath()
          .projection(projection);

        // Draw GeoJSON features
        svg.selectAll('path')
          .data(data.features)
          .enter().append('path')
          .attr('class', 'map-path') // Add class for CSS styling
          .attr('d', path)
          .on('mouseover', function(event, d) {
            d3.select(this).classed('hovered', true); // Apply hover class
          })
          .on('mousemove', function(event, d) {
            // Remove existing labels
            svg.selectAll('.label-box').remove();
            svg.selectAll('.label-text').remove();
            svg.selectAll('.additional-text').remove();
          
            // Get the cursor position
            const [x, y] = d3.pointer(event);
          
            // Append box for the label
            svg.append('rect')
              .attr('class', 'label-box')
              .attr('x', x + 10) // Offset to the right of the cursor
              .attr('y', y - 100) // Offset below the cursor
              .attr('width', 300) // Width of the box
              .attr('height', 200) // Height of the box, adjusted for multiple lines
              .attr('rx', 5) // Rounded corners
              .attr('ry', 5); // Rounded corners
          
            // Append main text label
            svg.append('text')
              .attr('class', 'label-text')
              .attr('x', x + 25) // Adjust x position to be inside the box
              .attr('y', y - 75) // Adjust y position to be inside the box
              .text(d.properties.nm_kabkota);
          
            // Append additional text labels as a list
            const additionalInfo = [];
          
            // Append additional info based on regency from groupRegencyData
            if (groupRegencyData[d.properties.nm_kabkota]) {
              Object.keys(groupRegencyData[d.properties.nm_kabkota]).forEach(subdistrict => {
                const avgPrice = groupRegencyData[d.properties.nm_kabkota][subdistrict].average_price_per_m2;
                additionalInfo.push(`${subdistrict}\t:\t${formatPrice(avgPrice)}`);
              });
            }
          
            additionalInfo.forEach((info, i) => {
              svg.append('text')
                .attr('class', 'additional-text')
                .attr('x', x + 25) // Adjust x position to be inside the box
                .attr('y', y - 50 + (i * 16)) // Adjust y position for each line
                .text(info);
            });
          })
          .on('mouseout', function() {
            d3.select(this).classed('hovered', false); // Remove hover class

            // Remove box and text labels
            svg.selectAll('.label-box').remove();
            svg.selectAll('.label-text').remove();
            svg.selectAll('.additional-text').remove();
          });
      });

  }, []);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default MapChart;

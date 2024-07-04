import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './BarChart.css';

const parsePricePredictionData = (data) => {
  const keyMap = {
    mlr_pred: 'Multi Regression Model',
    rfr_pred: 'Random Forest Regressor',
    xgb_pred: 'XGBoost'
  };
  return Object.keys(data).map(key => ({
    name: keyMap[key],
    value: parseFloat(data[key].replace(/[Rp.]/g, ''))
  }));
};

const parseDashboardData = (data) => {
  return data.map(item => ({
    name: item.regency,
    value: parseFloat(item.average_price_per_m2.replace(/[Rp.]/g, ''))
  }));
};

const formatPrice = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(amount);
};

const BarChart = ({ data, type }) => {
  const svgRef = useRef();

  useEffect(() => {
    const parsedData = type === 'prediction' ? parsePricePredictionData(data) : parseDashboardData(data);
    // console.log(parsedData)
    const svg = d3.select(svgRef.current)
      .attr('width', 1200)
      .attr('height', 500)
      .style('margin-top', '75px')
      .style('margin-bottom', '50px')
      .style('overflow', 'visible');

    const xScale = d3.scaleBand()
      .domain(parsedData.map(d => d.name))
      .range([0, 1250])
      .padding(0.5);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(parsedData, d => d.value)])
      .range([500, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(6);

    svg.selectAll('*').remove(); // Clear previous renders

    svg.append('g')
      .attr('class', 'x-axis')
      .call(xAxis)
      .attr('transform', 'translate(0, 500)');

    svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    svg.selectAll('.bar')
      .data(parsedData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.name))
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => 500 - yScale(d.value))
      .on('mouseover', function (event, d) {
        d3.select(this).classed('hovered', true);
      })
      .on('mousemove', function (event, d) {
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
          .attr('y', y - 70) // Offset below the cursor
          .attr('width', 250) // Width of the box
          .attr('height', 70) // Height of the box, adjusted for multiple lines
          .attr('rx', 5) // Rounded corners
          .attr('ry', 5) // Rounded corners;

        // Append main text label
        svg.append('text')
          .attr('class', 'label-text')
          .attr('x', x + 25) // Adjust x position to be inside the box
          .attr('y', y - 45) // Adjust y position to be inside the box
          .text(d.name);

        // Append additional text labels as a list
        const additionalInfo = [
          `Price: ${formatPrice(d.value)}`
        ];

        additionalInfo.forEach((info, i) => {
          svg.append('text')
            .attr('class', 'additional-text')
            .attr('x', x + 25) // Adjust x position to be inside the box
            .attr('y', y - 23 + (i * 12)) // Adjust y position for each line
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

  }, [data, type]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;

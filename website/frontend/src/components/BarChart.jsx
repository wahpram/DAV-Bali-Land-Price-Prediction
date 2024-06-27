import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './BarChart.css';

const parseDashboardData = (data) => {
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

const parsePricePredictionData = (data) => {
  return data.map(item => ({
    name: item.regency,
    value: parseFloat(item.average_price_per_m2.replace(/[Rp.]/g, ''))
  }));
};

const BarChart = ({ data, type }) => {
  const svgRef = useRef();

  useEffect(() => {
    const parsedData = type === 'prediction' ? parseDashboardData(data) : parsePricePredictionData(data);
    console.log(parsedData)
    const svg = d3.select(svgRef.current)
      .attr('width', 1200)
      .attr('height', 400)
      .style('margin-top', '50px')
      .style('margin-bottom', '50px')
      .style('overflow', 'visible');

    const xScale = d3.scaleBand()
      .domain(parsedData.map(d => d.name))
      .range([0, 1200])
      .padding(0.5);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(parsedData, d => d.value)])
      .range([400, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg.selectAll('*').remove(); // Clear previous renders

    svg.append('g')
      .attr('class', 'x-axis')
      .call(xAxis)
      .attr('transform', 'translate(0, 400)');

    svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    svg.selectAll('.bar')
      .data(parsedData)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.name))
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => 400 - yScale(d.value))
      .attr('fill', '#3ad3ce')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('fill', '#a6dfdd');
      })
      .on('mouseleave', function (event, d) {
        d3.select(this).attr('fill', '#3ad3ce');
      });
  }, [data, type]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;

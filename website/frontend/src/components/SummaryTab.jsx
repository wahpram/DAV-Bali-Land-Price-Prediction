import React from 'react';
import './SummaryTab.css';

const SummaryTab = ({subdistrict, regency, price}) => {
    return (
      <div className="SummaryTab-box">
        <div className='SummaryTab-table-1'>
          <a>{subdistrict}</a>
        </div>
        <div className='SummaryTab-table-2'>
            <a>{regency}</a>
        </div>
        <div className='SummaryTab-table-3'>
            <a>{price}</a>
        </div>
      </div>
      
    );
  };

export default SummaryTab;
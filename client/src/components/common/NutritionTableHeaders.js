import React from 'react';

const NutritionTableHeaders = (props) => {
  return (
    <thead>
      <tr>
        {props.headers.map((header) =>
          <th key={header} scope="col">{header}</th>
        )}
      </tr>
    </thead>
  )
};

export default NutritionTableHeaders

import React from 'react';

const NutritionTableRow = (props) => {
    const foodItem= props.foodItem;
    const headers = props.headers;
    
    return (
      <tr>
        {headers.map((header) =>
          <td key={foodItem.name + "-" + header}>
            {typeof foodItem[header] === "number" ? Math.round(foodItem[header]*10)/10 : foodItem[header]}
          </td>
        )}
      </tr>
    )
};

export default NutritionTableRow

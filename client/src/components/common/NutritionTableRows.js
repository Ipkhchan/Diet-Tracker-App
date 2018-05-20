import React from 'react';
import NutritionTableRow from './NutritionTableRow'
import NutritionTableTotals from './NutritionTableTotals'

const NutritionTableRows = (props) => {
  const nutritionData = props.nutritionData;
  return (
    <tbody>
      {nutritionData.map((foodItem) =>
        <NutritionTableRow key={foodItem.name} foodItem={foodItem} headers={props.headers}/>
      )}
      <NutritionTableTotals className="itemTableTotals" headers={props.headers} dietTotals = {props.dietTotals}/>
    </tbody>
  )
};

export default NutritionTableRows

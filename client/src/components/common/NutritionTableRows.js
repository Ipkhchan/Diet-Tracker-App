import React from 'react';
import NutritionTableRow from './NutritionTableRow'
import NutritionTableTotals from './NutritionTableTotals'

const NutritionTableRows = (props) => {
  const nutritionData = props.nutritionData;
  const headers = props.headers;
  const dietTotals =props.dietTotals

  return (
    <tbody>
      {nutritionData.map((foodItem) =>
        <NutritionTableRow key={foodItem.name} foodItem={foodItem} headers={headers}/>
      )}
      <NutritionTableTotals className="itemTableTotals" headers={headers} dietTotals = {dietTotals}/>
    </tbody>
  )
};

export default NutritionTableRows

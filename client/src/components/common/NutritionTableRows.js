import React from 'react';
import NutritionTableRow from './NutritionTableRow'
import NutritionTableTotals from './NutritionTableTotals'

const NutritionTableRows = (props) => {
  const nutritionData = props.nutritionData;
  return (
    <tbody>
      {Object.keys(nutritionData).map((foodItem) =>
        <NutritionTableRow key={nutritionData[foodItem].name} foodItem={nutritionData[foodItem]} headers={props.headers}/>
      )}
      <NutritionTableTotals className="itemTableTotals" nutritionData = {nutritionData} headers={props.headers} dietTotals = {props.dietTotals}/>
    </tbody>
  )
};

export default NutritionTableRows

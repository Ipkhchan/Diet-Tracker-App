import React from 'react';

//TODO: undo button to bring back "removed" item
const SelectedItemsList = (props) => {
  const nutritionData = props.nutritionData;
  return (
    <ul>
      {nutritionData.map((foodItem) =>
        <li key={foodItem.name} className = "foodItem flex">
          {foodItem.name}
          <div className = "flex edits" data-fooditem = {foodItem.name}  onChange = {props.handleNutritionDataChange}>
            <input type="number" value={foodItem.quantity} min="1" className="itemQuantity"></input>
            <p>units or</p>
            <input type="number" value={foodItem.amount} min="1" className="itemWeight"></input>
            <p>grams</p>
            <button type="button" className="removeItem" onClick = {props.handleNutritionDataChange}>X</button>
          </div>
        </li>
      )}
    </ul>
  )
}

export default SelectedItemsList

import React from 'react';

//TODO: make it so that when you change itemQuanity, itemWeight also updates, and vice versa
const SelectedItemsList = (props) => {
  const nutritionData = props.nutritionData;
  return (
    <ul>
      {Object.keys(nutritionData).map((foodItem) =>
        <li key={"select" + foodItem} className = "foodItem flex">
          {nutritionData[foodItem].name}
          <div className = "flex edits" data-fooditem = {foodItem}  onChange = {props.handleNutritionDataChange}>
            <input type="number" value={nutritionData[foodItem].quantity} min="1" className="itemQuantity"></input>
            <p>units or</p>
            <input type="number" value={nutritionData[foodItem].amount} min="1" className="itemWeight"></input>
            <p>grams</p>
            <button type="button" className="removeItem" onClick = {props.handleNutritionDataChange}>X</button>
          </div>
        </li>
      )}
    </ul>
  )
}

export default SelectedItemsList

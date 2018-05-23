import React from 'react';

//TODO: undo button to bring back "removed" item
const SelectedItemsList = (props) => {
  const nutritionData = props.nutritionData;
  return (
    <div>
      <p className="font-weight-bold">Selected Items: </p>
      <ul className="list-group">
        {nutritionData.map((foodItem) =>
          <li key={foodItem.name} className = "foodItem list-group-item d-flex justify-content-between py-3">
            <p className="col-2 my-0 vcenter">{foodItem.name}</p>
            <div className = "col-6 d-flex justify-content-end  align-items-center edits px-0"
                 onChange = {props.handleNutritionDataChange}>
              <div className="input-group">
                <input type="number"
                       value={Math.round(foodItem.quantity*10)/10}
                       min="1" className="form-control"
                       id="itemQuantity"
                       data-fooditem={foodItem.name}></input>
                <div className="input-group-append">
                  <span className="input-group-text">units</span>
                </div>
              </div>
              <p className= "my-0 mx-2">or</p>
              <div className="input-group">
                <input type="number"
                       value={Math.round(foodItem.amount*10)/10}
                       min="1" className="form-control"
                       id="itemWeight"
                       data-fooditem={foodItem.name}/>
                <div className="input-group-append">
                  <span className="input-group-text">grams</span>
                </div>
              </div>
              <button className= "btn-sm btn-outline-danger ml-3" id="removeItem"
                      type="button"
                      onClick = {props.handleNutritionDataChange}
                      data-fooditem={foodItem.name}>X</button>
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}

export default SelectedItemsList

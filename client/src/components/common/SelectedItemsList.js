import React from 'react';

//TODO: undo button to bring back "removed" item
const SelectedItemsList = (props) => {
  const nutritionData = props.nutritionData;
  return (
    <div>
      <p className="font-weight-bold">Selected Items: </p>
      <ul className="list-group">
        {nutritionData.map((foodItem) =>
          <li key={foodItem.name} className = "foodItem list-group-item d-flex flex-column flex-md-row justify-content-between mx-0 py-3">
            <p className="col-xs-12 col-md-4 my-2 px-0 vcenter">{foodItem.name}</p>
            <div className = "col-xs-12 col-md-8 d-flex flex-column flex-sm-row justify-content-end  align-items-center edits px-0 mx-0"
                 style = {{"overflowX": "auto"}}
                 onChange = {props.handleNutritionDataChange}>
              <div className="input-group">
                <input type="number"
                       value={Math.round(foodItem.quantity*10)/10}
                       min="1"
                       className="form-control"
                       id="itemQuantity"
                       data-fooditem={foodItem.name}></input>
                <div className="input-group-append">
                  <span className="input-group-text">units</span>
                </div>
              </div>
              <p className= "my-2 my-sm-0 mx-2 ">or</p>
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
              <button className= "btn-sm btn-danger ml-0 ml-sm-2 mt-2 mt-sm-0" id="removeItem"
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

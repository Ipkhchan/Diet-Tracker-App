import React from 'react'
import dietTracker from '../../dietTracker.js'

const DietMetricBreakdown = (props) => {
  const nutritionData = props.nutritionData;
  const metric = props.metric;

  return (
    <div  className= "centered-popup card"
          style = {{"z-index": "1",
                    "background": "white"}}>
      <div className = "card-body">
        {nutritionData.map((foodItem) =>
          <p key={foodItem.name}>{foodItem.name} : {Math.round(foodItem[metric]) || 0} {dietTracker.nutrientUnits[metric]}</p>
        )}
      </div>
    </div>
  )
}

export default DietMetricBreakdown

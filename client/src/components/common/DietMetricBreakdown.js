import React from 'react'

const DietMetricBreakdown = (props) => {
  const nutritionData = props.nutritionData;
  const metric = props.metric;

  return (
    <div style = {{position: "fixed",
                  width: "25%",
                  top: "50%",
                  left: "37.5%",
                  background: "white"}}>
      {nutritionData.map((foodItem) =>
        <p key={foodItem.name}>{foodItem.name} : {Math.round(foodItem[metric]) || 0}</p>
      )}
    </div>
  )
}

export default DietMetricBreakdown

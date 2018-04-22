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
      {Object.keys(nutritionData).map((foodItem) =>
        <p key={foodItem}>{foodItem} : {Math.round(nutritionData[foodItem][metric]) || 0}</p>
      )}
    </div>
  )
}

export default DietMetricBreakdown

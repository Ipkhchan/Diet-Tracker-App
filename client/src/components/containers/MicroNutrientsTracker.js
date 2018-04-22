import React, {Component} from 'react';
import MicroNutrientTracker from "./MicroNutrientTracker"

class MicroNutrientsTracker extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const dietTotals = this.props.dietTotals;
    const nutritionData = this.props.nutritionData;
    // Object.keys(dietTotals).map((dietTotal) => {
    //   console.log(dietTotals[dietTotal);
    // })
    console.log("nData", this.props.nutritionData);

    return (
      <div>
        <p>MICRONUTRIENTS</p>
        {Object.keys(dietTotals).map((dietTotal) =>
          <MicroNutrientTracker key = {dietTotal}
                                dietTotals = {dietTotals}
                                dietTotal = {dietTotal}
                                nutritionData = {nutritionData}
          />
        )}
      </div>
    )
  }
}



export default MicroNutrientsTracker

import React, {Component} from 'react';
import MicroNutrientTracker from "./MicroNutrientTracker"

class MicroNutrientsTracker extends Component {
  constructor(props) {
    super(props);
    this.toggleMicronutrientDisplay = this.toggleMicronutrientDisplay.bind(this);
    this.state = {listIsShowing: false};
  }

  toggleMicronutrientDisplay() {
    (this.state.listIsShowing) ? this.setState({listIsShowing: false}) : this.setState({listIsShowing: true});
  }

  render() {
    const dietTotals = this.props.dietTotals;
    const nutritionData = this.props.nutritionData;
    const listIsShowing = this.state.listIsShowing;
    // Object.keys(dietTotals).map((dietTotal) => {
    //   console.log(dietTotals[dietTotal);
    // })
    console.log("nData", this.props.nutritionData);

    return (
      <div>
        <div className= "flex-space-between">
          <p>MICRONUTRIENTS</p>
          <button onClick= {this.toggleMicronutrientDisplay}>
            {(listIsShowing) ? "-" : "+"}
          </button>
        </div>
        {(listIsShowing)
          ?Object.keys(dietTotals).map((dietTotal) =>
            <MicroNutrientTracker key = {dietTotal}
                                  dietTotals = {dietTotals}
                                  dietTotal = {dietTotal}
                                  nutritionData = {nutritionData}
            />
          )
          :null
        }
      </div>
    )
  }
}



export default MicroNutrientsTracker

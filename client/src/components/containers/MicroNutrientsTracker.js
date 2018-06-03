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

    return (
      <div className="card mb-4">
        <div className="card-body">
          <div className= "flex-space-between">
            <p className="vcenter">MICRONUTRIENTS</p>
            <button onClick= {this.toggleMicronutrientDisplay}
                    className= "btn btn-success">
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
      </div>
    )
  }
}



export default MicroNutrientsTracker

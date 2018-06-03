import React, {Component} from 'react';
// import MicroNutrientTracker from "./MicroNutrientTracker"

class MacroNutrientsTracker extends Component {
  constructor(props) {
    super(props);
    this.toggleMacronutrientDisplay = this.toggleMacronutrientDisplay.bind(this);
    this.state = {listIsShowing: false};
  }

  toggleMacronutrientDisplay() {
    (this.state.listIsShowing) ? this.setState({listIsShowing: false}) : this.setState({listIsShowing: true});
  }

  render() {
    const dietTotals = this.props.dietTotals;
    const listIsShowing = this.state.listIsShowing;
    const macronutrients = [{name: "carbohydrate", calPerGram: 4},
                            {name: "protein", calPerGram: 4},
                            {name: "fat", calPerGram: 9}];

    return (
      <div className="card my-3">
        <div className="card-body">
          <div className= "flex-space-between">
            <p className="vcenter">MACRONUTRIENTS</p>
            <button onClick= {this.toggleMacronutrientDisplay}
                    className= "btn btn-success">
              {(listIsShowing) ? "-" : "+"}
            </button>
          </div>
          {(listIsShowing)
            ?<div>
              {macronutrients.map((macronutrient) =>
                <div key={macronutrient.name} className= "card my-2">
                  <div className = "card-body">
                    <p className ="card-title font-weight-bold">{macronutrient.name}</p>
                    <p className="card-text">
                      Total:
                      &nbsp;
                      {Math.round(dietTotals[macronutrient.name].dietAmount)}g
                    </p>
                    <p>
                      {Math.round(
                        [(dietTotals[macronutrient.name].dietAmount)*
                        (macronutrient.calPerGram)/
                        dietTotals.calorie.dietAmount]*
                        100)
                      }% of total calories
                    </p>
                  </div>
                </div>
              )}
            </div>
            :null
          }
        </div>
      </div>
    )
  }
}



export default MacroNutrientsTracker

import React, { Component } from 'react';
import NutritionTableHeaders from '../common/NutritionTableHeaders'
import NutritionTableRows from '../common/NutritionTableRows'
import MetricsFooter from './MetricsFooter'

class NutritionTable extends Component {
  constructor(props) {
    super(props);
    this.state = {headers: ["name","amount", "carbohydrate", "fat", "protein", "calorie",]}
  }

  render() {
    const nutritionData = this.props.nutritionData;
    const dietTotals = this.props.dietTotals;
    // for (const foodItem in nutritionData) {
    //     var headers = Object.keys(nutritionData[foodItem]);
    //     break;
    // }
    return (
      <table>
        <caption>MACRONUTRIENTS</caption>
        <NutritionTableHeaders className="itemTableHeaders"  headers={this.state.headers}/>
        <NutritionTableRows className="itemTableRows" nutritionData={nutritionData}
                                                      headers={this.state.headers}
                                                      dietTotals = {dietTotals}
        />
        <MetricsFooter headers={this.state.headers}
                       metrics = {this.props.metrics}
        />
      </table>
    )
  }
};

export default NutritionTable

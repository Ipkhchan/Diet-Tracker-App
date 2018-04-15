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
    // for (const foodItem in nutritionData) {
    //     var headers = Object.keys(nutritionData[foodItem]);
    //     break;
    // }
    return (
      <table>
        <NutritionTableHeaders className="itemTableHeaders"  headers={this.state.headers}/>
        <NutritionTableRows className="itemTableRows" nutritionData={nutritionData} headers={this.state.headers} dietTotals = {this.props.dietTotals}/>
        <MetricsFooter headers={this.state.headers} dietTotals = {this.props.dietTotals}/>
      </table>
    )
  }
};

export default NutritionTable

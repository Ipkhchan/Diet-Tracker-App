import React, {Component} from 'react';
// import FoodRecommendationsList from '../common/FoodRecommendationsList'
import DeficiencyItem from './DeficiencyItem'

class DeficiencyList extends Component {
  render() {
    const dietTotals = this.props.dietTotals;
    console.log("dietTotals", dietTotals);
    const deficiencyList = {};
    for (let metric in dietTotals) {
      if (dietTotals[metric].dietAmount < dietTotals[metric].rdi) {
         deficiencyList[metric] = dietTotals[metric];
      }
    }
    return (
      <div>
        {Object.keys(deficiencyList).map(deficiency =>
          <DeficiencyItem key={deficiency}
                          deficiency={deficiency}
                          deficiencyList = {deficiencyList}/>

        )}
      </div>
    )
  }
}

export default DeficiencyList

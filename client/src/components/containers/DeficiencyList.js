import React, {Component} from 'react';
import $ from 'jquery';
// import FoodRecommendationsList from '../common/FoodRecommendationsList'
import DeficiencyItem from './DeficiencyItem'

class DeficiencyList extends Component {
  constructor(props) {
    super(props);
    // this.handleNutritiousFoodSearch = this.handleNutritiousFoodSearch.bind(this);
    // this.state = {nutritiousFoods: {}}
    // this.toggleFoodList = this.toggleFoodList.bind(this);
    // this.state = {recommendedFoodsDisplayStatus: {}}
  }

  // componentDidMount()

  // componentDidUpdate() {
  //   const recommendedFoodsDisplayStatus = {};
  //   for (let deficiency in this.props.deficiencyList) {
  //     recommendedFoodsDisplayStatus[deficiency] = false;
  //   }
  //   this.setState({recommendedFoodsDisplayStatus: recommendedFoodsDisplayStatus});
  // }
  // //
  // // trackFoodListDisplayStatus() {
  // //
  // // }
  //
  // toggleFoodList(deficiency) {
  //   this.state.recommendedFoodsDisplayStatus[deficiency] = !this.state.recommendedFoodsDisplayStatus;
  //   // this.forceUpdate();
  // }



  // handleNutritiousFoodSearch(e) {
  //   console.log(e.target.className);
  //   $.ajax({
  //     url: 'http://localhost:5000/users/nutrients/' + e.target.className,
  //     method:'GET',
  //     dataType:'JSON'
  //   }).then(function(res) {
  //     console.log(res);
  //   });
  //
  // }

  render() {
    const deficiencyList = this.props.deficiencyList;
    // const foodRecommendations = this.props.foodRecommendations;
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
                          // foodRecommendations = {foodRecommendations[deficiency]}/>

export default DeficiencyList

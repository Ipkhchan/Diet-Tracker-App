import React, {Component} from 'react';

class FoodRecommendationsList extends Component {
  constructor(props) {
    super(props);
    this.handleListDisplay = this.handleListDisplay.bind(this);
    this.state = {foodSubListIndexStart: 0}
  }

  handleListDisplay(e) {
    const prevNext = e.target.textContent;
    const foodSubListIndexStart = this.state.foodSubListIndexStart;
    if (prevNext === "Next" && foodSubListIndexStart < 15) {
      this.setState({foodSubListIndexStart: foodSubListIndexStart + 5})
    }
    else if (prevNext === "Prev" && foodSubListIndexStart > 0) {
      this.setState({foodSubListIndexStart: foodSubListIndexStart - 5})
    }
  }

  render () {
    const foodRecommendations = this.props.foodRecommendations;
    const foodSubListIndexStart = this.state.foodSubListIndexStart;
    const dietTotal = this.props.dietTotal;
    const metric = this.props.metric;
    const isDeficient = dietTotal.dietAmount/dietTotal.rdi < 1 ? true : false ;

    return (
      <div>
        {foodRecommendations.slice(foodSubListIndexStart,foodSubListIndexStart + 5)
                            .map(foodRecommendation =>
          <div key={foodRecommendation.name}>
            <p>{foodRecommendation.name}</p>
            <p>{foodRecommendation[metric] +" per 100g"}</p>
            {(isDeficient)
            ?<p>{"Take " + Math.round(100*(100* ((dietTotal.rdi-dietTotal.dietAmount)/foodRecommendation[metric])))/100 +
                " grams to meet your RDI"}</p>
            :null
            }
          </div>
        )}
        <button onClick = {this.handleListDisplay}>Prev</button>
        <button onClick = {this.handleListDisplay}>Next</button>
      </div>
    )
  }
}

// <p>{Math.round(100*(100* ((deficiencyAmount.rdi-deficiencyAmount.dietAmount)/foodRecommendation[deficiency])))/100 +
//     " grams"}</p>


export default FoodRecommendationsList

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
    if (prevNext == "Next" && foodSubListIndexStart < 15) {
      this.setState({foodSubListIndexStart: foodSubListIndexStart + 5})
    }
    else if (prevNext == "Prev" && foodSubListIndexStart > 0) {
      this.setState({foodSubListIndexStart: foodSubListIndexStart - 5})
    }
  }

  render () {
    const foodRecommendations = this.props.foodRecommendations;
    const foodSubListIndexStart = this.state.foodSubListIndexStart;
    return (
      <div>
        {foodRecommendations.slice(foodSubListIndexStart,foodSubListIndexStart + 5).
                             map(foodRecommendation =>
          <p key={foodRecommendation.name}>{foodRecommendation.name}</p>
        )}
        <button onClick = {this.handleListDisplay}>Prev</button>
        <button onClick = {this.handleListDisplay}>Next</button>
      </div>
    )
  }
}


export default FoodRecommendationsList

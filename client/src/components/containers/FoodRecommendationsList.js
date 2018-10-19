import React, {Component} from 'react';
import dietTracker from '../../dietTracker.js'

class FoodRecommendationsList extends Component {
  constructor(props) {
    super(props);
    this.state = {foodSubListIndexStart: 0}
  }

  //handle pagination of food recommendations (5 per page)
  handleListDisplay = (e) => {
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
      <div className="card">
        <div className="card-body">
          <div className="list-group">
            {foodRecommendations.slice(foodSubListIndexStart,foodSubListIndexStart + 5)
                                .map(foodRecommendation =>
              <div className= "list-group-item p-0" key={foodRecommendation.name}>
                <div className="row justify-content-between my-3 mx-1">
                  <p className="my-0 col-12 col-md-6">{foodRecommendation.name}</p>
                  <p className="my-0 col-12 col-md-6 text-md-right">{Math.round(10*(foodRecommendation[metric]))/10} {dietTracker.nutrientUnits[metric]}  per  {foodRecommendation.amount} g</p>
                </div>
                <div>
                  {(isDeficient)
                  ?<p className="my-0">{"Take " + Math.round(100*(100* ((dietTotal.rdi-dietTotal.dietAmount)/foodRecommendation[metric])))/100 +
                      " grams to meet your RDI"}</p>
                  :null
                  }
                </div>
              </div>
            )}
          </div>
          <div className="my-3 d-flex justify-content-end">
            <button onClick = {this.handleListDisplay} className= "btn-sm btn-primary mx-3">Prev</button>
            <button onClick = {this.handleListDisplay} className= "btn-sm btn-primary">Next</button>
          </div>
        </div>
      </div>
    )
  }
}

export default FoodRecommendationsList

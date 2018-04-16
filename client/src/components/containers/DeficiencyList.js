import React, {Component} from 'react';
import $ from 'jquery';

class DeficiencyList extends Component {
  constructor(props) {
    super(props);
    // this.handleNutritiousFoodSearch = this.handleNutritiousFoodSearch.bind(this);
    // this.state = {nutritiousFoods: {}}
  }

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
    const foodRecommendations = this.props.foodRecommendations;
    return (
      <div>
        {Object.keys(deficiencyList).map(deficiency =>
          <div key={deficiency} className="flex">
            <div>
              <p className= "block">{"You may be deficient in " + deficiency}</p>
              <div className="flex">
                <div>
                  <p>{"your diet amount: " + Math.round(deficiencyList[deficiency].dietAmount*10)/10}</p>
                  <p>{"the RDI is: " + Math.round(deficiencyList[deficiency].rdi*10)/10}</p>
                </div>
                <button className= {deficiency} onClick={this.handleNutritiousFoodSearch}>+</button>
              </div>
            </div>
            <div>
              {foodRecommendations[deficiency].map(foodRecommendation =>
                <p key={foodRecommendation.name}>{foodRecommendation.name}</p>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default DeficiencyList

import React, {Component} from 'react'
import FoodRecommendationsList from './FoodRecommendationsList'
import $ from 'jquery';

class DeficiencyItem extends Component {
  constructor(props) {
    super(props);
    this.toggleFoodList = this.toggleFoodList.bind(this);
    // this.handleNutritiousFoodSearch = this.handleNutritiousFoodSearch.bind(this);
    this.state = {listIsShowing: false,
                  foodRecommendations: [],
                };
  }

  toggleFoodList() {
    (this.state.listIsShowing) ? this.setState({listIsShowing: false}) : this.setState({listIsShowing: true});
  }

  componentDidMount() {
  // handleNutritiousFoodSearch() {
    $.ajax({
      url: 'http://localhost:5000/users/' + this.props.deficiency,
      method:'POST',
      dataType:'JSON',
    }).then((res) => {
      console.log(res);
      this.setState({foodRecommendations: res});
    });
  }

  render() {
    const deficiency = this.props.deficiency;
    const deficiencyList = this.props.deficiencyList;
    const foodRecommendations = this.state.foodRecommendations;
    const listIsShowing = this.state.listIsShowing;
    // const foodSubListIndexStart = this.state.foodSubListIndexStart;
    // const foodRecommendations = this.props.foodRecommendations;
    return (
      <div className="flex">
        <div>
          <p className= "block">{"You may be deficient in " + deficiency}</p>
          <div className="flex">
            <div>
              <p>{"your diet amount: " + Math.round(deficiencyList[deficiency].dietAmount*10)/10}</p>
              <p>{"the RDI is: " + Math.round(deficiencyList[deficiency].rdi*10)/10}</p>
            </div>
            <button className= {deficiency} onClick={this.toggleFoodList}>
              {(listIsShowing) ? "-" : "+"}
            </button>
          </div>
        </div>
        {(listIsShowing)
        ?<FoodRecommendationsList foodRecommendations= {foodRecommendations}
                                  deficiencyAmount= {deficiencyList[deficiency]}
                                  deficiency = {deficiency}/>
        :null
        }
      </div>
    )
  };
}



export default DeficiencyItem

import React, {Component} from 'react';
import $ from 'jquery';
import FoodRecommendationsList from './FoodRecommendationsList';
import DietMetricBreakdown from '../common/DietMetricBreakdown';

class MicroNutrientTracker extends Component {
  constructor(props) {
    super(props)
    this.toggleFoodList = this.toggleFoodList.bind(this);
    this.handleBreakDownDisplay = this.handleBreakDownDisplay.bind(this);
    this.state = {listIsShowing: false,
                  breakDownIsShowing: false,
                  foodRecommendations: []
                };
  }

  componentDidMount() {
  // handleNutritiousFoodSearch() {
    $.ajax({
      url: 'http://localhost:5000/' + this.props.dietTotal,
      headers: {'Authorization': `bearer ${localStorage.getItem('token')}`},
      method:'POST',
      dataType:'JSON',
    }).then((res) => {
      this.setState({foodRecommendations: res});
    });
  }

  toggleFoodList() {
    (this.state.listIsShowing) ? this.setState({listIsShowing: false}) : this.setState({listIsShowing: true});
  }

  handleBreakDownDisplay(e) {
    console.log(e.type);
    // clearTimeout(showBreakdown);
    if(e.type === "mouseover") {
      setTimeout(function() {
        this.setState({breakDownIsShowing: true});
      }.bind(this), 100);
      // this.setState({breakDownIsShowing: true});
      // console.log("done");
    }
    else if (e.type === "mouseleave") {
      setTimeout(function() {
        this.setState({breakDownIsShowing: false});
      }.bind(this), 100);
      // if(showBreakdown) {
      //   clearTimeout(showBreakdown);
      //   showBreakdown = null;
      // }
      // this.setState({breakDownIsShowing: false});
    }
  }

  render() {
    const dietTotal = this.props.dietTotal;
    const dietTotals = this.props.dietTotals;
    const nutritionData = this.props.nutritionData;
    const listIsShowing = this.state.listIsShowing;
    const foodRecommendations = this.state.foodRecommendations;
    const breakDownIsShowing = this.state.breakDownIsShowing;
    const isDeficient = (dietTotals[dietTotal].dietAmount/dietTotals[dietTotal].rdi < 1)
                        ? true
                        : false;

    return (
      <div>
        <div className = "flex-space-between">
          <p>{dietTotal} {' '}
           ({Math.round(dietTotals[dietTotal].dietAmount)}/{Math.round(dietTotals[dietTotal].rdi)}) {' '}
           {(isDeficient) ? String.fromCharCode("0x2718") : String.fromCharCode("0x2714")}
          </p>
          <div>
            <p>Get Suggestions of Foods High in this Nutrient</p>
            <button onClick= {this.toggleFoodList}>
              {(listIsShowing) ? "-" : "+"}
            </button>
          </div>
        </div>
        <div style={{height: 30 + 'px',
                     background: "blue"}}
             onMouseOver = {this.handleBreakDownDisplay}
             onMouseLeave = {this.handleBreakDownDisplay}
        >
          <div style= {{height: "100%",
                        width: `${(isDeficient)
                                  ? ((dietTotals[dietTotal].dietAmount/dietTotals[dietTotal].rdi)*100)
                                  : 100}%`,
                        background: "green"}}
          />
        </div>
        {(listIsShowing)
        ?<FoodRecommendationsList foodRecommendations= {foodRecommendations}
                                  dietTotal = {dietTotals[dietTotal]}
                                  isDeficient = {isDeficient}
                                  metric = {dietTotal}/>
        :null
        }
        {(breakDownIsShowing)
        ?<DietMetricBreakdown nutritionData={nutritionData}
                              metric = {dietTotal}
         />
        : null
        }
      </div>
    )
  }
}

export default MicroNutrientTracker

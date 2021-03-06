import React, {Component} from 'react';
import $ from 'jquery';
import FoodRecommendationsList from './FoodRecommendationsList';
import DietMetricBreakdown from '../common/DietMetricBreakdown';
import dietTracker from '../../dietTracker.js'

class MicroNutrientTracker extends Component {
  constructor(props) {
    super(props)
    this.state = {listIsShowing: false,
                  breakDownIsShowing: false,
                  foodRecommendations: []
                };
  }

  componentDidMount() {
    //get food recommendations
    $.ajax({
      url: this.props.dietTotal,
      headers: {'Authorization': `bearer ${localStorage.getItem('token')}`},
      method:'POST',
      dataType:'JSON',
    }).then((res) => {
      this.setState({foodRecommendations: res});
    });
  }

  toggleFoodList = () => {
    (this.state.listIsShowing) ? this.setState({listIsShowing: false}) : this.setState({listIsShowing: true});
  }

  handleBreakDownDisplay = (e) => {
    console.log(e.type);
    if(e.type === "mouseover") {
      setTimeout(() =>
        this.setState({breakDownIsShowing: true}), 100);
    }
    else if (e.type === "mouseleave") {
      setTimeout(() =>
        this.setState({breakDownIsShowing: false}), 100);
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
      <div className= "card my-3">
        <div className="card-body">
          <div className = "d-flex flex-column flex-md-row mx-0 justify-content-between">
            <p className= "vcenter col-md-5 px-0 font-weight-bold">{dietTotal} {' '}
             ({Math.round(dietTotals[dietTotal].dietAmount)}/{Math.round(dietTotals[dietTotal].rdi)})
              {' '}
              {dietTracker.nutrientUnits[dietTotal]}
              {' '}
             {(isDeficient) ? String.fromCharCode("0x2718") : String.fromCharCode("0x2714")}
            </p>
            <div className= "d-flex col-md-7 px-0 my-2 justify-content-md-end justify-content-between">
              <p className="vcenter">Get Suggestions of Foods High in this Nutrient</p>
              <button onClick= {this.toggleFoodList}
                      className= "btn-sm btn-success ml-3">
                {(listIsShowing) ? "-" : "+"}
              </button>
            </div>
          </div>
          <div className="progress my-3"
               onMouseOver = {this.handleBreakDownDisplay}
               onMouseLeave = {this.handleBreakDownDisplay}>
            <div className= "progress-bar"
                 style= {{height: "100%",
                          width: `${(isDeficient)
                                    ? ((dietTotals[dietTotal].dietAmount/dietTotals[dietTotal].rdi)*100)
                                    : 100}%`,
                          background: "green"}}/>
          </div>
          {(listIsShowing)
          ?<FoodRecommendationsList foodRecommendations= {foodRecommendations}
                                    dietTotal = {dietTotals[dietTotal]}
                                    isDeficient = {isDeficient}
                                    metric = {dietTotal}/>
          :null
          }
        </div>

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

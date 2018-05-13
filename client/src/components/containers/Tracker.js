import React, { Component } from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import dietTracker from '../../api.js'
import SearchBar from './SearchBar'
import RDISetSelector from './RDISetSelector'
import ResultsList from '../common/ResultsList'
import SelectedItemsList from '../common/SelectedItemsList'
import NutritionTable from './NutritionTable'
import MicroNutrientsTracker from './MicroNutrientsTracker'
import FattyAcidTracker from './FattyAcidTracker'
import MacroNutrientsTracker from './MacroNutrientsTracker'
import DietNamePopup from '../common/DietNamePopup'

class Tracker extends Component {
  constructor(props) {
    super(props);
    this.handleNutritionDataChange = this.handleNutritionDataChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.saveDietData = this.saveDietData.bind(this);
    this.analyzeDiet = this.analyzeDiet.bind(this);
    this.sumDietTotals = this.sumDietTotals.bind(this);
    this.getRDISet = this.getRDISet.bind(this);
    this.promptDietName = this.promptDietName.bind(this);
    this.submitDietName = this.submitDietName.bind(this);
    // this.toggleDeficiencyList = this.toggleDeficiencyList.bind(this);
    // this.handleNutritiousFoodSearch = this.handleNutritiousFoodSearch.bind(this);
    this.state = {nutritionData: {},
                  searchResults: [],
                  dietTotals: {},
                  metrics:{},
                  showDietNamePopup: false
                  // deficiencyListIsShowing:false
                };
  }

  //TODO: micronutrient units some don't match up. might have to adjust schema to include units



  //TODO: use generators to yield promise control to componentDidMount.
  //reorganize code in componentDidMount so code is easy to follow here.
  componentDidMount() {
    //TODO: Axios
    //TODO: can send multiple ajax calls in parallel?
    console.log("token", localStorage.getItem('token'));
    $.ajax({
      url: 'http://localhost:5000/users/',
      headers: {
        "Authorization": `bearer ${localStorage.getItem('token')}`,
      },
      method:'GET',
      dataType:'JSON'
    }).then((res) => {
      // console.log(res.headers);
      res.forEach(function(foodItem) {
        dietTracker.nutrientTracker[foodItem.name] = foodItem;
      })
    }).then(() => {
      this.getRDISet();
    });
    //getFoodData  (p)
    //get_RDISet (p)
    //after (p) set state for nutritionData and RDISet, or at least need to pass both
    //to sumDietTotals
    //sumDietTotals (need dietTracker from getFoodData call, need metrics from get_RDISet)
    //set state for nutritionData, rdiset, and dietTotals, if haven't done yet.
  }

  //this handles changing the nutrition values based on the food quantity that
  //the user inputs
  handleNutritionDataChange(e) {
    const foodItem = e.target.parentNode.dataset.fooditem;
    const nutritionData = this.state.nutritionData;
    const itemData = nutritionData[foodItem];
    const className = e.target.classList.value;


    switch (className) {
      case "removeItem":
        delete nutritionData[foodItem];
        break;
      case "itemQuantity":
        const quantityRatio = e.target.value/itemData.quantity;
        for (const category in itemData) {
          if (typeof itemData[category] === "number") {
            itemData[category] *= quantityRatio;
          }
        }
        break;
      case "itemWeight":
        const weightRatio = e.target.value/itemData.amount;
        if (e.target.value > 0) {
          for (const category in itemData) {
            if (typeof itemData[category] === "number") {
              itemData[category] *= weightRatio;
            }
          }
        }
        break;
      default:
        break;
    }
    const [dietTotals, deficiencyList]= this.analyzeDiet();
    // const dietTotals = this.sumDietTotals(nutritionData);
    this.setState({nutritionData: nutritionData,
                   dietTotals: dietTotals,
                   deficiencyList: deficiencyList});
  }

  //TODO: USE PROMISE HERE
  handleSearch(e) {
    dietTracker.getItem(document.querySelector(".search").value)
    setTimeout(function() {
      this.setState({searchResults: dietTracker.searchResults})
      console.log(this.state.searchResults)
    }.bind(this), 1000);

    // console.log(results);

    //TODO: is setting an input value this way a React no-no?
    document.querySelector(".search").value = "";
  }

  handleSelectItem(e) {
    const foodName = e.target.textContent
    dietTracker.getNutrients(foodName);
    setTimeout(function() {
      const dietTotals = this.sumDietTotals(dietTracker.nutrientTracker);
      this.setState({nutritionData: dietTracker.nutrientTracker, dietTotals: dietTotals})
    }.bind(this), 1000);

  }

  saveDietData(e, dietName) {
    console.log("saving ", dietTracker.nutrientTracker);
    console.log(dietName);
    $.ajax({
      url: 'http://localhost:5000/users/',
      headers: {'Authorization': `bearer ${localStorage.getItem('token')}`},
      method:'POST',
      dataType:'text',
      processData: 'false',
      data: {"name": dietName, "items": dietTracker.nutrientTracker}
    }).then(function(res) {
      alert(res);
    });
  }

  promptDietName() {
    if (Object.keys(dietTracker.nutrientTracker).length) {
      this.setState({showDietNamePopup: true})
    }
    else return;
  }

  submitDietName() {
    const dietName = document.querySelector("#dietName").value;
    this.saveDietData(null, dietName);
  }

  //TODO: fix form submittal handling to be cleaner

  sumDietTotals(nutritionData) {
    const totals = {};
    const foodItems = Object.keys(nutritionData);
    const metrics =this.state.metrics;

    this.props.metrics.forEach(metric => {
      if(["age_min", "age_max", "sex", "source"].indexOf(metric) < 0) {
        // for each header, if the attribute (ex. protein, carb) represents
        //numerical data, loop through all the foodItems in the selected List
        //and sum all values for that attribute
        totals[metric] = {dietAmount: 0, rdi: metrics[metric]};
        foodItems.map(function(foodItem) {
          //ignore foodItems that don't have that attribute defined or are 0.
          if(nutritionData[foodItem][metric]) {
            totals[metric].dietAmount += nutritionData[foodItem][metric];
          }
          return foodItem;
        });
      }
    });
    return totals;
  }

  analyzeDiet() {
    //compare RDI values and total values
    const dietTotals = this.sumDietTotals(this.state.nutritionData);
    let deficiencyList = {};
    for (let dietTotal in dietTotals) {
      if (dietTotals[dietTotal] < this.state.metrics[dietTotal]) {
        deficiencyList[dietTotal] = {dietAmount: dietTotals[dietTotal], rdi: this.state.metrics[dietTotal]};
      }
    };
    return [dietTotals,deficiencyList];
    // this.setState({deficiencyList: deficiencyList});
    // this.handleNutritiousFoodSearch(deficiencyList);
  }

 //TODO: package ajax call into 1 function since getRDISet and ComponentDidMount both
 //use this ajax call
  getRDISet(e) {
    let sex = {value: "default"};
    let age = {value: "default"};

    if(e) {
      e.preventDefault();
      [sex, age] = $('.userRDIForm').serializeArray();
      console.log(sex, age);
    }

    $.ajax({
      url: 'http://localhost:5000/users/metrics/' + sex.value +'/' + age.value,
      headers: {'Authorization': `bearer ${localStorage.getItem('token')}`},
      method:'GET',
      dataType:'JSON'
    }).then((res) => {
      this.setState({metrics: res});
    }).then(() => {
      const dietTotals = this.sumDietTotals(dietTracker.nutrientTracker);
      this.setState({nutritionData: dietTracker.nutrientTracker, dietTotals: dietTotals});
    })
  }

  render() {
    console.log("Tracker//redux", this.props.isLoggedIn);

    return (
      <div>
        <SearchBar className="searchBar" handleSearch={this.handleSearch}/>
        <RDISetSelector getRDISet={this.getRDISet}/>
        <ResultsList searchResults={this.state.searchResults || []}
                     handleSelectItem={this.handleSelectItem}
        />
        {(Object.keys(this.state.nutritionData).length)
          ? <div>
              <SelectedItemsList className="selectedItemsList"
                                 nutritionData={this.state.nutritionData}
                                 handleNutritionDataChange={this.handleNutritionDataChange}
              />
              {(this.props.isLoggedIn)
                ?<button onClick= {this.promptDietName}
                        style= {{float: "right"}}>
                   Save
                 </button>
                :<p>Log In or Sign Up to save your diet!</p>
              }
              {(this.state.showDietNamePopup)
                ? <DietNamePopup submitDietName = {this.submitDietName}/>
                : null
              }
              <NutritionTable className="table itemTable" nutritionData={this.state.nutritionData}
                                                          dietTotals={this.state.dietTotals}
                                                          metrics={this.state.metrics}
              />
              <FattyAcidTracker nutritionData={this.state.nutritionData}/>
              <MacroNutrientsTracker dietTotals={this.state.dietTotals}/>
              <MicroNutrientsTracker nutritionData={this.state.nutritionData}
                                    dietTotals={this.state.dietTotals}
              />
            </div>
          : null
        }

      </div>
    )
  };
}

const mapStateToProps = (state) => ({
    isLoggedIn: state.isLoggedIn
});

export default connect(mapStateToProps)(Tracker);

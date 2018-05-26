//TODO: tailor the save popup to the case. If current DietName exists, then ask
// if user wants to save that dietname. If not, then prompt the user for a dietName.
//tweak save function to allow for both options above.
//TODO: header should be fixed positioning (always visible);
//TODO: user should be able to get food suggestions even when logged out.
//TODO: keep diet name and items packaged together

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
    this.deleteDietData = this.deleteDietData.bind(this);
    this.analyzeDiet = this.analyzeDiet.bind(this);
    this.sumDietTotals = this.sumDietTotals.bind(this);
    this.getRDISet = this.getRDISet.bind(this);
    this.promptDietName = this.promptDietName.bind(this);
    this.submitDietName = this.submitDietName.bind(this);
    this.dietSelect = this.dietSelect.bind(this);
    this.toggleShowRDISetForm = this.toggleShowRDISetForm.bind(this);
    // this.toggleDeficiencyList = this.toggleDeficiencyList.bind(this);
    // this.handleNutritiousFoodSearch = this.handleNutritiousFoodSearch.bind(this);
    this.state = {nutritionData: {},
                  searchResults: [],
                  dietTotals: {},
                  dietNames: [],
                  currentDietName: null,
                  metrics:{},
                  showDietNamePopup: false,
                  showRDISetForm: false
                  // deficiencyListIsShowing:false
                };
  }

  //TODO: micronutrient units some don't match up. might have to adjust schema to include units
  componentDidUpdate() {
    console.log("this.state.nutritionData", this.state.nutritionData);
    console.log("this.state.metrics", this.state.metrics);
  }
  //TODO: use generators to yield promise control to componentDidMount.
  //reorganize code in componentDidMount so code is easy to follow here.
  //TODO: don't split up dietName and foodItems. Keep them together, then you don't
  //have to keep  track of currentDietName. This prevents mismatch anomalies and
  //makes the app more robust. will require refactoring props and variables passed around.
  componentDidMount() {
    //TODO: Axios
    //TODO: can send multiple ajax calls in parallel?
    $.ajax({
      url: '/users/',
      headers: {
        "Authorization": `bearer ${localStorage.getItem('token')}`,
      },
      method:'GET',
      dataType:'JSON'
    }).then((res) => {
      dietTracker.nutrientTracker = res.defaultDiet.items;
      //dietName needs to keep track of ID as well
      dietTracker.dietNames = res.dietNames;
      dietTracker.currentDietName = res.dietNames[0];
      //set nutrientTracker as packaged {name: name, items: []}
      //for children that need the items, send them only that part of the props
      //set up redux for dietTracker.nutrientTracker
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
    console.log("handleNutritionDataChange");
    console.log("target", e.target);
    const foodItem = e.target.dataset.fooditem;
    //TODO: Is this considered as altering state directly? If so, need to find another way
    const nutritionItems = this.state.nutritionData.items;
    const targetId = e.target.id;
    console.log("foodItem", foodItem);
    console.log("targetId", targetId);
    let itemData;
    let foodItemIndex;


    nutritionItems.forEach((food) => {
      if(foodItem == food.name) {
        itemData = food;
        foodItemIndex = nutritionItems.indexOf(itemData);
      }
    })

    switch (targetId) {
      case "removeItem":
        delete nutritionItems.splice(foodItemIndex, 1);
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
    this.setState({nutritionData: {"name": this.state.nutritionData.name || null,
                                   "_id": this.state.nutritionData._id || null,
                                   "items": nutritionItems},
                   dietTotals: dietTotals,
                   deficiencyList: deficiencyList});
  }

  //TODO: USE PROMISE HERE
  handleSearch(e) {
    dietTracker.getItem(document.querySelector(".search").value)
    setTimeout(function() {
      this.setState({searchResults: dietTracker.searchResults})
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
      this.setState({nutritionData: {"name": this.state.nutritionData.name || null,
                                     "items": dietTracker.nutrientTracker},
                     dietTotals: dietTotals})
    }.bind(this), 1000);

  }

  saveDietData(dietName) {
    var data = null;
    //if dietName argument is provided, this indicates that we are to save a new diet.
    //override this.state.nutritionData's name and id
    if(dietName) {
      data = {"name": dietName, "items": this.state.nutritionData.items};
    }
    //otherwise, just send our updated existing diet for saving.
    else {
      data = this.state.nutritionData;
    }
    $.ajax({
      url: '/users/save',
      headers: {'Authorization': `bearer ${localStorage.getItem('token')}`},
      method:'POST',
      dataType:'JSON',
      processData: 'false',
      data: data
    }).then((res) => {
      this.setState({dietNames: res.dietNames});
      alert(res.message);
    });
  }

  // {"dietIsNew": dietIsNew, "diet": {"name": dietName, "items": dietTracker.nutrientTracker}}

  deleteDietData() {
    $.ajax({
      url: '/users/' + this.state.nutritionData._id + '/delete',
      headers: {'Authorization': `bearer ${localStorage.getItem('token')}`},
      method:'GET',
      dataType:'JSON',
    }).then((res) => {
      this.setState({dietNames: res.dietNames});
      alert(res.message);
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
    this.setState({showDietNamePopup: false});
    this.saveDietData(dietName);
  }

  //TODO: nutritionData and dietTracker.nutrientTracker are duplicates of the
  //same data. See if you can tweak the app to use just one. No Redundancy.
  dietSelect(e) {
    e.preventDefault();
    const dietName = document.querySelector('.dietSelector').value;
    $.ajax({
      url: '/users/diets/' + dietName,
      headers: {
        "Authorization": `bearer ${localStorage.getItem('token')}`,
      },
      method:'GET',
      dataType:'JSON'
    }).then((res) => {
      dietTracker.nutrientTracker = res.items;
      dietTracker.currentDietName = {"name": res.name, "_id": res._id};
      const dietTotals = this.sumDietTotals(dietTracker.nutrientTracker);
      this.setState({
        nutritionData: res,
        dietTotals: dietTotals,
        currentDietName: res.name
      });
    });

  }

  //TODO: fix form submittal handling to be cleaner

  sumDietTotals(nutritionData) {
    const totals = {};
    // const foodItems = Object.keys(nutritionData);
    // console.log("sumDietTotals//foodItems", foodItems);
    const metrics =this.state.metrics;

    this.props.metrics.forEach(metric => {
      if(["age_min", "age_max", "sex", "source"].indexOf(metric) < 0) {
        // for each header, if the attribute (ex. protein, carb) represents
        //numerical data, loop through all the foodItems in the selected List
        //and sum all values for that attribute
        totals[metric] = {dietAmount: 0, rdi: metrics[metric]};

        // foodItems.map(function(foodItem) {
        //   //ignore foodItems that don't have that attribute defined or are 0.
        //   if(nutritionData[foodItem][metric]) {
        //     totals[metric].dietAmount += nutritionData[foodItem][metric];
        //   }
        //   return foodItem;
        // });

        nutritionData.forEach((foodItem) => {
          if(foodItem[metric]) {
            totals[metric].dietAmount += foodItem[metric];
          }
        })
      }
    });
    return totals;
  }

  analyzeDiet() {
    //compare RDI values and total values
    const dietTotals = this.sumDietTotals(this.state.nutritionData.items);
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
    let path;
    console.log("path initial value", path);
    if (localStorage.getItem('token')) {
      path = "/users/metrics/";
    }
    // let sex = {value: "default"};
    // let age = {value: "default"};
    if(e) {
      e.preventDefault();
      const [sex, age] = $('.userRDIForm').serializeArray();
      path = '/metrics/' + sex.value + '/' + age.value;
      console.log("typeOf Path", typeof path);
    }

    //if user is not logged in and a specific RDI sex/age range has not between
    //requested, ask for a default RDI set.
    else if(path === undefined) {
      path = "/metrics/default/default";
    }
    console.log("path", path);

    $.ajax({
      url: path,
      headers: {'Authorization': `bearer ${localStorage.getItem('token')}`},
      method:'GET',
      dataType:'JSON'
    }).then((res) => {
      this.setState({metrics: res});
    }).then(() => {
      const dietTotals = this.sumDietTotals(dietTracker.nutrientTracker);
      console.log("about to set state");
      console.log("dietTracker.dietNames", dietTracker.dietNames);
      this.setState({nutritionData: {"name": dietTracker.currentDietName.name || null,
                                     "_id": dietTracker.currentDietName._id || null,
                                     "items": dietTracker.nutrientTracker},
                     dietTotals: dietTotals,
                     dietNames: dietTracker.dietNames,
                     currentDietName: dietTracker.currentDietName,
                     showRDISetForm: false
                    });
    })
  }

  toggleShowRDISetForm() {
    this.setState({showRDISetForm: !this.state.showRDISetForm})
  }

  render() {
    return (
      <div className="px-5">
        <SearchBar className="searchBar" handleSearch={this.handleSearch}/>
        <ResultsList searchResults={this.state.searchResults || []}
                     handleSelectItem={this.handleSelectItem}
        />
        <RDISetSelector metrics = {this.state.metrics || {}}
                        toggleShowRDISetForm= {this.toggleShowRDISetForm}
                        showRDISetForm= {this.state.showRDISetForm}
                        getRDISet= {this.getRDISet}/>

        {(this.state.dietNames.length)
          ? <form className="card my-3" onChange={this.dietSelect} onSubmit={this.dietSelect}>
              <div className="card-body">
                <p className= "font-weight-bold">Select your Diet:</p>
                <select className="dietSelector form-control">
                  {this.state.dietNames.map((dietName) =>
                    <option key={dietName._id} value={dietName._id}>{dietName.name}</option>
                  )}
                </select>
                <input type="submit" value="enter" className="btn-sm btn-primary my-3 float-right"/>
              </div>
            </form>
          : null
        }
        {(this.state.nutritionData.items)
          ? <div>
              <div className= "card">
                <div className = "card-body">
                  <SelectedItemsList className="selectedItemsList"
                                     nutritionData={this.state.nutritionData.items}
                                     handleNutritionDataChange={this.handleNutritionDataChange}
                  />
                  {(this.props.isLoggedIn)
                    ?<div className= "d-flex justify-content-end my-3">
                      <button onClick= {(e) => this.saveDietData(null, this.state.currentDietName, false)}
                              className = "btn-sm btn-primary">
                        Save
                      </button>
                      <button onClick= {this.promptDietName}
                              className = "btn-sm btn-primary mx-3">
                        Save as New
                      </button>
                      <button onClick= {this.deleteDietData}
                              className = "btn-sm btn-primary">
                        Delete
                      </button>
                     </div>
                    :<p>Log In or Sign Up to save your diet!</p>
                  }
                </div>
              </div>
                {(this.state.showDietNamePopup)
                  ? <DietNamePopup submitDietName = {this.submitDietName}/>
                  : null
                }
                <div className="card my-3">
                  <div className= "card-body">
                    <h5 className="card-title font-weight-bold">SUMMARY TABLE</h5>
                    <NutritionTable nutritionData={this.state.nutritionData.items}
                                    dietTotals={this.state.dietTotals}
                                    metrics={this.state.metrics}
                    />
                  </div>
                </div>
                <FattyAcidTracker nutritionData={this.state.nutritionData.items}/>
                <MacroNutrientsTracker dietTotals={this.state.dietTotals}/>
                <MicroNutrientsTracker nutritionData={this.state.nutritionData.items}
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

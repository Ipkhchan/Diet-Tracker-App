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
import Alert from "../common/Alert"
import speechRecognition from "../../speechRecognition"

class Tracker extends Component {
  constructor(props) {
    super(props);
    this.handleNutritionDataChange = this.handleNutritionDataChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.handleGetRDISet = this.handleGetRDISet.bind(this);
    this.handleCreateNewDiet = this.handleCreateNewDiet.bind(this);
    this.handleSearchItemNatural = this.handleSearchItemNatural.bind(this);
    this.saveDietData = this.saveDietData.bind(this);
    this.deleteDietData = this.deleteDietData.bind(this);
    this.sumDietTotals = this.sumDietTotals.bind(this);
    this.getRDISet = this.getRDISet.bind(this);
    this.promptDietName = this.promptDietName.bind(this);
    this.submitDietName = this.submitDietName.bind(this);
    this.handleDietSave = this.handleDietSave.bind(this);
    this.handleDietSelect = this.handleDietSelect.bind(this);
    this.toggleShowRDISetForm = this.toggleShowRDISetForm.bind(this);
    this.toggleShowDietNamePopup = this.toggleShowDietNamePopup.bind(this);
    this.handleAlertMessage = this.handleAlertMessage.bind(this);
    this.getUserDiets = this.getUserDiets.bind(this);
    this.handleVoiceSearch = this.handleVoiceSearch.bind(this);
    this.alertMessage = this.alertMessage.bind(this);
    // this.toggleDeficiencyList = this.toggleDeficiencyList.bind(this);
    // this.handleNutritiousFoodSearch = this.handleNutritiousFoodSearch.bind(this);
    this.state = {nutritionData: {"items":[], "name": null},
                  searchResults: [],
                  dietTotals: {},
                  dietNames: [],
                  metrics:{},
                  showDietNamePopup: false,
                  showRDISetForm: false,
                  alertMessage: null,
                  // deficiencyListIsShowing:false
                };
  }

  componentDidUpdate() {
              console.log("metrics", this.state.metrics);
  }
  //TODO: micronutrient units some don't match up. might have to adjust schema to include units
  //TODO: use generators to yield promise control to componentDidMount.
  //reorganize code in componentDidMount so code is easy to follow here.
  //TODO: don't split up dietName and foodItems. Keep them together, then you don't
  //have to keep  track of currentDietName. This prevents mismatch anomalies and
  //makes the app more robust. will require refactoring props and variables passed around.
  componentDidMount() {
    document.querySelector('#search').focus();

    Promise.all([this.getUserDiets(),this.getRDISet()])
      .then(([userDiet, rdiSet]) => {
        if (userDiet.dietNames.length) {
          this.setState({nutritionData: userDiet.defaultDiet,
                         dietTotals: this.sumDietTotals(userDiet.defaultDiet.items, rdiSet),
                         dietNames: userDiet.dietNames,
                         showRDISetForm: false,
                         metrics: rdiSet
                        });
        }
        else {
          this.setState({metrics: rdiSet});
        }
      })
      .catch(function(error) {
      console.log("Error", error);
      })
  }

//**************************START OF INITIALIZATION METHODS*********************

  getUserDiets() {
    return $.ajax({
      url: '/users/',
      headers: {
        "Authorization": `bearer ${localStorage.getItem('token')}`,
      },
      method:'GET',
      dataType:'JSON'
    })
  }

  //TODO: package ajax call into 1 function since getRDISet and ComponentDidMount both
  //use this ajax call
   getRDISet(e) {
     let path;
     if (localStorage.getItem('token')) {
       path = "/users/metrics/";
     }
     // let sex = {value: "default"};
     // let age = {value: "default"};
     if(e) {
       // e.preventDefault();
       const [sex, age] = $('.userRDIForm').serializeArray();
       path = '/metrics/' + sex.value + '/' + age.value;
     }

     //if user is not logged in and a specific RDI sex/age range has not between
     //requested, ask for a default RDI set.
     else if(path === undefined) {
       path = "/metrics/default/default";
     }

     return $.ajax({
       url: path,
       headers: {'Authorization': `bearer ${localStorage.getItem('token')}`},
       method:'GET',
       dataType:'JSON'
     })
   }

//*****************************END OF INITIALIZATION METHODS*******************

//*****************************START OF DIET UTILITY METHODS*******************

   sumDietTotals(nutritionData= this.state.nutritionData.items, metrics = this.state.metrics) {
     const totals = {};
     // const metrics = rdiSet || this.state.metrics;

     this.props.metrics.forEach(metric => {
       //nutritionix API does not track certain metrics that the RDIs from NIH do.
       //for now, these will not be summed, as we have no data. However, we will leave
       //the metric in the RDI in the case that we do get this data.
       if(["age_min", "age_max", "sex", "source", "chromium", "molybdenum",
           "chloride", "biotin", "iodine"].indexOf(metric) < 0) {
         // for each header, if the attribute (ex. protein, carb) represents
         //numerical data, loop through all the foodItems in the selected List
         //and sum all values for that attribute
         totals[metric] = {dietAmount: 0, rdi: metrics[metric]};

         nutritionData.forEach((foodItem) => {
           if(foodItem[metric]) {
             totals[metric].dietAmount += foodItem[metric];
           }
         })
       }
     });
     return totals;
   }

//******************************END OF DIET UTILITY METHODS********************

//******************************START OF USER INPUT HANDLERS*******************

  //this handles changing the nutrition values based on the food quantity that
  //the user inputs
  handleNutritionDataChange(e) {
    const foodItem = e.target.dataset.fooditem;
    //TODO: Is this considered as altering state directly? If so, need to find another way
    const nutritionItems = this.state.nutritionData.items;
    const targetId = e.target.id;
    let itemData;
    let foodItemIndex;


    nutritionItems.forEach((food) => {
      if(foodItem === food.name) {
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
    // const [dietTotals, deficiencyList]= this.analyzeDiet();
    // const dietTotals = this.sumDietTotals(nutritionData);
    this.setState({dietTotals: this.sumDietTotals(),
                   nutritionData: {"name": this.state.nutritionData.name || null,
                                   "_id": this.state.nutritionData._id || null,
                                   "items": nutritionItems}
                   });
  }

  handleSearch(e) {
    Promise.resolve(dietTracker.getItem(document.querySelector(".search").value))
      .then(function(searchResults) {
        this.setState({searchResults: searchResults})
      }.bind(this))
      .catch(function(error) {
        console.log("Error: ", error);
      })

    //TODO: is setting an input value this way a React no-no?
    document.querySelector(".search").value = "";
  }

  handleSearchItemNatural(items = document.querySelector(".search").value) {
    Promise.resolve(dietTracker.getNutrients(items))
      .then((foodData) => {
        console.log("foodData", foodData);
        const existingFoodItemList = this.state.nutritionData.items.map((foodItem) => foodItem.name);
        console.log("existingFoodItemList", existingFoodItemList);
        let clashingFoodItemList = [];
        // const newFoodItemList = foodData.map((foodItem) => foodItem.name);
        foodData = foodData.filter((foodItem) => {
          if (existingFoodItemList.indexOf(foodItem.name) > -1) {
            clashingFoodItemList.push(foodItem.name);
            return false;
          }
          return true;
        })

        let alertMessage = null;

        if (foodData.length && !clashingFoodItemList.length) {
          alertMessage = "Added!";
        }
        else if (!foodData.length && clashingFoodItemList.length) {
          alertMessage = "Items are already in your diet!"
        }
        else if (foodData.length && clashingFoodItemList.length) {
          alertMessage = "Some items added! Others already exist in your diet!"
        }

        let newNutritionData = Object.assign({}, this.state.nutritionData);
        newNutritionData.items = newNutritionData.items.concat(foodData);
        this.setState({nutritionData: newNutritionData,
                       dietTotals: this.sumDietTotals(newNutritionData.items),
                       alertMessage: this.handleAlertMessage(alertMessage)})
      })
      .catch((error) => {
        this.setState({alertMessage: this.handleAlertMessage(error.responseJSON.message)})
      })
    document.querySelector(".search").value = "";
  }

  handleSelectItem(e) {
    const foodName = e.target.textContent;
    const foodItemList = this.state.nutritionData.items.map((foodItem) => foodItem.name);
    if (foodItemList.indexOf(foodName) > -1) {
      this.setState({alertMessage: this.handleAlertMessage("This food is already in your diet!")});
    }
    else {
      Promise.resolve(dietTracker.getNutrients(foodName))
        .then((foodData) => {
          let newNutritionData = Object.assign({}, this.state.nutritionData);
          newNutritionData.items = newNutritionData.items.concat(foodData);
          this.setState({nutritionData: newNutritionData,
                         dietTotals: this.sumDietTotals(newNutritionData.items)})
        })
        .catch(function(error) {
          console.log(error);
        })
    }
    // setTimeout(function() {
    //   const dietTotals = this.sumDietTotals(dietTracker.nutrientTracker);
    //   this.setState({nutritionData: {"name": this.state.nutritionData.name || null,
    //                                  "_id": this.state.nutritionData._id,
    //                                  "items": dietTracker.nutrientTracker},
    //                  dietTotals: dietTotals})
    // }.bind(this), 1000);

  }

  handleVoiceSearch(done) {
      const recordButton = document.querySelector('#recordButton');

      speechRecognition.listen()
        .then(transcript => {
          this.handleSearchItemNatural(transcript);
        })
        .then(() => {
          done();
        })
        .catch(error => {
          console.log(error);
          done();
        })
  }

  handleGetRDISet(e) {
    e.preventDefault();
    Promise.resolve(this.getRDISet(e))
      .then((rdiSet)=> {
        this.setState({metrics: rdiSet, showRDISetForm: false});
      })
      .catch((err)=> {
        console.log(err);
      })
  }



  handleDietSelect(e) {
    e.preventDefault();
    const dietName = document.querySelector('.dietSelector').value;
    $.ajax({
      url: '/users/diets/' + dietName,
      headers: {
        "Authorization": `bearer ${localStorage.getItem('token')}`,
      },
      method:'GET',
      dataType:'JSON'
    }).then((nutritionData) => {
      // dietTracker.nutrientTracker = res.items;
      // dietTracker.currentDietName = {"name": res.name, "_id": res._id};
      // const dietTotals = this.sumDietTotals(nutritionData.items);
      this.setState({
        nutritionData: nutritionData,
        dietTotals: this.sumDietTotals(nutritionData.items),
      });
    });

  }

  handleCreateNewDiet() {
    this.setState({showDietNamePopup: true});
  }

// ************************************END OF USER INPUT HANDLERS*******************

// *********************************START OF CRUD METHODS**************************

  saveDietData(dietName) {
    //save is clicked with dietName.
    //save is clicked for a new diet (no diet name);
    //save as new is clicked with dietName.
    //save as new is clicked for a new diet
    var data = null;
    //if dietName argument is provided, this indicates that we are to save a new diet.
    //override this.state.nutritionData's name and id
    if(dietName) {
      data = {"name": dietName, "items": this.state.nutritionData.items};
    }
    //otherwise, just send our updated existing diet for saving.
    else if (this.state.nutritionData.items.length) {
      data = this.state.nutritionData;
    }

    else {
      this.setState({alertMessage: this.handleAlertMessage("No items to Save!")});
      return;
    }

    console.log("saveDietData//data", data);
    $.ajax({
      url: '/users/save',
      headers: {'Authorization': `bearer ${localStorage.getItem('token')}`},
      method:'POST',
      dataType:'JSON',
      processData: 'false',
      data: data
    }).then((res) => {
      console.log("res", res);
      this.setState({nutritionData: res.nutritionData,
                     dietNames: res.dietNames,
                     alertMessage: this.handleAlertMessage(res.message)});
    });
  }

  deleteDietData() {
    $.ajax({
      url: '/users/' + this.state.nutritionData._id + '/delete',
      headers: {'Authorization': `bearer ${localStorage.getItem('token')}`},
      method:'GET',
      dataType:'JSON',
    }).then((res) => {
      this.setState({dietNames: res.dietNames, alertMessage: this.handleAlertMessage(res.message)});
    });
  }

  handleDietSave() {
    if (this.state.nutritionData.name) {
      this.saveDietData(null);
    }
    else {
      this.promptDietName();
    }
  }

  promptDietName() {
    if (Object.keys(this.state.nutritionData).length) {
      this.setState({showDietNamePopup: true})
    }
    else  {
      this.setState({alertMessage: this.handleAlertMessage("You haven't selected any items to save yet!")})
    }
  }

  submitDietName() {
    const dietName = document.querySelector("#dietName").value;
    this.setState({showDietNamePopup: false});
    this.saveDietData(dietName);
  }

// ********************************END OF CRUD METHODS****************************

//*********************************START OF UI STATE METHODS***********************

  toggleShowDietNamePopup() {
    this.setState({showDietNamePopup: !this.state.showDietNamePopup});
  }

  //TODO: nutritionData and dietTracker.nutrientTracker are duplicates of the
  //same data. See if you can tweak the app to use just one. No Redundancy.

  toggleShowRDISetForm() {
    this.setState({showRDISetForm: !this.state.showRDISetForm});
  }

  handleAlertMessage(alertMessage, displayTime = 1000) {
    //if no alertMessage is passed, that means there should be no alert message shown
    if (!alertMessage) {
      this.setState({alertMessage: null})
    }
    //else set a timeout for the alert message to fade in 1 second.
    else {
      setTimeout(() => {this.setState({alertMessage: null})}, displayTime);
      return alertMessage;
    }
  }

  alertMessage(alertMessage, displayTime = 1000) {
    this.setState({alertMessage: this.handleAlertMessage(alertMessage, displayTime)});
  }



// ***********************************END OF UI STATE METHODS*********************

  render() {

    return (
      <div className="px-2 px-sm-5">
        {(this.state.alertMessage)
          ?<Alert alertMessage={this.state.alertMessage}
                  handleAlertMessage={this.handleAlertMessage}/>
          :null
        }
        <div className="jumbotron py-3">
          <p>{`Welcome to healthy bodies! Get started by entering in food items from
             your diet below or click the record button to input by voice. We'll
             gather all the information for you.`}</p>
        </div>
        <SearchBar className="searchBar" handleSearch={this.handleSearchItemNatural}
                                         handleVoiceSearch={this.handleVoiceSearch}/>
        <ResultsList searchResults={this.state.searchResults || []}
                     handleSelectItem={this.handleSelectItem}
        />
        <RDISetSelector metrics = {this.state.metrics || {}}
                        toggleShowRDISetForm= {this.toggleShowRDISetForm}
                        showRDISetForm= {this.state.showRDISetForm}
                        handleGetRDISet= {this.handleGetRDISet}/>
        {(this.state.nutritionData.items.length)
          ?<div>
            {(this.state.dietNames.length)
              ? <form className="card my-3" onChange={this.handleDietSelect} onSubmit={this.handleDietSelect}>
                  <div className="card-body">
                    <p className= "font-weight-bold">Select your Diet:</p>
                    <select className="dietSelector form-control">
                      {this.state.dietNames.map((dietName) =>
                        <option key={dietName._id} value={dietName._id} selected>{dietName.name}</option>
                      )}
                    </select>
                    <div className= "d-flex justify-content-end">
                      <button onClick = {this.handleCreateNewDiet} className = "btn-sm btn-primary mx-3 my-3">Create New</button>
                      <input type="submit" value="enter" className="btn-sm btn-primary my-3"/>
                    </div>
                  </div>
                </form>
              : null
            }
            <div>
              <div className= "card my-3">
                <div className = "card-body">
                  <SelectedItemsList className="selectedItemsList"
                                     nutritionData={this.state.nutritionData.items}
                                     handleNutritionDataChange={this.handleNutritionDataChange}
                  />
                  {(this.props.isLoggedIn)
                    ?<div className= "d-flex justify-content-end my-3">
                      <button onClick= {this.handleDietSave}
                              className = "btn-sm btn-primary">
                        Save
                      </button>
                      <button onClick= {this.promptDietName}
                              className = "btn-sm btn-primary mx-3">
                        Save As
                      </button>
                      <button onClick= {this.deleteDietData}
                              className = "btn-sm btn-primary">
                        Delete
                      </button>
                     </div>
                    :<p className= "mt-2">Log In or Sign Up to save your diet!</p>
                  }
                </div>
              </div>
                {(this.state.showDietNamePopup)
                  ? <DietNamePopup submitDietName = {this.submitDietName}
                                   toggleShowDietNamePopup= {this.toggleShowDietNamePopup}/>
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
                                       metrics={this.state.metrics}
                                       alertMessage = {this.alertMessage}

                />
            </div>
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

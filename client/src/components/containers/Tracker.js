import React, { Component } from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import dietTracker from '../../api.js'
import SearchBar from './SearchBar'
import RDISetSelector from '../common/RDISetSelector'
import ResultsList from '../common/ResultsList'
import SelectedItemsList from '../common/SelectedItemsList'
import NutritionTable from './NutritionTable'
import MicroNutrientsTracker from './MicroNutrientsTracker'
import FattyAcidTracker from './FattyAcidTracker'
import MacroNutrientsTracker from './MacroNutrientsTracker'
import DietNamePopup from './DietNamePopup'
import Alert from "../common/Alert"
import speechRecognition from "../../speechRecognition"

class Tracker extends Component {
  constructor(props) {
    super(props);
    this.state = {nutritionData: {"items":[], "name": null},
                  searchResults: [],
                  dietTotals: {},
                  dietNames: [],
                  metrics:{},
                  showDietNamePopup: false,
                  showRDISetForm: false,
                  alertMessage: null,
                };
  }

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

  getUserDiets = () => {
    return $.ajax({
      url: '/users/',
      headers: {
        "Authorization": `bearer ${localStorage.getItem('token')}`,
      },
      method:'GET',
      dataType:'JSON'
    })
  }

  getRDISet = (e) => {
     let path;
     if (localStorage.getItem('token')) {
       path = "/users/metrics/";
     }

     //presence of e indicates a user input triggered this function.
     if(e) {
       const [sex, age] = $('.userRDIForm').serializeArray();
       console.log(sex, age);
       if(["male", "female"].indexOf(sex.value) < 0
          || age === undefined
          || age.value < 0) {
         return Promise.reject("Invalid values");
       }
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

   //returns an object containing nested objects of the form "metricName: {dietAmount: #, rdi: #}""
   sumDietTotals = (nutritionData= this.state.nutritionData.items, metrics = this.state.metrics) => {
     const totals = {};

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

  //handle changing the nutrition values based on user input food quantities
  handleNutritionDataChange = (e) => {
    const foodItem = e.target.dataset.fooditem;
    const nutritionItems = this.state.nutritionData.items;
    const targetId = e.target.id;
    let itemData;
    let foodItemIndex;

    //get the data and index of the item changed by the user from the stored diet state
    //in order to update it.
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
    this.setState({dietTotals: this.sumDietTotals(),
                   nutritionData: {"name": this.state.nutritionData.name || null,
                                   "_id": this.state.nutritionData._id || null,
                                   "items": nutritionItems}
                   });
  }

  //search food item and provide result list for user to select desired item
  handleSearch = (e) => {
    Promise.resolve(dietTracker.getItem(document.querySelector(".search").value))
      .then(function(searchResults) {
        this.setState({searchResults: searchResults})
      }.bind(this))
      .catch(function(error) {
        console.log("Error: ", error);
      })

    //reset search bar after search
    document.querySelector(".search").value = "";
  }

  //search food item and automatically add returned food item to selected items
  handleSearchItemNatural = (items = document.querySelector(".search").value) => {
    Promise.resolve(dietTracker.getNutrients(items))
      .then((foodData) => {
        const existingFoodItemList = this.state.nutritionData.items.map((foodItem) => foodItem.name);
        let clashingFoodItemList = [];
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

  handleSelectItem = (e) => {
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
  }

  handleVoiceSearch = (done) => {
      // const recordButton = document.querySelector('#recordButton');

      speechRecognition.listen()
        .then(transcript => {
          this.handleSearchItemNatural(transcript);
        })
        .then(() => {
          done();
        })
        .catch(error => {
          done();
        })
  }

  handleGetRDISet = (e) => {
    e.preventDefault();
    Promise.resolve(this.getRDISet(e))
      .then((rdiSet)=> {
        console.log("there");
        this.setState({metrics: rdiSet,
                       showRDISetForm: false,
                       dietTotals: this.sumDietTotals(undefined, rdiSet)});
      })
      .catch((err)=> {
        this.alertMessage(err);
      })
  }



  handleDietSelect = (e) => {
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

  handleCreateNewDiet = () => {
    this.setState({showDietNamePopup: true});
  }

// ************************************END OF USER INPUT HANDLERS*******************

// *********************************START OF CRUD METHODS**************************

  saveDietData = (dietName) => {
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

    $.ajax({
      url: '/users/save',
      headers: {'Authorization': `bearer ${localStorage.getItem('token')}`},
      method:'POST',
      dataType:'JSON',
      processData: 'false',
      data: data
    }).then((res) => {
      this.setState({nutritionData: res.nutritionData,
                     dietNames: res.dietNames,
                     alertMessage: this.handleAlertMessage(res.message)});
    });
  }

  deleteDietData = () => {
    $.ajax({
      url: '/users/' + this.state.nutritionData._id + '/delete',
      headers: {'Authorization': `bearer ${localStorage.getItem('token')}`},
      method:'GET',
      dataType:'JSON',
    }).then((res) => {
      this.setState({dietNames: res.dietNames, alertMessage: this.handleAlertMessage(res.message)});
    });
  }

  handleDietSave = () => {
    if (this.state.nutritionData.name) {
      this.saveDietData(null);
    }
    else {
      this.promptDietName();
    }
  }

  promptDietName = () => {
    if (Object.keys(this.state.nutritionData).length) {
      this.setState({showDietNamePopup: true})
    }
    else  {
      this.setState({alertMessage: this.handleAlertMessage("You haven't selected any items to save yet!")})
    }
  }

  submitDietName = () => {
    const dietName = document.querySelector("#dietName").value;
    this.setState({showDietNamePopup: false});
    this.saveDietData(dietName);
  }

// ********************************END OF CRUD METHODS****************************

//*********************************START OF UI STATE METHODS***********************

  toggleShowDietNamePopup = () => {
    this.setState({showDietNamePopup: !this.state.showDietNamePopup});
  }

  toggleShowRDISetForm = () => {
    this.setState({showRDISetForm: !this.state.showRDISetForm});
  }

  handleAlertMessage = (alertMessage, displayTime = 1000) => {
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

  alertMessage = (alertMessage, displayTime = 1000) => {
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
                        <option key={dietName._id} value={dietName._id}>{dietName.name}</option>
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

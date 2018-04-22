import React, { Component } from 'react';
import $ from 'jquery';
import dietTracker from '../../api.js'
import SearchBar from './SearchBar'
import RDISetSelector from '../common/RDISetSelector'
import ResultsList from '../common/ResultsList'
import SelectedItemsList from '../common/SelectedItemsList'
import NutritionTable from './NutritionTable'
import DeficiencyList from './DeficiencyList'
import MicroNutrientsTracker from './MicroNutrientsTracker'

class Tracker extends Component {
  constructor(props) {
    super(props);
    this.handleNutritionDataChange = this.handleNutritionDataChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.saveDietData = this.saveDietData.bind(this);
    this.analyzeDiet = this.analyzeDiet.bind(this);
    this.sumDietTotals = this.sumDietTotals.bind(this);
    this.toggleDeficiencyList = this.toggleDeficiencyList.bind(this);
    // this.handleNutritiousFoodSearch = this.handleNutritiousFoodSearch.bind(this);
    this.state = {nutritionData: {},
                  searchResults: [],
                  dietTotals: {},
                  metrics:{},
                  deficiencyListIsShowing:false
                };
  }

  componentDidMount() {
    //TODO: Axios
    //TODO: can send multiple ajax calls in parallel?
    $.ajax({
      url: 'http://localhost:5000/users/',
      method:'GET',
      dataType:'JSON'
    }).then((res) => {
      res.forEach(function(foodItem) {
        dietTracker.nutrientTracker[foodItem.name] = foodItem;
      })
    }).then(() => {
        $.ajax({
          url: 'http://localhost:5000/admin/metrics/',
          method:'GET',
          dataType:'JSON'
        }).then((res) => {
          this.setState({metrics: res});
        }).then(() => {
          const dietTotals = this.sumDietTotals(dietTracker.nutrientTracker);
          this.setState({nutritionData: dietTracker.nutrientTracker, dietTotals: dietTotals});
          console.log("dietTotals", this.state.dietTotals);
        })
      });
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
          if (typeof itemData[category] == "number") {
            itemData[category] *= quantityRatio;
          }
        }
        break;
      case "itemWeight":
        const weightRatio = e.target.value/itemData.amount;
        if (e.target.value > 0) {
          for (const category in itemData) {
            if (typeof itemData[category] == "number") {
              itemData[category] *= weightRatio;
            }
          }
        }
        break;
    }
    const [dietTotals, deficiencyList]= this.analyzeDiet();
    // const dietTotals = this.sumDietTotals(nutritionData);
    this.setState({nutritionData: nutritionData,
                   dietTotals: dietTotals,
                   deficiencyList: deficiencyList});
  }

  handleKeyPress(e) {
    console.log(e.target.classList.value);
    if (e.keyCode == 13) {
      if (e.target.classList.contains("search")) {
        this.handleSearch(e);
      }
      else if (e.target.classList.contains("itemQuantity") || e.target.classList.contains("itemWeight"))
        this.handleNutritionDataChange(e);
    }
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

  saveDietData(e) {
    if (Object.keys(dietTracker.nutrientTracker).length) {
      console.log("saving ", dietTracker.nutrientTracker);
      $.ajax({
        url: 'http://localhost:5000/users/',
        method:'POST',
        dataType:'text',
        processData: 'false',
        data: dietTracker.nutrientTracker
      }).then(function(res) {
        alert(res);
      });
    }
    else return;
  }

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
        return metric;
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

  toggleDeficiencyList() {
    if (this.state.deficiencyListIsShowing) {
      this.setState({deficiencyListIsShowing: false})
    }
    else {
      this.setState({deficiencyListIsShowing: true})
    }
    console.log(this.state.deficiencyListIsShowing);
  }

  // handleNutritiousFoodSearch(deficiencyList) {
  //   console.log(deficiencyList);
  //   $.ajax({
  //     url: 'http://localhost:5000/users/nutrients',
  //     method:'POST',
  //     dataType:'JSON',
  //     processData: 'false',
  //     data: deficiencyList
  //   }).then((res) => {
  //     // console.log(res);
  //     this.setState({deficiencyList: deficiencyList, foodRecommendations: res});
  //     console.log(this.state.foodRecommendations);
  //   });
  // }

  render() {
    return (
      <div onKeyUp={this.handleKeyPress}>
        <SearchBar className="searchBar" handleSearch={this.handleSearch}/>
        <RDISetSelector/>
        <ResultsList searchResults={this.state.searchResults || []}
                     handleSelectItem={this.handleSelectItem}
        />
        {(Object.keys(this.state.nutritionData).length)
          ? <div>
              <SelectedItemsList className="selectedItemsList"
                                 nutritionData={this.state.nutritionData}
                                 handleNutritionDataChange={this.handleNutritionDataChange}
              />
              <NutritionTable className="table itemTable" nutritionData={this.state.nutritionData}
                                                          dietTotals={this.state.dietTotals}
                                                          metrics={this.state.metrics}
              />
              <MicroNutrientsTracker nutritionData={this.state.nutritionData}
                                    dietTotals={this.state.dietTotals}
              />
              <button onClick= {this.toggleDeficiencyList}>Analyze My Diet!</button>
              <button onClick= {this.saveDietData}>Save</button>
            </div>
          : <div>
              <button onClick= {this.toggleDeficiencyList}>Analyze My Diet!</button>
              <button onClick= {this.saveDietData}>Save</button>
            </div>
        }

      </div>
    )
  };
}

// {(this.state.deficiencyListIsShowing)
//   ? <DeficiencyList dietTotals = {this.state.dietTotals}
//                     // foodRecommendations = {this.state.foodRecommendations}
//     />
//   : null
// }

export default Tracker

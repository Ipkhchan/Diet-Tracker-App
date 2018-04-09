import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import './App.css';
import $ from 'jquery';
import dietTracker from './api.js'

// App
// -> SearchBar
// -> ResultList
// -> NutritionTable
//    -> NutritionTableHeaders
//    -> NutritionTableRows
//       -> NutritionTableRow
//    -> NutritionTableFooter

//TODO: what to display when there is no nutritionData. What to do if input is 0. Prevent decimal values in table (render without actually changing the data value)
//TODO: place app initializations in componentDidMount within App
//TODO: bug: if the first food item you select doesn't have all the nutrient categories (ex. fish doesn't show carbs)
//that you want to track, it won't show the table header. Then if you add an item that does have that category, it will show the value,
//but there is no table header for it.
const App = () => {
  const metrics = ["source", "age_min","age_max","sex", "calorie", "carbohydrate",
    "protein", "fat", "fiber", "calcium", "chromium", "copper",
  "fluoride", "iodine", "iron", "magnesium", "manganese", "molybdenum",
  "phosphorus", "selenium", "zinc", "potassium", "sodium", "chloride",
  "vitamin-A", "vitamin-C", "vitamin-D", "vitamin-E", "vitamin-K", "thiamin",
  "riboflavin", "niacin", "vitamin-B6", "folate", "vitamin-B12", "pantothenic-acid",
  "biotin", "choline"];
  return (
    <Router>
      <Switch>
          <Route exact path="/" render={()=><Track metrics={metrics}/>} />
          <Route path="/admin" render={()=><AdminPage metrics={metrics}/>}/>
          <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  )
};

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = $('.rdiForm').serializeArray();
    const postData = {};
    formData.forEach(metric => {
      postData[metric.name] = metric.value;
    });

    $.ajax({
      url: 'http://localhost:5000/metrics/',
      method:'POST',
      dataType:'text',
      processData: 'false',
      data: postData
    }).then(function(res) {
      alert(res);
    });
  }

  render() {
    console.log(this.props.metrics);

    return(
      <form className="rdiForm" onSubmit={this.handleSubmit}>
        {this.props.metrics.map((metric) =>
          <div key={metric}>
            <label htmlFor={metric}>{metric + ":"}</label>
            <input type="text" name={metric} id={metric}/>
          </div>
        )}
        <input type="submit" value="submit"/>
      </form>
    )
  }
};



class Track extends Component {
  constructor(props) {
    super(props);
    this.handleNutritionDataChange = this.handleNutritionDataChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.saveDietData = this.saveDietData.bind(this);
    this.analyzeDiet = this.analyzeDiet.bind(this);
    this.sumDietTotals = this.sumDietTotals.bind(this);
    this.state = {nutritionData: {}, searchResults: [], dietTotals: {}, metrics:{}, deficiencyList:[]};
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
          url: 'http://localhost:5000/metrics/',
          method:'GET',
          dataType:'JSON'
        }).then((res) => {
          this.setState({metrics: res});
        }).then(() => {
          const dietTotals = this.sumDietTotals(dietTracker.nutrientTracker);
          this.setState({nutritionData: dietTracker.nutrientTracker, dietTotals: dietTotals});
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
    const dietTotals = this.sumDietTotals(nutritionData);
    this.setState({nutritionData: nutritionData, dietTotals: dietTotals});
    console.log(this.state.nutritionData);
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
    this.props.metrics.forEach(metric => {
      if(["age_min", "age_max", "sex", "source"].indexOf(metric) < 0) {
        // for each header, if the attribute (ex. protein, carb) represents
        //numerical data, loop through all the foodItems in the selected List
        //and sum all values for that attribute
        totals[metric] = 0;
        foodItems.map(function(foodItem) {
          //ignore foodItems that don't have that attribute defined or are 0.
          if(nutritionData[foodItem][metric]) {
            totals[metric] += nutritionData[foodItem][metric];
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
    let deficiencyList = [];
    for (let dietTotal in dietTotals) {
      if (dietTotals[dietTotal] < this.state.metrics[dietTotal]) {
        deficiencyList.push(dietTotal);
      }
    };
    this.setState({deficiencyList: deficiencyList});

  }

  render() {
    return (
      <div onKeyUp={this.handleKeyPress}>
        <SearchBar className="searchBar" handleSearch={this.handleSearch}/>
        <ResultsList searchResults={this.state.searchResults || []} handleSelectItem={this.handleSelectItem}/>
        {(Object.keys(this.state.nutritionData).length)
          ? <div>
              <SelectedItemsList className="selectedItemsList" nutritionData={this.state.nutritionData || []}
              handleNutritionDataChange={this.handleNutritionDataChange}/>
              <NutritionTable className="table itemTable" nutritionData={this.state.nutritionData || []} dietTotals={this.state.dietTotals}/>
              <button onClick= {this.analyzeDiet}>Analyze My Diet!</button>
              <button onClick= {this.saveDietData}>Save</button>
            </div>
          : <div>
              <button onClick= {this.analyzeDiet}>Analyze My Diet!</button>
              <button onClick= {this.saveDietData}>Save</button>
            </div>
        }
        <DeficiencyList deficiencyList = {this.state.deficiencyList}/>
      </div>
    )
  };
}

const DeficiencyList = (props) => {
  console.log(props.deficiencyList);
  return (
    <div>
      {props.deficiencyList.map(deficiency =>
        <p className= "block">{"You may be deficient in " + deficiency}</p>
      )}
    </div>
  )
}

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {searchResults: (dietTracker.searchResults)}
  }

  handleSearch(e) {
    console.log(e.target);
    this.props.handleSearch(e);
  }

  render() {
      return (
        <div>
          <input placeholder="Search" className="search"></input>
          <div className="searchIcon" onClick={this.handleSearch}>
            <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
          </div>
        </div>
      )

  };
}

const ResultsList = (props) => {
  return (
    <ul>
      {props.searchResults.map((searchResult) =>
        <li key={searchResult} onClick={props.handleSelectItem}>{searchResult}</li>
      )}
    </ul>
  )
};

//TODO: make it so that when you change itemQuanity, itemWeight also updates, and vice versa
const SelectedItemsList = (props) => {
  const nutritionData = props.nutritionData;
  return (
    <ul>
      {Object.keys(nutritionData).map((foodItem) =>
        <li key={"select" + foodItem} className = "foodItem flex">
          {nutritionData[foodItem].name}
          <div className = "flex edits" data-fooditem = {foodItem}  onChange = {props.handleNutritionDataChange}>
            <input type="number" value={nutritionData[foodItem].quantity} min="1" className="itemQuantity"></input>
            <p>units or</p>
            <input type="number" value={nutritionData[foodItem].amount} min="1" className="itemWeight"></input>
            <p>grams</p>
            <button type="button" className="removeItem" onClick = {props.handleNutritionDataChange}>X</button>
          </div>
        </li>
      )}
    </ul>
  )
}

class NutritionTable extends Component {
  constructor(props) {
    super(props);
    this.state = {headers: ["name","amount", "carbohydrate", "fat", "protein", "calorie",]}
  }

  render() {
    const nutritionData = this.props.nutritionData;
    // for (const foodItem in nutritionData) {
    //     var headers = Object.keys(nutritionData[foodItem]);
    //     break;
    // }
    return (
      <table>
        <NutritionTableHeaders className="itemTableHeaders"  headers={this.state.headers}/>
        <NutritionTableRows className="itemTableRows" nutritionData={nutritionData} headers={this.state.headers} dietTotals = {this.props.dietTotals}/>
        <MetricsFooter headers={this.state.headers} dietTotals = {this.props.dietTotals}/>
      </table>
    )
  }
};

const NutritionTableHeaders = (props) => {
  return (
    <thead>
      <tr>
        {props.headers.map((header) =>
          <th key={header}>{header}</th>
        )}
      </tr>
    </thead>
  )
};

const NutritionTableRows = (props) => {
  const nutritionData = props.nutritionData;
  return (
    <tbody>
      {Object.keys(nutritionData).map((foodItem) =>
        <NutritionTableRow key={nutritionData[foodItem].name} foodItem={nutritionData[foodItem]} headers={props.headers}/>
      )}
      <NutritionTableTotals className="itemTableTotals" nutritionData = {nutritionData} headers={props.headers} dietTotals = {props.dietTotals}/>
    </tbody>
  )
};

const NutritionTableRow = (props) => {
    const foodItem= props.foodItem;
    const headers = props.headers;
    return (
      <tr>
        {headers.map((header) =>
          <td key={foodItem.name + "-" + header}>
            {typeof foodItem[header] == "number" ? Math.round(foodItem[header]*10)/10 : foodItem[header]}
          </td>
        )}
      </tr>
    )
};

//TODO: 2 footer elements created here. Opportunity to use Higher Order Component?
const NutritionTableTotals = (props) => {
  const headers = props.headers;
  const dietTotals = props.dietTotals;
  let footerData = {};

  //filter out the ones you actually want to display
  headers.forEach(header => {
    footerData[header] = dietTotals[header];
  })
  footerData.name = "Total";

  return (
      <tr>
        {Object.keys(footerData).map((footer) =>
          <td key={footer + "-footer"}>
            {typeof footerData[footer] == "number" ? Math.round(footerData[footer]*10)/10 : footerData[footer]}
          </td>
        )}
      </tr>
  )

};

class MetricsFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {metrics: {}};
  }

  componentDidMount() {
    $.ajax({
      url: 'http://localhost:5000/metrics/',
      method:'GET',
      dataType:'JSON'
    }).then((res) => {
      this.setState({metrics: res});
    }).then(() => {
      let deficiencyTracker = [];
      const dietTotals = this.props.dietTotals;
      for (let dietTotal in dietTotals) {
        if (dietTotals[dietTotal] < this.state.metrics[dietTotal]) {
          deficiencyTracker.push(dietTotal);
        }
      };
    })
  }

  render() {
    return (
      <tfoot>
        <tr>
          <td>RDI</td>
            {this.props.headers.map((header) =>
              (header != "name")
              ? <td key={header+"-rdi"}>{this.state.metrics[header] || ""}</td>
              : null
            )}
        </tr>
      </tfoot>
    )
  }
}

const NotFound = () => (
  <h1>404.. This page is not found!</h1>)

export default App;

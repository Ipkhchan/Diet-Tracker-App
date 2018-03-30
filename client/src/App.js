import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
import dietTracker from './api.js'

//App
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
class App extends Component {
  constructor(props) {
    super(props);
    this.handleNutritionDataChange = this.handleNutritionDataChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.state = {nutritionData: dietTracker.nutrientTracker, searchResults: dietTracker.searchResults};
  }

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
        const currentQuantity = itemData.amount/itemData.defaultServingSize;
        for (const category in itemData) {
          if (typeof itemData[category] == "number") {
            itemData[category] *= e.target.value/currentQuantity;

          }
        }
        break;
      case "itemWeight":
        const ratio = e.target.value/itemData.amount;
        if (e.target.value > 0) {
          for (const category in itemData) {
            if (typeof itemData[category] == "number") {
              itemData[category] *= ratio;
            }
          }
        }
        break;
    }
    console.log(nutritionData);
    this.setState({nutritionData: nutritionData});
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
    dietTracker.getNutrients(e.target.textContent);
    setTimeout(function() {
      this.setState({nutritionData: dietTracker.nutrientTracker})
      console.log(this.state.nutritionData)
    }.bind(this), 1000);
  }

  render() {
    return (
      <div onKeyUp={this.handleKeyPress}>
        <ExpressTest/>
        <SearchBar className="searchBar" handleSearch={this.handleSearch}/>
        <ResultsList searchResults={this.state.searchResults || []} handleSelectItem={this.handleSelectItem}/>
        <SelectedItemsList className="selectedItemsList" nutritionData={this.state.nutritionData || []}
        onDataChange={this.handleNutritionDataChange}/>
        <NutritionTable className="table itemTable" nutritionData={this.state.nutritionData || []}/>
      </div>
    )
  };
}

class ExpressTest extends Component {
  constructor(props) {
    super(props);
    this.state = { response: ''};
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
        <p className="App-intro">{this.state.response}</p>
    );
  }
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

class ResultsList extends Component {
  render() {
    return (
      <ul>
        {this.props.searchResults.map((searchResult) =>
          <li key={searchResult} onClick={this.props.handleSelectItem}>{searchResult}</li>
        )}
      </ul>
    )
  };
}

//TODO: make it so that when you change itemQuanity, itemWeight also updates, and vice versa
class SelectedItemsList extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onDataChange(e);
  }

  render() {
      return (
        <ul>
          {Object.keys(this.props.nutritionData).map((foodItem) =>
            <li key={"select" + foodItem} className = "foodItem flex">
              {foodItem}
              <div className = "flex edits" data-fooditem = {foodItem}  onChange = {this.handleChange}>
                <input type="number" defaultValue="1" min="1" className="itemQuantity"></input>
                <p>units or</p>
                <input type="number" defaultValue={this.props.nutritionData[foodItem].amount} min="1" className="itemWeight"></input>
                <p>grams</p>
                <button type="button" className="removeItem" onClick = {this.handleChange}>X</button>
              </div>
            </li>
          )}
        </ul>
      )

    };
}

class NutritionTable extends Component {
  render() {
    const nutritionData = this.props.nutritionData;
    for (const foodItem in this.props.nutritionData) {
        var headers = Object.keys(this.props.nutritionData[foodItem]);
        break;
    }
    return (
      <table>
        <NutritionTableHeaders className="itemTableHeaders"  headers={headers || []}/>
        <NutritionTableRows className="itemTableRows" nutritionData={this.props.nutritionData} />
        <NutritionTableFooter className="itemTableFooter" nutritionData = {this.props.nutritionData} headers={headers || []}/>
      </table>
    )
  };
}

class NutritionTableHeaders extends Component {
  render() {
    return (
      <thead>
        <tr>
          {this.props.headers.map((header) =>
            <th key={header}>{header}</th>
          )}
        </tr>
      </thead>
    )
  };
}

class NutritionTableRows extends Component {
  render() {
    const nutritionData = this.props.nutritionData;
    return (
      <tbody>
        {Object.keys(nutritionData).map((foodItem) =>
          <NutritionTableRow key={nutritionData[foodItem].name} foodItem={nutritionData[foodItem]}/>
        )}
      </tbody>
    )
  };
}

class NutritionTableRow extends Component {
  render() {
    const foodItem= this.props.foodItem;
    return (
      <tr>
        {Object.keys(foodItem).map((header) =>
          <td key={foodItem.name + header}>
            {typeof foodItem[header] == "number" ? Math.round(foodItem[header]*10)/10 : foodItem[header]}
          </td>
        )}
      </tr>
    )
  };
}

class NutritionTableFooter extends Component {
  render() {
    const headers = this.props.headers;
    const foodItems = Object.keys(this.props.nutritionData);
    const nutritionData = this.props.nutritionData;
    const footerData = {name: "Total"};

    //loop through all headers
    headers.map(function(header) {
      //for each header, if the attribute (ex. protein, carb) represents
      //numerical data, loop through all the foodItems in the selected List
      //and sum all values for that attribute
      if (typeof nutritionData[foodItems[0]][header] == "number") {
        footerData[header] = 0;
        foodItems.map(function(foodItem) {
          //ignore foodItems that don't have that attribute defined or are 0.
          if(nutritionData[foodItem][header]) {
            footerData[header] += nutritionData[foodItem][header];
          }
          return foodItem;
        });
      };
      return header;
    });

    return (
      <tfoot>
        <tr>
          {Object.keys(footerData).map((footer) =>
            <td key={footer + "-footer"}>
              {typeof footerData[footer] == "number" ? Math.round(footerData[footer]*10)/10 : footerData[footer]}
            </td>
          )}
        </tr>
      </tfoot>
    )
  };
}

export default App;

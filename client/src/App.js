import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  // Link,
  Switch,
  // Redirect
} from "react-router-dom";
import './App.css';
import AdminMetricsPage from './components/containers/AdminMetricsPage'
import NotFound from './components/containers/AdminMetricsPage'
import AdminFoodDataPage from './components/containers/AdminFoodDataPage'
import AdminSignUpPage from './components/common/AdminSignUpPage'
import AdminSignUpSuccess from './components/common/AdminSignUpSuccess'
import LoginPage from './components/containers/LoginPage'
import Tracker from './components/containers/Tracker'

import {connect} from 'react-redux';
// import { toggleIsLoggedIn } from './actions'


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
//TODO: split components into individual files and export/import.
//TODO: bug: if the first food item you select doesn't have all the nutrient categories (ex. fish doesn't show carbs)
//that you want to track, it won't show the table header. Then if you add an item that does have that category, it will show the value,
//but there is no table header for it.
class App extends Component {
  constructor(props) {
    super(props);
    this.logoutUser = this.logoutUser.bind(this);
    this.state = {logoutMessage: null}
  }

  logoutUser() {
    localStorage.removeItem('token');
    this.setState({logoutMessage: "Successfully Logged Out!"});
    this.props.dispatch({type: 'TOGGLE'});
    window.location.assign("http://localhost:3000/")
  }

  render() {
    const metrics = ["source", "age_min","age_max","sex", "calorie", "carbohydrate",
      "protein", "fat", "fiber", "calcium", "chromium", "copper",
    "fluoride", "iodine", "iron", "magnesium", "manganese", "molybdenum",
    "phosphorus", "selenium", "zinc", "potassium", "sodium", "chloride",
    "vitamin-A", "vitamin-C", "vitamin-D", "vitamin-E", "vitamin-K", "thiamin",
    "riboflavin", "niacin", "vitamin-B6", "folate", "vitamin-B12", "pantothenic-acid",
    "biotin", "choline"];

    return (
      <div>
        {this.state.logoutMessage
          ? <p className = "centered-popup">
              {this.state.logoutMessage}
            </p>
          : null
        }

        <div className="row-0">
          <ul className="topnav flex">
              <li><a href="#home" className="menuBar">&#9776;</a></li>
              <li><a href="/">Dashboard</a></li>
              {(this.props.isLoggedIn)
                ? <li><a href="#home" onClick= {this.logoutUser}>Logout</a></li>
                : <div className= "flex">
                    <li><a href="/admin/login">Login</a></li>
                    <li><a href="/admin/signup">Sign Up</a></li>
                  </div>
              }
              <li><a href="/admin/metrics">Admin</a></li>
          </ul>
        </div>

        <Router>
          <Switch>
              <Route exact path="/" render={()=><Tracker metrics={metrics} isLoggedIn={this.state.isLoggedIn}/>} />
              <Route path="/admin/signup" render={()=><AdminSignUpPage/>}/>
              <Route path="/admin/signupSuccess" render={()=><AdminSignUpSuccess/>}/>
              <Route path="/admin/login" render={()=><LoginPage/>}/>
              <Route path="/admin/metrics" render={()=><AdminMetricsPage metrics={metrics}/>}/>
              <Route path="/admin/foodData" render={()=><AdminFoodDataPage/>}/>
              <Route path="*" component={NotFound} />
          </Switch>
        </Router>
      </div>
    )
  }
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.isLoggedIn
})

// const mapDispatchToProps = (dispatch) => ({
//   onUpdate: () => dispatch(toggleIsLoggedIn())
// })

export default connect(mapStateToProps)(App);

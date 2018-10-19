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
import SignUpPage from './components/containers/SignUpPage'
import SignUpSuccess from './components/common/SignUpSuccess'
import LoginPage from './components/containers/LoginPage'
import Tracker from './components/containers/Tracker'
import Footer from './components/common/Footer'

import {connect} from 'react-redux';

const navLink = {
  fontSize: '12px'
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {logoutMessage: null}
  }

  logoutUser = () => {
    localStorage.removeItem('token');
    this.setState({logoutMessage: "Successfully Logged Out!"});
    this.props.dispatch({type: 'TOGGLE'});
    window.location.href = '/';
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
          ? <p className = "centered-popup alert alert-success">
              {this.state.logoutMessage}
            </p>
          : null
        }

        <nav className="navbar accentColorBackground mb-3">
          <a className="navbar-brand" href="/">HealthyBodies</a>

          <ul className="navbar-nav d-flex flex-row justify-content-end mx-0">
              <li className= "nav-item active mr-2">
                <a href="/" className= "nav-link" style={navLink}>Dashboard</a>
              </li>
              {(this.props.isLoggedIn)
                ? <li className= "nav-item active mx-2">
                    <a href="#home"
                       onClick= {this.logoutUser}
                       className= "nav-link" style={navLink}>Logout</a>
                  </li>
                : <div className="d-flex">
                    <li className= "nav-item active mx-2">
                      <a href="/admin/login"
                         className= "nav-link" style={navLink}>Login</a>
                    </li>
                    <li className= "nav-item active ml-2">
                      <a href="/admin/signup"
                         className= "nav-link" style={navLink}>Sign Up</a>
                    </li>
                  </div>
              }
          </ul>

        </nav>

        <Router>
          <Switch>
              <Route exact path="/" render={()=><Tracker metrics={metrics} isLoggedIn={this.state.isLoggedIn}/>}/>
              <Route path="/admin/signup" render={()=><SignUpPage/>} />
              <Route path="/admin/signupSuccess" render={()=><SignUpSuccess/>}/>
              <Route path="/admin/login" render={()=><LoginPage/>}/>
              <Route path="/admin/metrics" render={()=><AdminMetricsPage metrics={metrics}/>}/>
              <Route path="*" component={NotFound} />
          </Switch>
        </Router>

        <Footer/>
      </div>
    )
  }
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.isLoggedIn
})

export default connect(mapStateToProps)(App);

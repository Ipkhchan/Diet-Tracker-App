import React, {Component} from 'react';

class FattyAcidTracker extends Component {
  constructor(props) {
    super(props);
    this.toggleDisplay = this.toggleDisplay.bind(this);
    this.state = {listIsShowing: false};
  }

  toggleDisplay() {
    (this.state.listIsShowing) ? this.setState({listIsShowing: false}) : this.setState({listIsShowing: true});
  }

  oneDecimal(value) {
    return Math.round(value*10)/10;
  }

  render() {
    const listIsShowing = this.state.listIsShowing;
    const nutritionData = this.props.nutritionData;
    const fattyAcidSums = {"omega3": 0, "omega6": 0, "omega9": 0}

    console.log(nutritionData);
    for (let [foodItemName, foodItem] of Object.entries(nutritionData)){
      for (let metric in foodItem) {
        if (/omega3\w*/.test(metric)) {
          fattyAcidSums.omega3 += foodItem[metric];
        }
        else if (/omega6\w*/.test(metric)) {
          fattyAcidSums.omega6 += foodItem[metric];
        }
        else if (/omega9\w*/.test(metric)) {
          fattyAcidSums.omega9 += foodItem[metric];
        }
      }
    }
    console.log(fattyAcidSums);

    return (
      <div>
        <div className = "flex-space-between">
          <p>FATTY ACID RATIO</p>
          <button onClick= {this.toggleDisplay}>
            {(listIsShowing) ? "-" : "+"}
          </button>
        </div>
        {(listIsShowing)
          ? <div>
              Omega 3: {this.oneDecimal(fattyAcidSums.omega3)} grams <br/>
              Omega 6: {this.oneDecimal(fattyAcidSums.omega6)} grams <br/>
              Omega 9: {this.oneDecimal(fattyAcidSums.omega9)} grams <br/>
              Your Omega 6:3 Ratio is {this.oneDecimal(fattyAcidSums.omega6/fattyAcidSums.omega3)}
            </div>
          : null
        }
     </div>
    )
  }
}

export default FattyAcidTracker

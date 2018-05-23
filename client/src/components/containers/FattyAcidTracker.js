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

    nutritionData.forEach((foodItem) => {
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
    });

    return (
      <div className="card">
        <div className="card-body">
          <div className = "flex-space-between">
            <p className="vcenter">FATTY ACID RATIO</p>
            <button onClick= {this.toggleDisplay}
                    className= "btn btn-success">
              {(listIsShowing) ? "-" : "+"}
            </button>
          </div>
          {(listIsShowing)
            ? <div className="card">
                <div className="card-body">
                  Omega 3: {this.oneDecimal(fattyAcidSums.omega3)} grams <br/>
                  Omega 6: {this.oneDecimal(fattyAcidSums.omega6)} grams <br/>
                  Omega 9: {this.oneDecimal(fattyAcidSums.omega9)} grams <br/>
                  Your Omega 6:3 Ratio is {this.oneDecimal(fattyAcidSums.omega6/fattyAcidSums.omega3)}
                </div>
              </div>
            : null
          }
        </div>
     </div>
    )
  }
}

export default FattyAcidTracker

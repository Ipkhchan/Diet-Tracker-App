import React, {Component} from 'react';

const circleCard = {
  color: "white",
  height: "115px",
  width: "115px",
  textAlign: "center",
  borderRadius: "50%"
}

class FattyAcidTracker extends Component {
  constructor(props) {
    super(props);
    this.state = {listIsShowing: false};
  }

  toggleDisplay = () => {
    (this.state.listIsShowing) ? this.setState({listIsShowing: false}) : this.setState({listIsShowing: true});
  }

  oneDecimal = (value) => {
    return Math.round(value*10)/10;
  }

  render() {
    const listIsShowing = this.state.listIsShowing;
    const nutritionData = this.props.nutritionData;
    const fattyAcidSums = {"omega3": 0, "omega6": 0, "omega9": 0}
    let fattyAcidRatio;

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

    fattyAcidRatio = fattyAcidSums.omega6/fattyAcidSums.omega3;

    return (
      <div className="card">
        <div className="card-body">
          <div className = "d-flex justify-content-between my-2">
            <p className="vcenter">FATTY ACID RATIO</p>
            <button onClick= {this.toggleDisplay}
                    className= "btn btn-success">
              {(listIsShowing) ? "-" : "+"}
            </button>
          </div>
          {(listIsShowing)
            ? <div className="card">
                <div className= "card-body">
                  <div className= "d-flex flex-column flex-sm-row justify-content-around align-items-center">
                    <div className= "d-flex flex-column justify-content-center accentColorBackground "
                         style={circleCard}>
                      <div>Omega 3</div>
                      <div>{this.oneDecimal(fattyAcidSums.omega3)} grams</div>
                    </div>
                    <div className= "d-flex flex-column justify-content-center accentColorBackground my-4 my-sm-0"
                         style={circleCard}>
                      <div>Omega 6</div>
                      <div>{this.oneDecimal(fattyAcidSums.omega6)} grams</div>
                    </div>
                    <div className= "d-flex flex-column justify-content-center accentColorBackground"
                         style={circleCard}>
                      <div>Omega 9 </div>
                      <div>{this.oneDecimal(fattyAcidSums.omega9)} grams</div>
                    </div>
                  </div>
                  <div className="alert alert-info my-4">
                    Your Omega 6:3 Ratio is {this.oneDecimal(fattyAcidRatio)}
                  </div>
                  <div className="my-2">
                    An Omega 6:3 ratio of 4:1 or less is ideal!
                  </div>
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

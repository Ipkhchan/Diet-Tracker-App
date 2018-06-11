import React, {Component} from 'react';

class DietNamePopup extends Component {
  componentDidMount() {
    document.querySelector('#dietName').focus();
  }

  render() {
    return (
      <div className="centered-popup card" style ={{"background": "white", "z-index": "1"}}>
        <div className="d-flex justify-content-end px-2 mt-2">
          <button className="btn btn-sm btn-dark" onClick={this.props.toggleShowDietNamePopup}>X</button>
        </div>
        <div className= "card-body">
          <p>Enter a Name for your Diet: </p>
          <form onSubmit= {(e) => {
            e.preventDefault();
            this.props.submitDietName();
          }}>
            <input type="text" id="dietName" className= "form-control my-2"/>
            <input type="submit" value="Enter" className="btn btn-primary float-right"/>
          </form>
        </div>
      </div>
    )
  }
}

export default DietNamePopup

// style={{"position": "absolute", "left": "90%", "fontSize": "20px"}}

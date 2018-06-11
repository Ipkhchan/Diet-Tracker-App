import React, { Component } from 'react';
import speechRecognition from "../../speechRecognition"

// let microphoneStyle = {
//   width: '30px',
//   height: 'auto'
// };



//TODO: implement NLP capabilities (ex. 1 slice of bacon)
class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {isVoiceSearching: false,
                  microphoneStyle: {
                    width: '33px',
                    height: 'auto',
                    padding: '.25rem',
                    background: 'green',
                    borderRadius: '3px'
                  }}
  }

  componentDidMount() {
    let responsiveMic =
    `@media only screen and (max-width : 576px) {
      .recordButton {
          position: fixed;
          background: green;
          top: 88%;
          left: 80%;
          z-index: 1;
          padding: .75rem !important;
          width: 50px !important;
          border-radius: 25px !important;
        }
     }`
    let styleSheet = document.styleSheets[0];
    styleSheet.insertRule(responsiveMic, styleSheet.cssRules.length)
  }

  handleVoiceSearch = (e) => {
    e.preventDefault();
    let styleSheet = document.styleSheets[0];
    let newMicrophoneStyle = Object.assign({}, this.state.microphoneStyle);

    if (!this.state.isVoiceSearching) {
      let keyframes =
      `@keyframes color {
        0% { background-color: white;}
        100% { background-color: green;}
      }`;

      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);


      newMicrophoneStyle.animationName = 'color';
      newMicrophoneStyle.animationDuration= '0.6s';
      newMicrophoneStyle.animationDirection= 'alternate';
      newMicrophoneStyle.animationIterationCount= 'infinite';
      this.setState({microphoneStyle: newMicrophoneStyle,
                     isVoiceSearching: true});
      this.props.handleVoiceSearch(() => {
        styleSheet.removeRule(styleSheet.cssRules.length-1);
        this.setState({isVoiceSearching: false});
      });
    }
    else {
      speechRecognition.stop();
      styleSheet.removeRule(styleSheet.cssRules.length-1);
      this.setState({microphoneStyle: newMicrophoneStyle,
                     isVoiceSearching: false});
    }
  }

  render() {
      return (
        <form className="my-2 form-inline d-flex justify-content-end"
              onSubmit= {(e) => {
                e.preventDefault();
                this.props.handleSearch();
              }}>
          <input placeholder={`Ex. "2 Chicken Wings and 200 grams of Kale"`}
                 id= "search"
                 className="form-control search mr-0 mr-md-2 ml-0 px-2 flex-grow-1 inline-block text-truncate"/>
          <div className= "d-flex align-items-center">
            <input type="submit" value="Search" className="btn-sm btn-success mx-2 my-3"/>
            <input type="image"
                   id= "recordButton"
                   style = {this.state.microphoneStyle}
                   onClick = {this.handleVoiceSearch}
                   src="./microphone.png"
                   className= "recordButton"/>
           </div>
        </form>
      )

  };
}

export default SearchBar

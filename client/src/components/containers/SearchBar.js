import React, { Component } from 'react';
import speechRecognition from "../../speechRecognition"
import recordAudio from "../../recordAudio"
import $ from 'jquery';

// var fs = require('fs');
// console.log("fs", fs);
//
// var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
//
// var speechToText = new SpeechToTextV1({
//     username: '2d83c66f-61d1-4177-8248-a7e94c698904',
//     password: 'YRsOo0vwCKl8',
//     url: 'https://gateway-fra.watsonplatform.net/speech-to-text/api'
//   });
//
// console.log("speechToText", speechToText);

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {isVoiceSearching: false,
                  isRecordingAudio: false,
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
          z-index: 10;
          padding: .75rem !important;
          width: 50px !important;
          border-radius: 25px !important;
        }
     }`
    let styleSheet = document.styleSheets[0];
    styleSheet.insertRule(responsiveMic, styleSheet.cssRules.length)
  }

  handleVoiceSearch = (e) => {
    console.log("SearchBar");
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

      this.props.handleVoiceSearch()
        .then(() => {
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

  // handleSuccess = (stream) => {
  //   var context = new AudioContext();
  //   var source = context.createMediaStreamSource(stream);
  //   var processor = context.createScriptProcessor(1024, 1, 1);
  //
  //   source.connect(processor);
  //   processor.connect(context.destination);
  //
  //   processor.onaudioprocess = function(e) {
  //     // Do something with the data, i.e Convert this to WAV
  //     console.log(e.inputBuffer);
  //   };
  // }

  // callWatson = (audio) => {
  //   console.log("audio", audio);
  //   $.ajax({
  //     url: '/watsonSpeechToText',
  //     method: 'POST',
  //     processData: 'false',
  //     contentType: 'false',
  //     data: audio
  //   })
  //   .then((res) => {
  //     console.log(res);
  //   })

    // const audio = fs.createWriteStream(audioUrl);

    // var recognizeParams = {
    //   audio: audioUrl,
    //   'content_type': 'audio/webm',
    //   timestamps: true,
    //   'word_alternatives_threshold': 0.9
    // };
    //
    // speechToText.recognize(recognizeParams, function(error, speechRecognitionResults) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log(JSON.stringify(speechRecognitionResults, null, 2));
    //   }
    // });
  // }

  // getUserMedia = (e) => {
  //   e.preventDefault();
  //   console.log(this.state.isRecordingAudio)
  //   if(!this.state.isRecordingAudio) {
  //     recordAudio.init()
  //       .then(() => {
  //         console.log("here");
  //         recordAudio.start();
  //       })
  //   }
  //   else if (this.state.isRecordingAudio) {
  //     recordAudio.stop()
  //       .then((audio) => {
  //         console.log("audio", audio);
  //         audio.play();
  //         this.callWatson(audio.audioBlob);
  //       });
  //   }
  //
  //   this.setState({isRecordingAudio: !this.state.isRecordingAudio});

    // console.log(navigator);

    // (async () => {
    //   const recorder = await recordAudio();
    //   recorder.start();
    //
    //   setTimeout(async () => {
    //     const audio = await recorder.stop();
    //     console.log("audio", audio);
    //     audio.play();
    //   }, 3000);
    // })();

    // recordAudio()
    //   .then((recorder) => {
    //     recorder.start();
    //   })
    //   .then((recorder) => {
    //     console.log("this", this);
    //     setTimeout(() => {
    //       recorder.stop();
    //     }, 3000)
    //   })
    //   .then((audio) => {
    //     console.log("audio", audio);
    //   })
  // }
  // bluetoothConnect = (e) => {
  //   e.preventDefault();
  //   navigator.bluetooth
  //     .requestDevice({acceptAllDevices: true})
  //     .then(device => {
  //       console.log("device", device);
  //       console.log("device.gatt", device.gatt);
  //       console.log("device.gatt.device", device.gatt.device);
  //       console.log("device.gatt.connected", device.gatt.connected);
  //       console.log("device.gatt.connect", device.gatt.connect);
  //       return device.gatt.connect();
  //     })
  //     .then(server => {
  //       console.log("server", server);
  //       // Getting Battery Service...
  //       return server.getPrimaryService('battery_service');
  //     })
  //     .then(service => {
  //       // Getting Battery Level Characteristic...
  //       return service.getCharacteristic('battery_level');
  //     })
  //     .then(characteristic => {
  //       // Reading Battery Level...
  //       return characteristic.readValue();
  //     })
  //     .then(value => {
  //       console.log('Battery percentage is ' + value.getUint8(0));
  //     })
  //     .catch((error) => {
  //       console.log("Error: ", error);
  //     })
  // }

  // <button className = "btn-sm btn-success mx-2"
  //         onClick = {this.bluetoothConnect}>B</button>

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
            {(window.SpeechRecognition || window.webkitSpeechRecognition)
              ? <input type="image"
                     alt="microphone"
                     id= "recordButton"
                     style = {this.state.microphoneStyle}
                     onClick = {this.handleVoiceSearch}
                     src="./microphone.png"
                     className= "recordButton"/>
              : null
            }
           </div>
        </form>
      )

  };
}

export default SearchBar

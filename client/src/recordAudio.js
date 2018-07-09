// const recordAudio = () => {
//   return new Promise(resolve => {
//     navigator.mediaDevices.getUserMedia({audio: true})
//       .then(stream => {
//         const mediaRecorder = new MediaRecorder(stream);
//         const audioChunks = [];
//
//         mediaRecorder.addEventListener("dataavailable", event => {
//           audioChunks.push(event.data);
//         });
//
//         const start = () => {
//           mediaRecorder.start();
//           return mediaRecorder;
//         };
//
//         const stop = () => {
//           return new Promise(resolve => {
//             mediaRecorder.addEventListener("stop", () => {
//               const audioBlob = new Blob(audioChunks);
//               const audioUrl = URL.createObjectURL(audioBlob);
//               const audio = new Audio(audioUrl);
//               const play = () => {
//                 audio.play();
//               };
//
//               resolve({ audioBlob, audioUrl, play });
//             });
//
//             mediaRecorder.stop();
//           });
//         };
//
//         resolve({ start, stop });
//       });
//   });
// };

const recordAudio = function() {
  let mediaRecorder;
  let audioChunks = [];

  return {
    init: () => {return Promise.resolve(
      navigator.mediaDevices.getUserMedia({audio: true, video: false})
        .then(stream => {
          mediaRecorder = new MediaRecorder(stream);

          mediaRecorder.addEventListener("dataavailable", event => {
            console.log(event);
            audioChunks.push(event.data);
          });
        })
      )},
    start: () => {
            mediaRecorder.start();
          },
    stop: () => {
      return new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, {type: 'audio/webm'});
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => {
            audio.play();
          };

          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });
    }
  }
}();

export default recordAudio
// var handleSuccess = function(stream) {
//   window.AudioContext = window.AudioContext || window.webkitAudioContext;
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
// };
//
// navigator.mediaDevices.getUserMedia({ audio: true, video: false })
//     .then(handleSuccess);


// {
//   "url": "https://stream.watsonplatform.net/speech-to-text/api",
//   "username": "2d83c66f-61d1-4177-8248-a7e94c698904",
//   "password": "YRsOo0vwCKl8"
// }

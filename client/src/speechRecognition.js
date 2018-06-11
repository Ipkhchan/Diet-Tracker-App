const speechRecognition = (function() {
  if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new window.SpeechRecognition();
    recognition.interimResults = false;
    console.log(recognition);

    return {listen: function() {
                      return new Promise(function(resolve, reject) {
                         recognition.addEventListener('result', e => {
                           const transcript = Array.from(e.results)
                             .map(result => result[0])
                             .map(result => result.transcript)
                             .join('');

                           console.log("transcript", transcript);
                           resolve(transcript);
                         })

                         setTimeout(() => {
                           recognition.stop()
                           reject();
                         }, 20000);
                         // recognition.addEventListener('end', recognition.start);
                         recognition.start();
                       });
                     },
             stop: function() {
                      recognition.stop();
             }
            }
    }
  else return null;
})();

export default speechRecognition

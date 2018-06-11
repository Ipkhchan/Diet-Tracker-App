const speechRecognition = (function() {
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
})();

export default speechRecognition

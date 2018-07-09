var foodDataCollection = require('../models/foodDataCollection');
var rdiCollection = require('../models/RDICollection');
// var fs = require('fs');
//
// var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
//
// var speechToText = new SpeechToTextV1({
//     username: '2d83c66f-61d1-4177-8248-a7e94c698904',
//     password: 'YRsOo0vwCKl8',
//     url: 'https://gateway-fra.watsonplatform.net/speech-to-text/api'
//   });

module.exports.get_nutritiousfood_data = function(req, res, next) {
  const deficiency = req.params.deficiency;

  foodDataCollection.find({},{'_id': 0, 'name':1, [deficiency]: 1, amount: 1}).
                     sort({[deficiency]:-1}).
                     limit(20).
                     exec(function(err,list) {
                       if(err) {next(err);}
                       res.json(list);
                     });

}

module.exports.get_RDISet = function(req, res, next) {
  let sex = req.params.sex;
  let age = req.params.age;

  if(sex === "default" && age === "default") {
    rdiCollection.findOne(function(err, RDISet) {
      if (err) {next(err);}
      res.json(RDISet);
    });
  }
  else {
    rdiCollection.
      findOne({
        sex: sex,
        "age_min": {$lte: age},
        "age_max": {$gte: age}}).
      exec(function(err,RDISet) {
       if(err) {next(err);}
       res.json(RDISet);
     });
  }

};

// module.exports.get_TextFromSpeech = function(req, res, next) {
//   console.log("REQ>BODY", req.body.audio);
//   const audio = fs.createWriteStream(req.body.audio);
//
//   var recognizeParams = {
//     audio: audio,
//     'content_type': 'audio/webm',
//     timestamps: true,
//     'word_alternatives_threshold': 0.9
//   };
//
//   speechToText.recognize(recognizeParams, function(error, speechRecognitionResults) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log(JSON.stringify(speechRecognitionResults, null, 2));
//     }
//   });
// }

const rdiCollection = require('../models/RDICollection');

module.exports.get_RDISet = function(req, res, next) {
  rdiCollection.findOne(function(err, RDISet) {
    if (err) {next(err);}
    console.log(RDISet);
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.json(RDISet);
  });
};

//TODO: Instead of deleting and recreating RDISets as an update sequence, try actually updating?
//TODO: Try implementing indexing so searches are quicker.
module.exports.save_RDISet = function(req, res, next) {
  const rdiSetSent = req.body;
  let existingRDISources = [];

  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');

  function createRDISet(message) {
    rdiCollection.create(rdiSetSent, function(err) {
      if (err) {next(err);}
      res.send(message);
    });
  };

  function updateRDISet(message) {
    rdiCollection.findOneAndRemove({source: rdiSetSent.source}, function(err) {
      if (err) {next(err);}
    })
    createRDISet(message);
  };


  rdiCollection.find({}, ['source','age_min','age_max', 'sex'], function(err, rdiSources) {
    if (err) {next(err);}
    if (rdiSources.length > 0) {
      for (let rdiSource of rdiSources) {
        if(rdiSetSent.source == rdiSource.source &&
           rdiSetSent.age_min == rdiSource.age_min &&
           rdiSetSent.age_max == rdiSource.age_max &&
           rdiSetSent.sex == rdiSource.sex) {
             updateRDISet("Updated RDISet!");
             break;
        }
        else {
          createRDISet("Created RDISet!");
          break;
        }
      }
    }
    else {
      createRDISet("Created RDISet!");
    };
  });
};

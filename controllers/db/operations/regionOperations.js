//DEPENDENCIES
const mongoose            = require('../schemas/AllSchemas');

//SCHEMA
const Region              = mongoose.model('Region');

//DB REGION OPERATIONS
const regionOperations = {
  getRegion: function(regionID) {
    return Region.findOne({
      "_id": regionID
    })
    .then( region => region )
    .catch( err => err);
  }
}

//EXPORT
module.exports = regionOperations;

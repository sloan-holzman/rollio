const moment = require('moment');

const { client: redisClient, pub } = require('./../../../redis');
const { io } = require('../../../sockets/index');
const { REDIS_TWITTER_CHANNEL, SERVER_ID } = require('../../../../config');
const logger = require('../../../log/index')('db/mongo/operations/shared-ops');
const mongoose = require('../mongoose/index');

// SCHEMA
const Location = mongoose.model('Location');


// Gets all locations for a particular vendor that are currently active or will be in the future
const getVendorLocations = async vendorID => Location.find({ vendorID, endDate: { $gte: new Date() } }).sort([['startDate', -1]]);

const updateConflictingLocationDates = async (existingLocation, startDate, endDate) => {
  const newStartDate = moment(startDate);
  const newEndDate = moment(endDate);
  const { _id, startDate: existingStartDate, endDate: existingEndDate } = existingLocation;
  const existingStartsBeforeNewStart = moment(existingStartDate).isSameOrBefore(newStartDate);
  const existingEndsBeforeNewEnd = moment(existingEndDate).isSameOrBefore(newEndDate);
  let update = {};
  // 1. if loc E start date is before loc N start date and loc E end date is before loc N end date,
  // set loc E end date to loc N start date
  if (existingStartsBeforeNewStart && existingEndsBeforeNewEnd) {
    update = { endDate: startDate };
  // 2. if local E start date is before loc N end date and loc E end date is after loc N end date,
  // set local E start date to loc N end date
  } else if (!existingEndsBeforeNewEnd) {
    update = { startDate: endDate };
  // 3. if local E start date is after loc N's start date and local E end date is before loc N end date,
  // then nullify it (overridden = true);
  } else {
    update = { overridden: true };
  }
  return Location.findOneAndUpdate({ _id }, update);
};

const correctLocationConflicts = async (locationData) => {
  const {
    vendorID,
    startDate = new Date(),
    endDate = moment().endOf('day').toDate(),
    truckNum = 1,
    _id,
    overridden = false,
  } = locationData;
  // we do not have to worry about conflicts for overridden tweets
  if (overridden) {
    return [];
  }
  // no need to correct the location itself
  const excludeCurrentLocation = _id ? { _id: { $ne: _id } } : {};
  const conflictingTruckLocations = await Location.find({
    ...excludeCurrentLocation, vendorID, startDate: { $lte: endDate }, endDate: { $gte: startDate }, truckNum, overridden: false,
  });
  if (conflictingTruckLocations.length) {
    await Promise.all(conflictingTruckLocations.map(existingLocation => updateConflictingLocationDates(existingLocation, startDate, endDate)));
  }
};

// Creates a new location and ensures that each truck does not have two locations at once
const createLocationAndCorrectConflicts = async (locationData) => {
  const { coordinates } = locationData;
  const newLocation = await Location.create({ ...locationData, coordinates: Array.isArray(coordinates) ? { lat: coordinates[0], long: coordinates[1] } : coordinates });
  await correctLocationConflicts(newLocation);
  return newLocation;
};

const editLocationAndCorrectConflicts = async (locationID, locationData) => {
  const updatedLocation = await Location.findOneAndUpdate({ _id: locationID }, { $set: locationData }, { new: true }).lean();
  await correctLocationConflicts(updatedLocation);
  return updatedLocation;
};

const clearVendorCache = async ({ regionID, vendorID }) => {
  try {
    await redisClient.hdelAsync('vendor', `q::method::GET::path::/${regionID}/object`);
    await redisClient.hdelAsync('vendor', `q::method::GET::path::/${regionID}/${vendorID}`);
  } catch (err) {
    logger.error(err);
  }
};


const publishLocationUpdate = async ({
  updatedTweet, newLocations, vendorID, twitterID, regionID,
}) => {
  let tweet = null;
  if (updatedTweet) {
    const { text, tweetID, date } = updatedTweet;
    tweet = {
      text,
      tweetID,
      twitterID,
      date,
    };
  }
  const allLocations = await getVendorLocations(vendorID);
  const twitterData = {
    tweet, newLocations, allLocations, vendorID, regionID,
  };
  try {
    pub.publish(REDIS_TWITTER_CHANNEL, JSON.stringify({ ...twitterData, messageType: 'NEW_LOCATIONS', serverID: SERVER_ID }));
    io.sockets.emit('NEW_LOCATIONS', twitterData);
  } catch (err) {
    logger.error(err);
  }
};

const publishLocationUpdateAndClearCache = async ({
  updatedTweet, newLocations, vendorID, twitterID, regionID,
}) => {
  await publishLocationUpdate({
    updatedTweet, newLocations, vendorID, twitterID, regionID,
  });
  return clearVendorCache({ regionID, vendorID });
};


module.exports = {
  publishLocationUpdateAndClearCache,
  createLocationAndCorrectConflicts,
  correctLocationConflicts,
  getVendorLocations,
  editLocationAndCorrectConflicts,
  clearVendorCache,
};

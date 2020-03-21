/* eslint-disable no-console */
// DEPENDENCIES
const axios = require('axios');
const config = require('../../config');
const logger = require('../log/index');

module.exports = {
  async parse(text) {
    return axios.post(`${config.NLP_API}/parse-location`, { text })
      .then(res => res.data)
      .catch((err) => {
        console.log(err);
        logger.error(`NLP API Failure: ${err}`);
        throw err;
      });
  },
};

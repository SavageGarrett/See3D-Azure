const axios = require('axios');
const qs = require('qs');
const { STRAPI_URL } = require('./constants');

exports.getStrapiResource = async (path, params, queryString) => {
  let config = {
    method: 'get',
    url: `${STRAPI_URL}${path}?${queryString}`,
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
    params: params,
  };

  return await axios.request(config);
};

exports.constructQueryString = (queryObject) => {
  return qs.stringify(queryObject, {
    encode: false,
    arrayFormat: 'brackets',
    allowDots: true,
  });
};

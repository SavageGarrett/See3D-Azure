const axios = require('axios');
const { STRAPI_URL } = require('./constants');

exports.getStrapiResource = async (path, params) => {
  let config = {
    method: 'get',
    url: `${STRAPI_URL}${path}?populate=*`,
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
    params: params,
  };

  return await axios.request(config);
};

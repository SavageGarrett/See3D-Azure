exports.STRAPI_URL =
  process.env.NODE_ENV === 'production'
    ? `https://localhost:${process.env.STRAPI_PORT}`
    : `http://localhost:${process.env.STRAPI_PORT}`;

exports.GALLERY_PHOTOS = '/api/gallery-photos';

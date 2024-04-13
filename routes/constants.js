exports.STRAPI_URL =
  process.env.NODE_ENV === 'production'
    ? `https://localhost:${process.env.STRAPI_PORT}`
    : `http://localhost:${process.env.STRAPI_PORT}`;

exports.DEFAULT_QUERY_STRING = 'populate=*';

exports.INDEX_PAGE = '/api/index-page';
exports.BOARD_PAGE = '/api/board-page';

exports.GALLERY_PHOTOS = '/api/gallery-photos';
exports.BLOG_ARTICLES = '/api/blogs';

/**
 * Environment Constants
 */
exports.STRAPI_URL =
  process.env.NODE_ENV === 'production'
    ? `https://localhost:${process.env.STRAPI_PORT}`
    : `http://localhost:${process.env.STRAPI_PORT}`;

/**
 * Default Value Constants
 */
exports.DEFAULT_QUERY_STRING = 'populate=*';

/**
 * Page API Constants
 */
exports.INDEX_PAGE = '/api/index-page';
exports.BOARD_PAGE = '/api/board-page';
exports.TEAM_PAGE = '/api/team-page';

/**
 * Section API Constants
 */
exports.GALLERY_PHOTOS = '/api/gallery-photos';
exports.BLOG_ARTICLES = '/api/blogs';

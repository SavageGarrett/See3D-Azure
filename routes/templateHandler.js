const dayjs = require('dayjs');
const {
  STRAPI_URL,
  GALLERY_PHOTOS,
  INDEX_PAGE,
  BLOG_ARTICLES,
  BOARD_PAGE,
  DEFAULT_QUERY_STRING,
  TEAM_PAGE,
  GET_INVOLVED_PAGE,
} = require('./constants');
const { getStrapiResource, constructQueryString } = require('./util');

// Alt text of 94 images with their respective alt text
// let alt_text = {
//     "Alligator 1.jpg": "Alligator 3D model",
//     "Brainstem 1.jpg": "Brainstem with Braille",
//     "Butterfly Chrysalis.jpg": "Butterfly Chrysalis 3D Print",
//     "Butterfly Life Cycle.jpg": "Stages of Butterfly lifecycle 3D Print",
//     "CABVI Logo 2.jpg": "3D Logo raised of CABVI",
//     "COVID 2.jpg": "3D model of COVID-19",
//     "Cassandra Castle Brighter.jpg": "Cinderella Castle 3D model",
//     "Caterpillar Articulated 3.jpg": "Caterpillar 3D Print",
//     "Caterpillar Half 1.jpg": "Caterpillar 3D Print",
//     "Caterpillar Half 2.jpg": "Caterpillar 3D Print",
//     "Chicken Footprint.jpg": "Chicken Footprint imprint 3D Print",
//     "Chinese Dragon.jpg": "Chinese Dragon 3D Print",
//     "Chloroplast.jpg": "Chloroplast 3D Print",
//     "Chromosomes 4.jpg": "Chromosomes 3D Print",
//     "Constellation Centaurus.jpg": "Constellation Centaurus 3D Print",
//     "Constellation Dome.jpg": "Constellations on a dome",
//     "Curiosity Rover.jpg": "Curiosity Rover 3D Print",
//     "DDI I-44 and MO-13 #2.jpg": "Double Diamond Intersection imprint",
//     "DNA Green.jpg": "DNA 3D Print",
//     "DSCF1742.jpg": "Castle 3D Print",
//     "DSCF1743.jpg": "Castle 3D Print",
//     "DSCF1754.jpg": "Brain 3D Print",
//     "DSCF1790.jpg": "Biology 3D Print",
//     "DSCF1794.jpg": "Cell Imprint 3D Print",
//     "DSCF1806.jpg": "Ohio State Stadium 3D Print",
//     "DSCF1815.jpg": "Office floorplan 3D print ",
//     "Dodecahedron.jpg": "Dodecahedron 3D print",
//     "EFEA1D04-BD01-4551-A6D1-1B6E12624170.jpg": "Various Maps 3D print",
//     "Eye Model Cropped.jpg": "Eye 3D print",
//     "Fish in Anemone.jpg": "Fish in Anemone 3D print",
//     "IMG_1047_Facetune_14-05-2020-12-06-21.jpg": "Train 3D Print",
//     "IMG_1210.jpg": "Topographical USA 3D Print",
//     "IMG_1212.jpg": "US Capitol 3D Print",
//     "IMG_1466_Facetune_08-06-2020-18-18-52.jpg": "Galaxy 3D Print",
//     "IMG_1469.jpg": "Moon Topography 3D Print",
//     "JWST.jpg": "Sattelite 3D Print",
//     "K-9 Garrett 2.jpg": "K9 Robot Dog 3D Print",
//     "Klein Bottle Photo.jpg": "Klein Bottle 3D Print",
//     "Lighthouse.jpg": "Lighthouse 3D Print",
//     "MakerX Brailler.jpg": "MakerX Brailler",
//     "MakerX Models.jpg": "MakerX 3D Models",
//     "MakerX Table 2.jpg": "MakerX Table ",
//     "Milky Way Side 5.jpg": "Milky Way Side 3D Print",
//     "Mt. Vesuvius.jpg": "Mt. Vesuvius 3D Print",
//     "Orlando International Airport.jpg": "Orlando International Airport 3D Print",
//     "Party Models.jpg": "Party Models 3D Print",
//     "Planets.jpg": "Planets 3D Print",
//     "Platonic Shapes.jpg": "Platonic Shapes 3D Print",
//     "Protein Yellow Bigger.jpg": "Protein 3D Print",
//     "Roof 1.jpg": "Roof 3D Print",
//     "Roof 6.jpg": "Roof 3D Print",
//     "Rose Model Full.jpg": "Rose 3D Print",
//     "Rose Model Top.jpg": "Rose 3D Print",
//     "Rose.jpg": "Rose 3D Print",
//     "Rosen Shingle Creek Hotel big site of 2018 Convention.jpg": "Rosen Shingle Creek Hotel 3D Print",
//     "Sea Creatures Blue Seahorse Fish Frog Whaleshark Toad.jpg": "Sea Creature 3D Prints",
//     "See3D banner.jpg": "See3D Banner",
//     "Snowman Crater.jpg": "Snowman Crater 3D Print",
//     "Statue of Liberty 2.jpg": "Statue of Liberty 3D Print",
//     "Team Photo.png": "See3D Team",
//     "TEDx 4.png": "Caroline TEDx Talk",
//     "TEDx far 1.png": "Caroline TEDx Talk",
//     "Taj Mahal.jpg": "Taj Mahal 3D Print",
//     "Tesseract.jpg": "Tesseract 3D Print",
//     "USA Flag Model.jpg": "US Flag 3D Print",
//     "USA Precipitation Map.jpg": "US Precipitation Map 3D Print",
//     "USA Topographical blue 2.jpg": "US Topographical 3D Print",
//     "USA Topographical.jpg": "US Topographical 3D Print",
//     "UT Tower.jpg": "UT Tower 3D Print",
//     "Water Drop 2.jpg": "Water Drop 3D Print",
//     "butterfly eggs on leaf.jpg": "Monarch Eggs on Leaf 3D Print",
//     "butterfly monarch egg.jpg": "Monarch Egg 3D Print",
//     "iPhone Jamie 1.jpg": "iPhone 3D Print",
//     "iPhone Jamie updated volume.jpg": "iPhone 3D Print"
// }

const template_handler = {
  /**
   * Serves index page
   *
   * @param res response object to send page render
   */
  indexPage: async (res) => {
    const { data } = await getStrapiResource(
      INDEX_PAGE,
      {},
      DEFAULT_QUERY_STRING
    );
    res.render('index', data.data.attributes);
  },

  /**
   * Serves index page
   *
   * @param res response object to send page render
   */
  getInvolvedPage: async (res) => {
    const { data } = await getStrapiResource(
      GET_INVOLVED_PAGE,
      {},
      DEFAULT_QUERY_STRING
    );

    res.render('get_involved', data.data.attributes);
  },

  /**
   * Serves board members page
   *
   * @param res response object to send page render
   */
  boardPage: async (res) => {
    const queryString = constructQueryString({
      populate: ['teamMembers', 'teamMembers.profilePhoto'],
    });

    const { data } = await getStrapiResource(BOARD_PAGE, {}, queryString);

    res.render('board_members', {
      ...data.data.attributes,
      strapi_url: STRAPI_URL,
    });
  },

  /**
   * Serves team members page
   *
   * @param res response object to send page render
   */
  teamPage: async (res) => {
    const queryString = constructQueryString({
      populate: ['teamMembers', 'teamMembers.profilePhoto'],
    });

    const { data } = await getStrapiResource(TEAM_PAGE, {}, queryString);

    res.render('team', {
      ...data.data.attributes,
      strapi_url: STRAPI_URL,
    });
  },

  /**
   * Serves gallery pages
   *
   * @param res response object to send page render
   * @param pagenum the page number to serve
   */
  gallery: async (res, pagenum) => {
    let pageNumber = parseInt(pagenum);
    if (isNaN(pageNumber)) pageNumber = 1;

    const items_per_page = 12;

    try {
      const { data } = await getStrapiResource(
        GALLERY_PHOTOS,
        {
          'pagination[page]': pageNumber.toString(),
          'pagination[pageSize]': items_per_page,
        },
        DEFAULT_QUERY_STRING
      );
      const gallery_data = data.data.map((val) => {
        const imageFormats = val.attributes.image.data.attributes.formats;

        let selectedUrl = '';

        // Prioritize selection based on the best available size, with 'large' being the maximum desired size
        if (imageFormats.large) {
          selectedUrl = imageFormats.large.url;
        } else if (imageFormats.medium) {
          selectedUrl = imageFormats.medium.url;
        } else if (imageFormats.small) {
          selectedUrl = imageFormats.small.url;
        } else if (imageFormats.thumbnail) {
          selectedUrl = imageFormats.thumbnail.url;
        }

        return {
          url: `${STRAPI_URL}${selectedUrl}`,
          alt_text: val.attributes.image.data.attributes.alternativeText,
        };
      });

      const { pageCount } = data.meta.pagination;

      if (pageNumber > pageCount) res.redirect(`/gallery?p=${pageCount}`);

      // Declare arrays for template output
      let number_active = [],
        number = [],
        arrow_disp = [];
      let plus_arrow, minus_arrow;

      // Serve pagination via arrays (ignores edge cases of 3 or less pages)
      if (pageNumber == 1) {
        // Handle first page
        number = [pageNumber, pageNumber + 1, pageNumber + 2];
        number_active = ['active', '', ''];
        arrow_disp = ['none', 'block']; // Sets display property for left/right arrow
        plus_arrow = 2;
        minus_arrow = 1;
      } else if (pageNumber == pageCount) {
        // Handle last page
        number = [pageNumber - 2, pageNumber - 1, pageNumber];
        number_active = ['', '', 'active'];
        arrow_disp = ['block', 'none'];
        plus_arrow = 0;
        minus_arrow = pageNumber - 1;
      } else {
        // Handle any other page
        number = [pageNumber - 1, pageNumber, pageNumber + 1];
        number_active = ['', 'active', ''];
        arrow_disp = ['block', 'block'];
        plus_arrow = pageNumber + 1;
        minus_arrow = pageNumber - 1;
      }

      res.render('gallery', {
        gallery_data,
        number_active,
        number,
        arrow_disp,
        plus_arrow,
        minus_arrow,
      });
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * Serves list of blog entries and single blog pages
   *
   * @param res response object to send page render
   * @param query filtered options
   */
  blog: async (res, query) => {
    const { data } = await getStrapiResource(
      BLOG_ARTICLES,
      {
        sort: ['date:desc'],
      },
      DEFAULT_QUERY_STRING
    );

    const posts = data.data.map((val) => {
      const post = { ...val };
      post.attributes.day = dayjs(post.attributes.date).date();
      post.attributes.month = dayjs(post.attributes.date).format('MMM');

      return post;
    });

    if (query.id) {
      const post = posts.find((val) => {
        return val.id == query.id;
      });

      res.render('blog-single', {
        post,
        strapi_url: STRAPI_URL,
      });
    } else {
      res.render('blog', {
        posts,
        strapi_url: STRAPI_URL,
      });
    }
  },
};

module.exports = template_handler;

const axios = require('axios');
const cheerio = require('cheerio');

const getPostTitles = async () => {
	try {
		const { data } = await axios.get(
			'https://www.thingiverse.com/see3dprinting/collections/math'
		);
		const $ = cheerio.load(data);
		const postTitles = [];

		$('#main > div > div.results-container.item-container.top_content > div').each((_idx, el) => {
			const postTitle = $(el).text()
			postTitles.push(postTitle)
		});

		return postTitles;
	} catch (error) {
		throw error;
	}
};

getPostTitles()
.then((postTitles) => console.log(postTitles));
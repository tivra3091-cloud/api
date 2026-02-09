const axios = require('axios');
const cheerio = require('cheerio');

exports.scraping = async (url) => {
    const response = await axios.get(url);
    // console.log(response,"responce==");
    
    return response?.data || null

}
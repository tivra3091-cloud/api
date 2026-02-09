const axios = require('axios');
const cheerio = require('cheerio');

exports.scraping = async (url) => {
    try {
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            }
        });
        
        return response?.data || null;
    } catch (error) {
        console.log('Service Error:', error.response?.status, error.response?.statusText, error.message);
        throw new Error(error.response?.data?.message || error.message || 'API request failed');
    }
}

// Scraping for HTML content (for scorecard iframe)
exports.scrapingHTML = async (url) => {
    try {
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'User-Agent': 'Mozilla/5.0'
            },
            responseType: 'text'
        });
        
        return response?.data || null;
    } catch (error) {
        console.log('Service Error (HTML):', error.response?.status, error.response?.statusText, error.message);
        throw new Error(error.response?.data?.message || error.message || 'API request failed');
    }
}
const service = require("../service/service");

// Match List API - using new matchDetails endpoint
exports.matchList = async (req, res, next) => {
    try {
        const sportId = req?.params?.sportId || req?.query?.sportId;
        
        // New API: https://central.zplay1.in/pb/api/v1/events/matchDetails/
        // If sportId is provided, append it to the URL
        let url = 'https://central.zplay1.in/pb/api/v1/events/matchDetails/';
        if (sportId) {
            url += sportId;
        }

        console.log('Fetching from URL:', url);
        const matchData = await service.scraping(url);
        
        if (!matchData) {
            return res.status(404).json({ 
                success: false,
                error: 'No data received from API' 
            });
        }

        return res.status(200).json({ 
            success: true,
            message: 'Match list fetched successfully', 
            data: matchData 
        });
    } catch (error) {
        console.log('Error in matchList:', error.message);
        const statusCode = error.message.includes('404') ? 404 : 
                          error.message.includes('400') ? 400 : 500;
        return res.status(statusCode).json({ 
            success: false,
            error: error.message || 'Failed to fetch match list' 
        });
    }
}
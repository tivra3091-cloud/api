const service = require("../service/service");

// Match List API - using new matchDetails endpoint
exports.matchList = async (req, res, next) => {
    try {
        const { sportId } = req?.params || req?.query || {};
        
        // New API: https://central.zplay1.in/pb/api/v1/events/matchDetails/
        // If sportId is provided, append it to the URL
        let url = 'https://central.zplay1.in/pb/api/v1/events/matchDetails/';
        if (sportId) {
            url += sportId;
        }

        const matchData = await service.scraping(url);
        return res.status(200).json({ 
            success: true,
            message: 'Match list fetched successfully', 
            data: matchData 
        });
    } catch (error) {
        console.log('Error in matchList:', error);
        return res.status(400).json({ 
            success: false,
            error: error.message || 'Failed to fetch match list' 
        });
    }
}
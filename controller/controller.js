const service = require("../service/service");

// Match List API - using new matchDetails endpoint
exports.matchList = async (req, res, next) => {
    let url = '';
    try {
        // Get sportId from params or query
        const sportId = req?.params?.sportId || req?.query?.sportId;
        
        // New API: https://central.zplay1.in/pb/api/v1/events/matchDetails/
        // Try different formats based on whether sportId is provided
        url = 'https://central.zplay1.in/pb/api/v1/events/matchDetails/';
        
        // If sportId is provided, try appending it or use as query parameter
        if (sportId) {
            // First try: append sportId to URL
            url = `https://central.zplay1.in/pb/api/v1/events/matchDetails/${sportId}`;
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
        console.log('Error in matchList:', error.message, 'URL:', url);
        
        // If 404 error with sportId, try without sportId as fallback
        if (error.message.includes('Not found') || error.message.includes('404')) {
            const sportId = req?.params?.sportId || req?.query?.sportId;
            if (sportId) {
                // Try without sportId as fallback
                try {
                    const fallbackUrl = 'https://central.zplay1.in/pb/api/v1/events/matchDetails/';
                    console.log('Trying fallback URL:', fallbackUrl);
                    const fallbackData = await service.scraping(fallbackUrl);
                    if (fallbackData) {
                        return res.status(200).json({ 
                            success: true,
                            message: 'Match list fetched successfully', 
                            data: fallbackData 
                        });
                    }
                } catch (fallbackError) {
                    console.log('Fallback also failed:', fallbackError.message);
                }
            }
            return res.status(404).json({ 
                success: false,
                error: 'Match data not found' 
            });
        }
        
        const statusCode = error.message.includes('400') ? 400 : 500;
        return res.status(statusCode).json({ 
            success: false,
            error: error.message || 'Failed to fetch match list' 
        });
    }
}
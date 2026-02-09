const service = require("../service/service");

// Match List API - using matches endpoint
exports.matchList = async (req, res, next) => {
    let url = '';
    try {
        // Get sportId from params or query
        const sportId = req?.params?.sportId || req?.query?.sportId;
        
        // API: https://central.zplay1.in/pb/api/v1/events/matches/{sportId}
        // sportId is required for this endpoint
        if (!sportId) {
            return res.status(400).json({ 
                success: false,
                error: 'Sport ID is required. Use /api/v1/matches/{sportId}' 
            });
        }
        
        url = `https://central.zplay1.in/pb/api/v1/events/matches/${sportId}`;

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
        
        if (error.message.includes('Not found') || error.message.includes('404')) {
            return res.status(404).json({ 
                success: false,
                error: 'Match data not found for the given sport ID' 
            });
        }
        
        const statusCode = error.message.includes('400') ? 400 : 500;
        return res.status(statusCode).json({ 
            success: false,
            error: error.message || 'Failed to fetch match list' 
        });
    }
}

// Match Details API - using matchDetails endpoint
exports.matchDetails = async (req, res, next) => {
    let url = '';
    try {
        // Get matchId from params or query
        const matchId = req?.params?.matchId || req?.query?.matchId;
        
        // API: https://central.zplay1.in/pb/api/v1/events/matchDetails/{matchId}
        // matchId is required for this endpoint
        if (!matchId) {
            return res.status(400).json({ 
                success: false,
                error: 'Match ID is required. Use /api/v1/match-details/{matchId}' 
            });
        }
        
        url = `https://central.zplay1.in/pb/api/v1/events/matchDetails/${matchId}`;

        console.log('Fetching match details from URL:', url);
        const matchData = await service.scraping(url);
        
        if (!matchData) {
            return res.status(404).json({ 
                success: false,
                error: 'No data received from API' 
            });
        }

        return res.status(200).json({ 
            success: true,
            message: 'Match details fetched successfully', 
            data: matchData 
        });
    } catch (error) {
        console.log('Error in matchDetails:', error.message, 'URL:', url);
        
        if (error.message.includes('Not found') || error.message.includes('404')) {
            return res.status(404).json({ 
                success: false,
                error: 'Match details not found for the given match ID' 
            });
        }
        
        const statusCode = error.message.includes('400') ? 400 : 500;
        return res.status(statusCode).json({ 
            success: false,
            error: error.message || 'Failed to fetch match details' 
        });
    }
}
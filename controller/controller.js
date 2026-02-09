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

// Scorecard API - using scorecard endpoint (returns HTML for iframe)
exports.scorecard = async (req, res, next) => {
    let url = '';
    try {
        // Get sportId, eventId, and sportRadarId from params or query
        const sportId = req?.params?.sportId || req?.query?.sportId;
        const eventId = req?.params?.eventId || req?.query?.eventId;
        const sportRadarId = req?.params?.sportRadarId || req?.query?.sportRadarId;
        
        // API: https://scorecard.oddstrad.com/get-scorecard-iframe/{sportId}/{eventId}/{sportRadarId}
        // All three parameters are required
        if (!sportId || !eventId || !sportRadarId) {
            return res.status(400).send(`
                <html>
                    <body>
                        <h1>Error: Missing Parameters</h1>
                        <p>Sport ID, Event ID, and Sport Radar ID are required.</p>
                        <p>Use: /api/v1/scorecard/{sportId}/{eventId}/{sportRadarId}</p>
                    </body>
                </html>
            `);
        }
        
        url = `https://scorecard.oddstrad.com/get-scorecard-iframe/${sportId}/${eventId}/${sportRadarId}`;

        console.log('Fetching scorecard HTML from URL:', url);
        const scorecardHTML = await service.scrapingHTML(url);
        
        if (!scorecardHTML) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.status(404).send(`
                <html>
                    <body>
                        <h1>Error: No Data Received</h1>
                        <p>Scorecard data not found.</p>
                    </body>
                </html>
            `);
        }

        // Check if response contains license expiration error
        const htmlString = scorecardHTML.toString();
        if (htmlString.includes('License has expired') || htmlString.includes('license has expired') || htmlString.includes('License expired')) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.status(403).send(`
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                text-align: center;
                                padding: 50px;
                                background-color: #f5f5f5;
                            }
                            .error-container {
                                background: white;
                                padding: 30px;
                                border-radius: 10px;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                                max-width: 500px;
                                margin: 0 auto;
                            }
                            h1 {
                                color: #d32f2f;
                                margin-bottom: 20px;
                            }
                            p {
                                color: #666;
                                line-height: 1.6;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="error-container">
                            <h1>License Expired</h1>
                            <p>The scorecard service license has expired. Please contact the administrator to renew the license.</p>
                        </div>
                    </body>
                </html>
            `);
        }

        // Return HTML content directly with proper headers for iframe
        // Set headers before sending to ensure HTML format
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        return res.status(200).send(htmlString);
    } catch (error) {
        console.log('Error in scorecard:', error.message, 'URL:', url);
        
        // Return HTML error page
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        
        // Check for license expiration in error message
        if (error.message.includes('License has expired') || error.message.includes('license has expired') || error.message.includes('License expired')) {
            return res.status(403).send(`
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                text-align: center;
                                padding: 50px;
                                background-color: #f5f5f5;
                            }
                            .error-container {
                                background: white;
                                padding: 30px;
                                border-radius: 10px;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                                max-width: 500px;
                                margin: 0 auto;
                            }
                            h1 {
                                color: #d32f2f;
                                margin-bottom: 20px;
                            }
                            p {
                                color: #666;
                                line-height: 1.6;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="error-container">
                            <h1>License Expired</h1>
                            <p>The scorecard service license has expired. Please contact the administrator to renew the license.</p>
                        </div>
                    </body>
                </html>
            `);
        }
        
        if (error.message.includes('Not found') || error.message.includes('404')) {
            return res.status(404).send(`
                <html>
                    <body>
                        <h1>Error: Scorecard Not Found</h1>
                        <p>Scorecard not found for the given parameters.</p>
                    </body>
                </html>
            `);
        }
        
        const statusCode = error.message.includes('400') ? 400 : 500;
        return res.status(statusCode).send(`
            <html>
                <body>
                    <h1>Error: ${statusCode}</h1>
                    <p>${error.message || 'Failed to fetch scorecard'}</p>
                </body>
            </html>
        `);
    }
}
import mongoose from 'mongoose';

const isAuthenticated = (req, res, next) => {
    try {
        // Get user ID from the request body, params, or query
        let userId = req.params.id || req.query.userId;
        
        // Check if userId exists and is a valid ObjectId
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            req.id = userId;
        } else {
            // If we don't have a valid userId, check if this is a request that needs one
            const needsUserId = req.originalUrl.includes('/message/') || 
                               req.originalUrl.includes('/conversations/');
            
            if (needsUserId) {
                // For endpoints that need a valid user ID, return an error
                return res.status(400).json({ 
                    message: "A valid user ID is required for this operation" 
                });
            } else {
                // For other endpoints, allow the request to proceed
                // This is for routes like /api/v1/user/register or /api/v1/user/login
                console.log("Non-authenticated route accessed");
            }
        }
        
        next();
    } catch (error) {
        console.error("Error in isAuthenticated middleware:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export default isAuthenticated;

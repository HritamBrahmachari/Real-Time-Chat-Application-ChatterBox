import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
    // Skip authentication check for OPTIONS requests (CORS preflight)
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        // Check for token in various places - simplified approach
        const token = req.cookies.token || 
                     (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
                      ? req.headers.authorization.split(' ')[1] 
                      : null);
        
        if (!token) {
            return res.status(401).json({ message: "Please login to access this resource" });
        }
        
        try {
            // Simple token verification
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.id = decoded.userId;
            next();
        } catch (jwtError) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Authentication failed" });
    }
};

export default isAuthenticated;

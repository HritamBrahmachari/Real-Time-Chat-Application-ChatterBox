import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
    try {
        // First check the Authorization header (for API clients)
        const authHeader = req.headers.authorization;
        let token;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            // If no Authorization header, check cookies (for browser clients)
            token = req.cookies.token;
        }
        
        if (!token) {
            return res.status(401).json({ message: "Please login to access this resource" });
        }
        
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decode) {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        req.id = decode.userId;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Authentication failed" });
    }
};

export default isAuthenticated;

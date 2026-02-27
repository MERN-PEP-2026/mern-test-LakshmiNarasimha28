import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let token = null;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized - No token provided' 
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: 'Unauthorized - Invalid or expired token' 
        });
    }
};

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                });
            }

            if (!req.user.role) {
                return res.status(401).json({
                    success: false,
                    message: 'User role not found',
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Required role: ${allowedRoles.join(', ')}`,
                });
            }

            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Authorization error',
            });
        }
    };
};

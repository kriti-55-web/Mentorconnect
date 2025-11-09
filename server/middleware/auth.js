const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Role-based authorization middleware
const requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.userType)) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
};

module.exports = { authenticateToken, requireRole, JWT_SECRET };


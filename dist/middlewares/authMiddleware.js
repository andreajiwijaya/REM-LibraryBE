"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: 'Authorization header missing' });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Token missing' });
        return;
    }
    const payload = (0, jwt_1.verifyToken)(token);
    if (!payload) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
    req.user = { id: payload.userId, role: payload.role };
    next();
};
exports.authMiddleware = authMiddleware;

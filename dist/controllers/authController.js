"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const authService = __importStar(require("../services/authService"));
const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        // Validasi role jika dikirim
        if (role && role !== 'user' && role !== 'admin') {
            res.status(400).json({ message: 'Invalid role. Must be "user" or "admin"' });
            return;
        }
        const newUser = await authService.registerUser({ username, email, password, role });
        res.status(201).json({
            message: 'User registered successfully',
            userId: newUser.id,
            role: newUser.role,
        });
    }
    catch (error) {
        if (error.message === 'Username already exists' ||
            error.message === 'Email already exists') {
            res.status(400).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { token, user } = await authService.loginUser(req.body);
        res.json({ token, user });
    }
    catch (error) {
        if (error.message === 'Invalid credentials') {
            res.status(400).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.login = login;

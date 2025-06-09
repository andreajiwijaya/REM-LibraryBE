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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userService = __importStar(require("../services/userService"));
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const result = await userService.getAllUsers({ page, limit, search });
        const sanitizedUsers = result.data.map((user) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        }));
        res.json({
            data: sanitizedUsers,
            total: result.total,
            page: result.page,
            limit: result.limit,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get users', error: error.message });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }
        const user = await userService.getUserById(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const { id: userId, username, email, role } = user;
        res.json({ id: userId, username, email, role });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get user', error: error.message });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!password || password.trim() === '') {
            res.status(400).json({ message: 'Password is required' });
            return;
        }
        if (!email || email.trim() === '') {
            res.status(400).json({ message: 'Email is required' });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await userService.createUser({
            username,
            email,
            password: hashedPassword,
            role,
        });
        const { id } = newUser;
        res.status(201).json({ id, username, email, role });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }
        const updatedUser = await userService.updateUser(id, req.body);
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const { id: userId, username, email, role } = updatedUser;
        res.json({ id: userId, username, email, role });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }
        const deleted = await userService.deleteUser(id);
        if (!deleted) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};
exports.deleteUser = deleteUser;
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const userId = Number(req.user.id);
        if (isNaN(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }
        // Panggil service untuk ambil data user berdasarkan userId
        const user = await userService.getUserById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const { id, username, email, role } = user;
        res.json({ id, username, email, role });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get current user', error: error.message });
    }
};
exports.getCurrentUser = getCurrentUser;

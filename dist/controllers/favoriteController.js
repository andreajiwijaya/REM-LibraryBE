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
exports.getFavoriteCountByBook = exports.checkFavoriteStatus = exports.deleteFavorite = exports.createFavorite = exports.getUserFavorites = void 0;
const favoriteService = __importStar(require("../services/favoriteService"));
const getUserFavorites = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await favoriteService.getUserFavorites(userId, { page, limit });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get user favorites', error: error.message });
    }
};
exports.getUserFavorites = getUserFavorites;
const createFavorite = async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        const favorite = await favoriteService.createFavorite({ userId, bookId });
        res.status(201).json(favorite);
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Failed to create favorite' });
    }
};
exports.createFavorite = createFavorite;
const deleteFavorite = async (req, res) => {
    try {
        const deleted = await favoriteService.deleteFavorite(parseInt(req.params.id));
        if (!deleted) {
            res.status(404).json({ message: 'Favorite not found' });
            return;
        }
        res.json({ message: 'Favorite deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete favorite', error: error.message });
    }
};
exports.deleteFavorite = deleteFavorite;
const checkFavoriteStatus = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const bookId = Number(req.params.bookId);
        const isFavorited = await favoriteService.isBookFavoritedByUser(userId, bookId);
        res.json({ isFavorited });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to check favorite status', error: error.message });
    }
};
exports.checkFavoriteStatus = checkFavoriteStatus;
const getFavoriteCountByBook = async (req, res) => {
    try {
        const bookId = Number(req.params.bookId);
        const count = await favoriteService.countFavoritesByBook(bookId);
        res.json({ count });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get favorite count', error: error.message });
    }
};
exports.getFavoriteCountByBook = getFavoriteCountByBook;

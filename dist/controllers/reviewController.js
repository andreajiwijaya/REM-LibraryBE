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
exports.deleteReview = exports.updateReview = exports.createReview = exports.getReviewById = exports.getReviewsByBookId = exports.getAllReviews = void 0;
const reviewService = __importStar(require("../services/reviewService"));
const getAllReviews = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await reviewService.getAllReviews({ page, limit });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get reviews', error: error.message });
    }
};
exports.getAllReviews = getAllReviews;
const getReviewsByBookId = async (req, res) => {
    try {
        const bookId = Number(req.params.bookId);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await reviewService.getReviewsByBookId(bookId, { page, limit });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get reviews by book', error: error.message });
    }
};
exports.getReviewsByBookId = getReviewsByBookId;
const getReviewById = async (req, res) => {
    try {
        const review = await reviewService.getReviewById(parseInt(req.params.id));
        if (!review) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }
        res.json(review);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get review', error: error.message });
    }
};
exports.getReviewById = getReviewById;
const createReview = async (req, res) => {
    try {
        const { userId, bookId, rating, comment } = req.body;
        const review = await reviewService.createReview({ userId, bookId, rating, comment });
        res.status(201).json(review);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create review', error: error.message });
    }
};
exports.createReview = createReview;
const updateReview = async (req, res) => {
    try {
        const updated = await reviewService.updateReview(parseInt(req.params.id), req.body);
        if (!updated) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update review', error: error.message });
    }
};
exports.updateReview = updateReview;
const deleteReview = async (req, res) => {
    try {
        const deleted = await reviewService.deleteReview(parseInt(req.params.id));
        if (!deleted) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }
        res.json({ message: 'Review deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete review', error: error.message });
    }
};
exports.deleteReview = deleteReview;

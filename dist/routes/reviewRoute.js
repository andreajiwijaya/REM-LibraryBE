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
const express_1 = require("express");
const reviewController = __importStar(require("../controllers/reviewController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
// Admin only get all reviews (with pagination)
router.get('/', (0, roleMiddleware_1.roleMiddleware)(['admin']), reviewController.getAllReviews);
// Anyone can get reviews for a specific book (with pagination)
router.get('/book/:bookId', (0, roleMiddleware_1.roleMiddleware)(['admin', 'user']), reviewController.getReviewsByBookId);
// Get single review by id (admin or user)
router.get('/:id', (0, roleMiddleware_1.roleMiddleware)(['admin', 'user']), reviewController.getReviewById);
// User create review
router.post('/', (0, roleMiddleware_1.roleMiddleware)(['user']), reviewController.createReview);
// User update own review (authorization logic can be added in middleware or controller)
// For simplicity, allow 'user' role here
router.put('/:id', (0, roleMiddleware_1.roleMiddleware)(['user']), reviewController.updateReview);
// Admin delete review
router.delete('/:id', (0, roleMiddleware_1.roleMiddleware)(['admin']), reviewController.deleteReview);
exports.default = router;

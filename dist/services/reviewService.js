"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewsByBookId = exports.getAllReviews = exports.getReviewById = exports.deleteReview = exports.updateReview = exports.createReview = void 0;
const db_1 = __importDefault(require("../config/db"));
const createReview = async (data) => {
    return db_1.default.review.create({
        data: {
            userId: data.userId,
            bookId: data.bookId,
            rating: data.rating,
            comment: data.comment,
        },
    });
};
exports.createReview = createReview;
const updateReview = async (id, data) => {
    const existing = await db_1.default.review.findUnique({ where: { id } });
    if (!existing)
        return null;
    return db_1.default.review.update({
        where: { id },
        data,
    });
};
exports.updateReview = updateReview;
const deleteReview = async (id) => {
    const existing = await db_1.default.review.findUnique({ where: { id } });
    if (!existing)
        return false;
    await db_1.default.review.delete({ where: { id } });
    return true;
};
exports.deleteReview = deleteReview;
const getReviewById = async (id) => {
    return db_1.default.review.findUnique({ where: { id } });
};
exports.getReviewById = getReviewById;
const getAllReviews = async (options = {}) => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
        db_1.default.review.count(),
        db_1.default.review.findMany({
            skip,
            take: limit,
            orderBy: { id: 'desc' },
        }),
    ]);
    return { data, total, page, limit };
};
exports.getAllReviews = getAllReviews;
const getReviewsByBookId = async (bookId, options = {}) => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
        db_1.default.review.count({ where: { bookId } }),
        db_1.default.review.findMany({
            where: { bookId },
            skip,
            take: limit,
            orderBy: { id: 'desc' },
        }),
    ]);
    return { data, total, page, limit };
};
exports.getReviewsByBookId = getReviewsByBookId;

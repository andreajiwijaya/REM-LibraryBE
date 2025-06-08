"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countFavoritesByBook = exports.deleteFavorite = exports.createFavorite = exports.isBookFavoritedByUser = exports.getUserFavorites = void 0;
const db_1 = __importDefault(require("../config/db"));
const getUserFavorites = async (userId, options = {}) => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
        db_1.default.favorite.count({ where: { userId } }),
        db_1.default.favorite.findMany({
            where: { userId },
            include: { book: true },
            skip,
            take: limit,
            orderBy: { id: 'desc' },
        }),
    ]);
    return { data, total, page, limit };
};
exports.getUserFavorites = getUserFavorites;
const isBookFavoritedByUser = async (userId, bookId) => {
    const favorite = await db_1.default.favorite.findUnique({
        where: {
            userId_bookId: {
                userId,
                bookId,
            },
        },
    });
    return !!favorite;
};
exports.isBookFavoritedByUser = isBookFavoritedByUser;
const createFavorite = async (data) => {
    const exists = await (0, exports.isBookFavoritedByUser)(data.userId, data.bookId);
    if (exists) {
        throw new Error('Book already favorited by this user');
    }
    return await db_1.default.favorite.create({ data });
};
exports.createFavorite = createFavorite;
const deleteFavorite = async (id) => {
    const favorite = await db_1.default.favorite.findUnique({ where: { id } });
    if (!favorite)
        return false;
    await db_1.default.favorite.delete({ where: { id } });
    return true;
};
exports.deleteFavorite = deleteFavorite;
const countFavoritesByBook = async (bookId) => {
    return await db_1.default.favorite.count({ where: { bookId } });
};
exports.countFavoritesByBook = countFavoritesByBook;

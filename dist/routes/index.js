"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoute_1 = __importDefault(require("./authRoute"));
const userRoute_1 = __importDefault(require("./userRoute"));
const bookRoute_1 = __importDefault(require("./bookRoute"));
const borrowRoute_1 = __importDefault(require("./borrowRoute"));
const favoriteRoute_1 = __importDefault(require("./favoriteRoute"));
const reviewRoute_1 = __importDefault(require("./reviewRoute"));
const categoryRoute_1 = __importDefault(require("./categoryRoute"));
const router = (0, express_1.Router)();
router.get('/', (_, res) => {
    res.json({ message: '📚 Welcome to REM-Library API' });
});
// Route grouping
router.use('/auth', authRoute_1.default);
router.use('/users', userRoute_1.default);
router.use('/books', bookRoute_1.default);
router.use('/borrows', borrowRoute_1.default);
router.use('/favorites', favoriteRoute_1.default);
router.use('/reviews', reviewRoute_1.default);
router.use('/categories', categoryRoute_1.default);
exports.default = router;

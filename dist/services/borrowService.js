"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverdueBorrows = exports.getBorrowsByBookId = exports.getBorrowsByUserId = exports.deleteBorrow = exports.updateBorrow = exports.createBorrow = exports.getBorrowById = exports.getAllBorrows = void 0;
const db_1 = __importDefault(require("../config/db"));
const getAllBorrows = async ({ page, limit, }) => {
    const [total, data] = await Promise.all([
        db_1.default.borrow.count(),
        db_1.default.borrow.findMany({
            skip: (page - 1) * limit,
            take: limit,
            include: { user: true, book: true },
            orderBy: { borrowDate: 'desc' },
        }),
    ]);
    return { data, total, page, limit };
};
exports.getAllBorrows = getAllBorrows;
const getBorrowById = async (id) => {
    return db_1.default.borrow.findUnique({
        where: { id },
        include: { user: true, book: true },
    });
};
exports.getBorrowById = getBorrowById;
const createBorrow = async (data) => {
    return db_1.default.borrow.create({ data });
};
exports.createBorrow = createBorrow;
const updateBorrow = async (id, data) => {
    const borrow = await db_1.default.borrow.findUnique({ where: { id } });
    if (!borrow)
        return null;
    return db_1.default.borrow.update({
        where: { id },
        data,
    });
};
exports.updateBorrow = updateBorrow;
const deleteBorrow = async (id) => {
    const borrow = await db_1.default.borrow.findUnique({ where: { id } });
    if (!borrow)
        return false;
    await db_1.default.borrow.delete({ where: { id } });
    return true;
};
exports.deleteBorrow = deleteBorrow;
const getBorrowsByUserId = async (userId) => {
    return db_1.default.borrow.findMany({
        where: { userId },
        include: { book: true },
    });
};
exports.getBorrowsByUserId = getBorrowsByUserId;
const getBorrowsByBookId = async (bookId) => {
    return db_1.default.borrow.findMany({
        where: { bookId },
        include: { user: true },
    });
};
exports.getBorrowsByBookId = getBorrowsByBookId;
const getOverdueBorrows = async () => {
    const now = new Date();
    return db_1.default.borrow.findMany({
        where: {
            returnDate: null,
            dueDate: { lt: now },
        },
        include: { user: true, book: true },
    });
};
exports.getOverdueBorrows = getOverdueBorrows;

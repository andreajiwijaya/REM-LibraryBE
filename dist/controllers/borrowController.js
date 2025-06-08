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
exports.getOverdueBorrows = exports.getBorrowsByBookId = exports.getBorrowsByUserId = exports.deleteBorrow = exports.updateBorrow = exports.returnBorrow = exports.createBorrow = exports.getBorrowById = exports.getMyBorrows = exports.getAllBorrows = void 0;
const express_validator_1 = require("express-validator");
const borrowService = __importStar(require("../services/borrowService"));
const getAllBorrows = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const data = await borrowService.getAllBorrows({ page, limit });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get borrows', error: error.message });
    }
};
exports.getAllBorrows = getAllBorrows;
const getMyBorrows = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const borrows = await borrowService.getBorrowsByUserId(userId);
        res.json(borrows);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get your borrows', error: error.message });
    }
};
exports.getMyBorrows = getMyBorrows;
const getBorrowById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid borrow ID' });
            return;
        }
        const borrow = await borrowService.getBorrowById(id);
        if (!borrow) {
            res.status(404).json({ message: 'Borrow record not found' });
            return;
        }
        if (req.user?.role !== 'admin' && borrow.userId !== req.user?.id) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        res.json(borrow);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get borrow record', error: error.message });
    }
};
exports.getBorrowById = getBorrowById;
const createBorrow = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { bookId, returnDate } = req.body;
        const newBorrow = await borrowService.createBorrow({
            userId,
            bookId,
            borrowDate: new Date(),
            returnDate: returnDate ? new Date(returnDate) : null,
        });
        res.status(201).json(newBorrow);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create borrow record', error: error.message });
    }
};
exports.createBorrow = createBorrow;
const returnBorrow = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid borrow ID' });
            return;
        }
        const borrow = await borrowService.getBorrowById(id);
        if (!borrow) {
            res.status(404).json({ message: 'Borrow record not found' });
            return;
        }
        if (req.user?.role !== 'admin' && borrow.userId !== req.user?.id) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        if (borrow.returnDate) {
            res.status(400).json({ message: 'Book already returned' });
            return;
        }
        const updated = await borrowService.updateBorrow(id, { returnDate: new Date() });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to return borrow record', error: error.message });
    }
};
exports.returnBorrow = returnBorrow;
const updateBorrow = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid borrow ID' });
            return;
        }
        const updatedBorrow = await borrowService.updateBorrow(id, req.body);
        if (!updatedBorrow) {
            res.status(404).json({ message: 'Borrow record not found' });
            return;
        }
        res.json(updatedBorrow);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update borrow record', error: error.message });
    }
};
exports.updateBorrow = updateBorrow;
const deleteBorrow = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid borrow ID' });
            return;
        }
        const deleted = await borrowService.deleteBorrow(id);
        if (!deleted) {
            res.status(404).json({ message: 'Borrow record not found' });
            return;
        }
        res.json({ message: 'Borrow record deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete borrow record', error: error.message });
    }
};
exports.deleteBorrow = deleteBorrow;
const getBorrowsByUserId = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }
        const borrows = await borrowService.getBorrowsByUserId(userId);
        res.json(borrows);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get borrows by user', error: error.message });
    }
};
exports.getBorrowsByUserId = getBorrowsByUserId;
const getBorrowsByBookId = async (req, res) => {
    try {
        const bookId = parseInt(req.params.bookId);
        if (isNaN(bookId)) {
            res.status(400).json({ message: 'Invalid book ID' });
            return;
        }
        const borrows = await borrowService.getBorrowsByBookId(bookId);
        res.json(borrows);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get borrows by book', error: error.message });
    }
};
exports.getBorrowsByBookId = getBorrowsByBookId;
const getOverdueBorrows = async (req, res) => {
    try {
        const borrows = await borrowService.getOverdueBorrows();
        res.json(borrows);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get overdue borrows', error: error.message });
    }
};
exports.getOverdueBorrows = getOverdueBorrows;

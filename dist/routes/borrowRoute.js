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
const express_validator_1 = require("express-validator");
const borrowController = __importStar(require("../controllers/borrowController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.get('/', (0, roleMiddleware_1.roleMiddleware)(['admin']), (0, express_validator_1.query)('page').optional().isInt({ gt: 0 }).withMessage('Page must be a positive integer'), (0, express_validator_1.query)('limit').optional().isInt({ gt: 0 }).withMessage('Limit must be a positive integer'), borrowController.getAllBorrows);
router.get('/my', (0, roleMiddleware_1.roleMiddleware)(['user']), borrowController.getMyBorrows);
router.get('/user/:userId', (0, roleMiddleware_1.roleMiddleware)(['admin']), (0, express_validator_1.param)('userId').isInt().withMessage('Invalid user ID'), borrowController.getBorrowsByUserId);
router.get('/book/:bookId', (0, roleMiddleware_1.roleMiddleware)(['admin']), (0, express_validator_1.param)('bookId').isInt().withMessage('Invalid book ID'), borrowController.getBorrowsByBookId);
router.get('/overdue', (0, roleMiddleware_1.roleMiddleware)(['admin']), borrowController.getOverdueBorrows);
router.get('/:id', (0, roleMiddleware_1.roleMiddleware)(['admin', 'user']), (0, express_validator_1.param)('id').isInt().withMessage('Invalid borrow ID'), borrowController.getBorrowById);
router.post('/', (0, roleMiddleware_1.roleMiddleware)(['user']), (0, express_validator_1.body)('bookId').isInt({ gt: 0 }).withMessage('bookId must be a positive integer'), (0, express_validator_1.body)('returnDate').optional().isISO8601().toDate().withMessage('returnDate must be a valid date'), borrowController.createBorrow);
router.put('/:id/return', (0, roleMiddleware_1.roleMiddleware)(['user']), (0, express_validator_1.param)('id').isInt().withMessage('Invalid borrow ID'), borrowController.returnBorrow);
router.put('/:id', (0, roleMiddleware_1.roleMiddleware)(['admin']), (0, express_validator_1.param)('id').isInt().withMessage('Invalid borrow ID'), borrowController.updateBorrow);
router.delete('/:id', (0, roleMiddleware_1.roleMiddleware)(['admin']), (0, express_validator_1.param)('id').isInt().withMessage('Invalid borrow ID'), borrowController.deleteBorrow);
exports.default = router;

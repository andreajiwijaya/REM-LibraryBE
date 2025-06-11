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
const bookController = __importStar(require("../controllers/bookController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
// Akses umum (semua user)
router.get('/', (0, express_validator_1.query)('page').optional().isInt({ min: 1 }), (0, express_validator_1.query)('limit').optional().isInt({ min: 1 }), (0, express_validator_1.query)('category').optional().isString(), bookController.getAllBooks);
router.get('/search', (0, express_validator_1.query)('title').notEmpty().withMessage('title query is required'), bookController.searchBooksByTitle);
router.get('/author/:author', bookController.getBooksByAuthor);
router.get('/:id', bookController.getBookById);
// Akses admin
router.post('/', (0, roleMiddleware_1.roleMiddleware)(['admin']), (0, express_validator_1.body)('title').notEmpty(), (0, express_validator_1.body)('author').notEmpty(), (0, express_validator_1.body)('description').notEmpty(), bookController.createBook);
router.put('/:id', (0, roleMiddleware_1.roleMiddleware)(['admin']), (0, express_validator_1.body)('title').optional().notEmpty(), (0, express_validator_1.body)('author').optional().notEmpty(), (0, express_validator_1.body)('description').optional().notEmpty(), (0, express_validator_1.body)('categoryIds').optional().isArray().withMessage('categoryIds harus berupa array of integers'), (0, express_validator_1.body)('categoryIds.*').isInt().withMessage('Setiap categoryId harus berupa integer'), bookController.updateBook);
router.delete('/:id', (0, roleMiddleware_1.roleMiddleware)(['admin']), bookController.deleteBook);
router.post('/:id/categories', (0, roleMiddleware_1.roleMiddleware)(['admin']), bookController.addCategoryToBook);
router.delete('/:id/categories/:categoryId', (0, roleMiddleware_1.roleMiddleware)(['admin']), bookController.removeCategoryFromBook);
exports.default = router;

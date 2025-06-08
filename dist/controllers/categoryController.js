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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const categoryService = __importStar(require("../services/categoryService"));
const getAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const result = await categoryService.getAllCategories({ page, limit, search });
        res.json({
            data: result.data,
            total: result.total,
            page: result.page,
            limit: result.limit,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get categories', error: error.message });
    }
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(parseInt(req.params.id));
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get category', error: error.message });
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await categoryService.createCategory({ name, description });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create category', error: error.message });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const updated = await categoryService.updateCategory(parseInt(req.params.id), req.body);
        if (!updated) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update category', error: error.message });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const deleted = await categoryService.deleteCategory(parseInt(req.params.id));
        if (!deleted) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete category', error: error.message });
    }
};
exports.deleteCategory = deleteCategory;

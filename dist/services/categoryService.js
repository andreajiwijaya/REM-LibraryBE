"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const db_1 = __importDefault(require("../config/db"));
const getAllCategories = async (options = {}) => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;
    const search = options.search?.trim();
    const where = search && search.length > 0
        ? {
            name: {
                contains: search,
                mode: 'insensitive',
            },
        }
        : undefined;
    const [data, total] = await Promise.all([
        db_1.default.category.findMany({
            where,
            skip,
            take: limit,
            orderBy: { id: 'asc' },
        }),
        db_1.default.category.count({ where }),
    ]);
    return { data, total, page, limit };
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (id) => {
    return await db_1.default.category.findUnique({ where: { id } });
};
exports.getCategoryById = getCategoryById;
const createCategory = async (data) => {
    return await db_1.default.category.create({ data });
};
exports.createCategory = createCategory;
const updateCategory = async (id, data) => {
    const category = await db_1.default.category.findUnique({ where: { id } });
    if (!category)
        return null;
    return await db_1.default.category.update({ where: { id }, data });
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id) => {
    const category = await db_1.default.category.findUnique({ where: { id } });
    if (!category)
        return false;
    await db_1.default.category.delete({ where: { id } });
    return true;
};
exports.deleteCategory = deleteCategory;

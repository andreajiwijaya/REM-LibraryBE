"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const db_1 = __importDefault(require("../config/db"));
const getAllUsers = async (options = {}) => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;
    const search = options.search?.trim();
    const where = search && search.length > 0
        ? {
            OR: [
                {
                    username: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    role: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    email: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            ],
        }
        : undefined;
    const [data, total] = await Promise.all([
        db_1.default.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { id: 'asc' },
        }),
        db_1.default.user.count({ where }),
    ]);
    return { data, total, page, limit };
};
exports.getAllUsers = getAllUsers;
const getUserById = async (id) => {
    return await db_1.default.user.findUnique({ where: { id } });
};
exports.getUserById = getUserById;
const createUser = async (data) => {
    return await db_1.default.user.create({ data });
};
exports.createUser = createUser;
const updateUser = async (id, data) => {
    const user = await db_1.default.user.findUnique({ where: { id } });
    if (!user)
        return null;
    return await db_1.default.user.update({ where: { id }, data });
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    const user = await db_1.default.user.findUnique({ where: { id } });
    if (!user)
        return false;
    await db_1.default.user.delete({ where: { id } });
    return true;
};
exports.deleteUser = deleteUser;

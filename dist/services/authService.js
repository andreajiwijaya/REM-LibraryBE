"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const db_1 = __importDefault(require("../config/db"));
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const registerUser = async ({ username, email, password, role = 'user' }) => {
    const existingUser = await db_1.default.user.findFirst({
        where: {
            OR: [{ username }, { email }],
        },
    });
    if (existingUser) {
        if (existingUser.username === username)
            throw new Error('Username already exists');
        if (existingUser.email === email)
            throw new Error('Email already exists');
    }
    const hashedPassword = await (0, hash_1.hashPassword)(password);
    const newUser = await db_1.default.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            role,
        },
    });
    return newUser;
};
exports.registerUser = registerUser;
const loginUser = async ({ username, password }) => {
    const user = await db_1.default.user.findUnique({ where: { username } });
    if (!user)
        throw new Error('Invalid credentials');
    const isValid = await (0, hash_1.comparePassword)(password, user.password);
    if (!isValid)
        throw new Error('Invalid credentials');
    const token = (0, jwt_1.generateToken)({ userId: user.id, role: user.role });
    return token;
};
exports.loginUser = loginUser;

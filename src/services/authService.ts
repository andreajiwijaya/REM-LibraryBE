import prisma from '../config/db';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

interface RegisterInput {
  username: string;
  password: string;
  role?: 'user' | 'admin'; // hanya bisa 'user' atau 'admin'
}

interface LoginInput {
  username: string;
  password: string;
}

export const registerUser = async ({ username, password, role = 'user' }: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) throw new Error('Username already exists');

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role, // disimpan di DB
    },
  });

  return newUser;
};

export const loginUser = async ({ username, password }: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error('Invalid credentials');

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  const token = generateToken({ userId: user.id, role: user.role });
  return token;
};

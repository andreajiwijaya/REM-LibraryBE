import prisma from '../config/db';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

interface LoginInput {
  username: string;
  password: string;
}

export const registerUser = async ({ username, email, password, role = 'user' }: RegisterInput) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    if (existingUser.username === username) throw new Error('Username already exists');
    if (existingUser.email === email) throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role,
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

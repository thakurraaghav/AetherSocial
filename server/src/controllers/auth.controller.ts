import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await AuthService.register(validatedData);
    
    const token = AuthService.generateToken(user.id);
    
    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: error.message || 'Registration failed' });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const user = await AuthService.login(validatedData);
    
    const token = AuthService.generateToken(user.id);
    
    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({ id: user.id, email: user.email });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(401).json({ error: error.message || 'Login failed' });
    }
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.json({ message: 'Logged out successfully' });
};

export const getMe = (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  
  res.json({
    id: req.user.id,
    email: req.user.email,
    createdAt: req.user.createdAt
  });
};

import { z } from 'zod';

export const DeckSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  description: z.string().optional(),
  userId: z.string().min(1, 'User ID is required'),
  isPublic: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateDeckSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  description: z.string().optional(),
  userId: z.string().min(1, 'User ID is required'),
  isPublic: z.boolean().default(false),
});

export const UpdateDeckSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long').optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export type Deck = z.infer<typeof DeckSchema>;
export type CreateDeckInput = z.infer<typeof CreateDeckSchema>;
export type UpdateDeckInput = z.infer<typeof UpdateDeckSchema>;

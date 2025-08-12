import { z } from 'zod';

export const CardSchema = z.object({
  id: z.number().optional(),
  deckId: z.number().min(1, 'Deck ID is required'),
  front: z.string().min(1, 'Front content is required'),
  back: z.string().min(1, 'Back content is required'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateCardSchema = z.object({
  deckId: z.number().min(1, 'Deck ID is required'),
  front: z.string().min(1, 'Front content is required'),
  back: z.string().min(1, 'Back content is required'),
});

export const UpdateCardSchema = z.object({
  front: z.string().min(1, 'Front content is required').optional(),
  back: z.string().min(1, 'Back content is required').optional(),
});

export type Card = z.infer<typeof CardSchema>;
export type CreateCardInput = z.infer<typeof CreateCardSchema>;
export type UpdateCardInput = z.infer<typeof UpdateCardSchema>;

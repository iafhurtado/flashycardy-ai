'use server';

import { z } from 'zod';
import { CreateCardSchema, UpdateCardSchema, CreateCardInput, UpdateCardInput } from '@/lib/schemas/card';
import { createCard, updateCard, deleteCard } from '@/db/queries';

export async function handleCreateCard(data: CreateCardInput) {
  const validatedData = CreateCardSchema.parse(data);
  return await createCard(validatedData);
}

export async function handleUpdateCard(cardId: number, data: UpdateCardInput) {
  const validatedData = UpdateCardSchema.parse(data);
  return await updateCard(cardId, validatedData);
}

export async function handleDeleteCard(cardId: number) {
  const validatedId = z.number().positive().parse(cardId);
  return await deleteCard(validatedId);
}

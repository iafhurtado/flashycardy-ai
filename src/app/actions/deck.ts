'use server';

import { z } from 'zod';
import { CreateDeckSchema, UpdateDeckSchema, CreateDeckInput, UpdateDeckInput } from '@/lib/schemas/deck';
import { createDeck, updateDeck, deleteDeck } from '@/db/queries';

export async function handleCreateDeck(data: CreateDeckInput) {
  const validatedData = CreateDeckSchema.parse(data);
  return await createDeck(validatedData);
}

export async function handleUpdateDeck(deckId: number, data: UpdateDeckInput) {
  const validatedData = UpdateDeckSchema.parse(data);
  return await updateDeck(deckId, validatedData);
}

export async function handleDeleteDeck(deckId: number) {
  const validatedId = z.number().positive().parse(deckId);
  return await deleteDeck(validatedId);
}

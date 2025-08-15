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
  const result = await updateDeck(deckId, validatedData);
  
  // Return a plain object to avoid serialization issues
  return {
    success: true,
    deck: result ? {
      id: result.id,
      name: result.name,
      description: result.description,
      isPublic: result.isPublic,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    } : null
  };
}

export async function handleDeleteDeck(deckId: number) {
  const validatedId = z.number().positive().parse(deckId);
  return await deleteDeck(validatedId);
}

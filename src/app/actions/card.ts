'use server';

import { z } from 'zod';
import { CreateCardSchema, UpdateCardSchema, CreateCardInput, UpdateCardInput } from '@/lib/schemas/card';
import { createCard, updateCard, deleteCard } from '@/db/queries';
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { userProgressTable, cardsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

export async function updateCardProgress(cardId: number) {
  const user = await currentUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    // Check if progress record exists
    const existingProgress = await db
      .select()
      .from(userProgressTable)
      .where(
        and(
          eq(userProgressTable.userId, user.id),
          eq(userProgressTable.cardId, cardId)
        )
      )
      .limit(1);

    if (existingProgress.length > 0) {
      // Update existing progress
      await db
        .update(userProgressTable)
        .set({
          reviewCount: (existingProgress[0]?.reviewCount || 0) + 1,
          lastReviewed: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(userProgressTable.userId, user.id),
            eq(userProgressTable.cardId, cardId)
          )
        );
    } else {
      // Create new progress record
      await db.insert(userProgressTable).values({
        userId: user.id,
        cardId: cardId,
        reviewCount: 1,
        lastReviewed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    revalidatePath("/decks/[id]", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to update card progress:", error);
    throw new Error("Failed to update card progress");
  }
}

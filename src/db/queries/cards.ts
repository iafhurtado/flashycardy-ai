import { db } from '@/db';
import { cardsTable } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getCardsByDeckId(deckId: number) {
  return await db
    .select({
      id: cardsTable.id,
      front: cardsTable.front,
      back: cardsTable.back,
      createdAt: cardsTable.createdAt,
    })
    .from(cardsTable)
    .where(eq(cardsTable.deckId, deckId))
    .orderBy(desc(cardsTable.createdAt));
}

export async function createCard(data: {
  deckId: number;
  front: string;
  back: string;
}) {
  return await db.insert(cardsTable).values(data).returning();
}

export async function updateCard(cardId: number, data: {
  front?: string;
  back?: string;
}) {
  return await db.update(cardsTable)
    .set(data)
    .where(eq(cardsTable.id, cardId));
}

export async function deleteCard(cardId: number) {
  return await db.delete(cardsTable).where(eq(cardsTable.id, cardId));
}

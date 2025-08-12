import { db } from '@/db';
import { decksTable, cardsTable, userProgressTable } from '@/db/schema';
import { eq, count, and, desc, sql } from 'drizzle-orm';

export async function getAllDecksWithCardCounts(userId: string) {
  return await db
    .select({
      id: decksTable.id,
      name: decksTable.name,
      description: decksTable.description,
      isPublic: decksTable.isPublic,
      createdAt: decksTable.createdAt,
      updatedAt: decksTable.updatedAt,
      cardCount: count(cardsTable.id),
    })
    .from(decksTable)
    .leftJoin(cardsTable, eq(decksTable.id, cardsTable.deckId))
    .where(eq(decksTable.userId, userId))
    .groupBy(decksTable.id)
    .orderBy(desc(decksTable.updatedAt));
}

export async function getRecentDecksWithCardCounts(userId: string, limit: number = 3) {
  return await db
    .select({
      id: decksTable.id,
      name: decksTable.name,
      description: decksTable.description,
      isPublic: decksTable.isPublic,
      createdAt: decksTable.createdAt,
      updatedAt: decksTable.updatedAt,
      cardCount: count(cardsTable.id),
    })
    .from(decksTable)
    .leftJoin(cardsTable, eq(decksTable.id, cardsTable.deckId))
    .where(eq(decksTable.userId, userId))
    .groupBy(decksTable.id)
    .orderBy(desc(decksTable.updatedAt))
    .limit(limit);
}

export async function getDeckById(deckId: number, userId: string) {
  const [deck] = await db
    .select({
      id: decksTable.id,
      name: decksTable.name,
      description: decksTable.description,
      isPublic: decksTable.isPublic,
      createdAt: decksTable.createdAt,
      updatedAt: decksTable.updatedAt,
      cardCount: count(cardsTable.id),
      studiedCards: count(userProgressTable.id),
    })
    .from(decksTable)
    .leftJoin(cardsTable, eq(decksTable.id, cardsTable.deckId))
    .leftJoin(userProgressTable, and(
      eq(cardsTable.id, userProgressTable.cardId),
      eq(userProgressTable.userId, userId)
    ))
    .where(and(
      eq(decksTable.id, deckId),
      eq(decksTable.userId, userId)
    ))
    .groupBy(decksTable.id);
  
  return deck;
}

export async function createDeck(data: {
  name: string;
  description?: string;
  userId: string;
  isPublic?: boolean;
}) {
  return await db.insert(decksTable).values(data).returning();
}

export async function updateDeck(deckId: number, data: {
  name?: string;
  description?: string;
  isPublic?: boolean;
}) {
  return await db.update(decksTable)
    .set(data)
    .where(eq(decksTable.id, deckId));
}

export async function deleteDeck(deckId: number) {
  return await db.delete(decksTable).where(eq(decksTable.id, deckId));
}

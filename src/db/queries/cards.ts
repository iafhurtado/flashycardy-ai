import { db } from '@/db';
import { cardsTable, userProgressTable } from '@/db/schema';
import { eq, desc, and, isNull } from 'drizzle-orm';

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

export async function getCardsWithStudyStatus(deckId: number, userId: string) {
  return await db
    .select({
      id: cardsTable.id,
      front: cardsTable.front,
      back: cardsTable.back,
      createdAt: cardsTable.createdAt,
      isStudied: userProgressTable.id,
    })
    .from(cardsTable)
    .leftJoin(
      userProgressTable,
      and(
        eq(cardsTable.id, userProgressTable.cardId),
        eq(userProgressTable.userId, userId)
      )
    )
    .where(eq(cardsTable.deckId, deckId))
    .orderBy(desc(cardsTable.createdAt));
}

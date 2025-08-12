import { db } from '@/db';
import { decksTable, cardsTable, userProgressTable } from '@/db/schema';
import { eq, count, sql } from 'drizzle-orm';

export async function getDashboardStats(userId: string) {
  const [totalCardsResult] = await db
    .select({ count: count() })
    .from(cardsTable)
    .innerJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
    .where(eq(decksTable.userId, userId));

  const [totalDecksResult] = await db
    .select({ count: count() })
    .from(decksTable)
    .where(eq(decksTable.userId, userId));

  const [totalStudySessionsResult] = await db
    .select({ count: count() })
    .from(userProgressTable)
    .where(eq(userProgressTable.userId, userId));

  // Calculate mastery rate (percentage of correct answers)
  const [masteryResult] = await db
    .select({
      totalReviews: sql<number>`COALESCE(SUM(${userProgressTable.correctCount} + ${userProgressTable.incorrectCount}), 0)`,
      correctReviews: sql<number>`COALESCE(SUM(${userProgressTable.correctCount}), 0)`,
    })
    .from(userProgressTable)
    .where(eq(userProgressTable.userId, userId));

  const masteryRate = masteryResult.totalReviews > 0 
    ? Math.round((masteryResult.correctReviews / masteryResult.totalReviews) * 100)
    : 0;

  return {
    totalCards: totalCardsResult.count,
    totalDecks: totalDecksResult.count,
    totalStudySessions: totalStudySessionsResult.count,
    masteryRate,
  };
}

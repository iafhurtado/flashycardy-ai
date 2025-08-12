import { integer, pgTable, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Decks table - represents a collection of flashcards
export const decksTable = pgTable("decks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  userId: varchar({ length: 255 }).notNull(), // Clerk user ID
  isPublic: boolean().default(false),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Cards table - represents individual flashcards within a deck
export const cardsTable = pgTable("cards", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  deckId: integer().notNull().references(() => decksTable.id, { onDelete: "cascade" }),
  front: text().notNull(), // The question or prompt side
  back: text().notNull(), // The answer side
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// User progress table - tracks user's study progress for each card
export const userProgressTable = pgTable("user_progress", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }).notNull(), // Clerk user ID
  cardId: integer().notNull().references(() => cardsTable.id, { onDelete: "cascade" }),
  difficulty: integer().default(1), // 1-5 scale for spaced repetition
  lastReviewed: timestamp(),
  nextReview: timestamp(),
  reviewCount: integer().default(0),
  correctCount: integer().default(0),
  incorrectCount: integer().default(0),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Relations
export const decksRelations = relations(decksTable, ({ many }) => ({
  cards: many(cardsTable),
}));

export const cardsRelations = relations(cardsTable, ({ one, many }) => ({
  deck: one(decksTable, {
    fields: [cardsTable.deckId],
    references: [decksTable.id],
  }),
  userProgress: many(userProgressTable),
}));

export const userProgressRelations = relations(userProgressTable, ({ one }) => ({
  card: one(cardsTable, {
    fields: [userProgressTable.cardId],
    references: [cardsTable.id],
  }),
}));

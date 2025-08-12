import 'dotenv/config';
import { db } from './index';
import { decksTable, cardsTable } from './schema';
import { eq } from 'drizzle-orm';
import { createDeck, createCard, getAllDecksWithCardCounts, getCardsByDeckId } from './queries';

const USER_ID = 'user_31BQtxJgW0a56KD4zawATWXpoXp';

async function addExampleData() {
  try {
    console.log('Adding example decks and cards...');

    // Create Spanish Learning Deck
    const spanishDeck = await createDeck({
      name: 'Spanish Vocabulary',
      description: 'Learn common English words and their Spanish translations',
      userId: USER_ID,
      isPublic: false,
    });

    console.log('✅ Spanish deck created');

    // Spanish vocabulary cards
    const spanishCards = [
      { front: 'Hello', back: 'Hola' },
      { front: 'Goodbye', back: 'Adiós' },
      { front: 'Thank you', back: 'Gracias' },
      { front: 'Please', back: 'Por favor' },
      { front: 'Yes', back: 'Sí' },
      { front: 'No', back: 'No' },
      { front: 'Water', back: 'Agua' },
      { front: 'Food', back: 'Comida' },
      { front: 'House', back: 'Casa' },
      { front: 'Car', back: 'Coche' },
      { front: 'Book', back: 'Libro' },
      { front: 'Friend', back: 'Amigo' },
      { front: 'Family', back: 'Familia' },
      { front: 'Work', back: 'Trabajo' },
      { front: 'School', back: 'Escuela' },
      { front: 'Time', back: 'Tiempo' },
      { front: 'Money', back: 'Dinero' },
    ];

    for (const card of spanishCards) {
      await createCard({
        deckId: spanishDeck[0].id,
        front: card.front,
        back: card.back,
      });
    }

    console.log('✅ Spanish cards added');

    // Create British History Deck
    const historyDeck = await createDeck({
      name: 'British History',
      description: 'Test your knowledge of key events and figures in British history',
      userId: USER_ID,
      isPublic: false,
    });

    console.log('✅ British History deck created');

    // British history cards
    const historyCards = [
      { front: 'Who was the first Norman King of England?', back: 'William the Conqueror' },
      { front: 'In what year did the Battle of Hastings take place?', back: '1066' },
      { front: 'Which king signed the Magna Carta?', back: 'King John' },
      { front: 'In what year was the Magna Carta signed?', back: '1215' },
      { front: 'Who was the first Tudor monarch?', back: 'Henry VII' },
      { front: 'Which queen ruled England for 44 years during the Elizabethan era?', back: 'Queen Elizabeth I' },
      { front: 'In what year did the English Civil War begin?', back: '1642' },
      { front: 'Who was the Lord Protector during the Commonwealth period?', back: 'Oliver Cromwell' },
      { front: 'In what year did the Great Fire of London occur?', back: '1666' },
      { front: 'Which king was executed in 1649?', back: 'Charles I' },
      { front: 'Who was the first Prime Minister of Great Britain?', back: 'Robert Walpole' },
      { front: 'In what year did the Industrial Revolution begin in Britain?', back: '1760s' },
      { front: 'Which queen ruled during the Victorian era?', back: 'Queen Victoria' },
      { front: 'In what year did World War I begin?', back: '1914' },
      { front: 'Who was the first female Prime Minister of the UK?', back: 'Margaret Thatcher' },
      { front: 'In what year did the UK join the European Economic Community?', back: '1973' },
      { front: 'Which king abdicated in 1936?', back: 'Edward VIII' },
    ];

    for (const card of historyCards) {
      await createCard({
        deckId: historyDeck[0].id,
        front: card.front,
        back: card.back,
      });
    }

    console.log('✅ British History cards added');

    // Verify the data was added using helper functions
    const allDecks = await getAllDecksWithCardCounts(USER_ID);
    console.log('✅ Total decks for user:', allDecks.length);

    for (const deck of allDecks) {
      const cards = await getCardsByDeckId(deck.id);
      console.log(`✅ Deck "${deck.name}" has ${cards.length} cards`);
    }

    console.log('🎉 Example data added successfully!');
  } catch (error) {
    console.error('❌ Error adding example data:', error);
  }
}

addExampleData();

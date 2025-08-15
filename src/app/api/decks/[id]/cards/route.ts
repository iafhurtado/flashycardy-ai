import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getCardsWithStudyStatus } from "@/db/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const deckId = parseInt(resolvedParams.id);
    
    if (isNaN(deckId)) {
      return NextResponse.json({ error: "Invalid deck ID" }, { status: 400 });
    }

    const cards = await getCardsWithStudyStatus(deckId, user.id);
    
    // Transform the data to include isStudied boolean
    const transformedCards = cards.map(card => ({
      id: card.id,
      front: card.front,
      back: card.back,
      createdAt: card.createdAt,
      isStudied: !!card.isStudied,
    }));
    
    return NextResponse.json(transformedCards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

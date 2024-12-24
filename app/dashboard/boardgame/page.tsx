"use client";
import React, { useState, useRef, useEffect } from "react";
import GameCard from "@/app/ui/boardgame/card";
import Popup from "@/app/ui/boardgame/popup";
import { useRouter } from "next/navigation";

type CardData = {
  id: number;
  title: string;
  attack: number;
  mana: number;
  health: number;
  type: "amanita" | "boletus" | "russula" | "morels";
};

const CARD_TITLES = [
  "Mystic Morel",
  "Shimmer Shroom",
  "Gloom Cap",
  "Spore Sage",
  "Crystal Fungus",
  "Mana Mushroom",
  "Forest Fungar",
  "Elder Enoki",
  "Death Cap",
  "Golden Teacher",
  "Lions Mane",
  "Oyster Spirit",
  "Cosmic Cordyceps",
  "Shadow Shiitake",
  "Truffle Terror",
  "Reishi Warrior",
];

const CARD_TYPES: ("amanita" | "boletus" | "russula" | "morels")[] = [
  "amanita",
  "boletus",
  "russula",
  "morels",
];

// Helper function to generate random card data
const generateRandomCard = (id: number): CardData => ({
  id,
  title: CARD_TITLES[Math.floor(Math.random() * CARD_TITLES.length)],
  attack: Math.floor(Math.random() * 7) + 1,
  mana: Math.floor(Math.random() * 5) + 1,
  health: Math.floor(Math.random() * 6) + 2,
  type: CARD_TYPES[Math.floor(Math.random() * CARD_TYPES.length)],
});

export default function GameBoard() {
  const nextIdRef = useRef(100);
  const [drawableCards, setDrawableCards] = useState<CardData[]>([]);
  const [playerHand, setPlayerHand] = useState<CardData[]>([]);
  const [playedCards, setPlayedCards] = useState<CardData[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // Initial countdown in seconds
  const router = useRouter();

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      // router.push("/dashboard/boardbattle");
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, router]);

  // Initialize drawableCards with useEffect to ensure consistency between server and client
  useEffect(() => {
    const initialCards = Array.from({ length: 4 }, (_, index) =>
      generateRandomCard(index + 1)
    );
    setDrawableCards(initialCards);
  }, []);

  const handleDrawCard = (card: CardData) => {
    console.log("Buying card:", card.id);
    if (numberMycelium === 0 || numberMycelium === 1) {
      // send a message to the user that they cannot buy anymore cards
      setPopupVisible(true);
      setTimeout(() => setPopupVisible(false), 500);
      return;
    }
    if (playerHand.length < 8) {
      setPlayerHand([...playerHand, card]);
      reduceCount(numberMycelium - 2);
      const newDrawableCards = drawableCards.filter((c) => c.id !== card.id);
      const newId = nextIdRef.current;
      nextIdRef.current += 1;
      newDrawableCards.push(generateRandomCard(newId));
      setDrawableCards(newDrawableCards);
    }
  };
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    cardId: number
  ) => {
    e.dataTransfer.setData("text/plain", cardId.toString()); // Store the card ID or title
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("text/plain");
    // Handle the drop logic here, like removing the card or moving it somewhere
    console.log("Dropped card ID:", cardId);
    // Example: setCards(cards.filter(card => card.id.toString() !== cardId));
  };
  const handlePlayCard = (card: CardData) => {
    if (playedCards.length < 5) {
      setPlayedCards([...playedCards, card]);
      setPlayerHand(playerHand.filter((c) => c.id !== card.id));
      setSelectedCard(null);
    }
  };

  // create a number of 4 for how much mycelium is availbable anf thta is reactive when someone click on a card
  // and then when the mycelium is 0, we cannot clikc anymore
  // and then we can have a button that says end turn
  const [numberMycelium, reduceCount] = useState(4);

  return (
    <div className="h-screen bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col">
      {/* Drawable Cards Section */}
      <div className="text-white">
        <p>You have {numberMycelium} Mycelium</p>
      </div>
      <div className="flex flex-col items-center ">
        <h1 className="text-white">The hunt finish in {timeLeft} seconds...</h1>
      </div>
      <div className="h-[35vh] p-4 border-b-2 border-purple-600 flex items-center">
        <div
          className="w-full flex justify-center gap-4"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {drawableCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleDrawCard(card)}
              onDragStart={(e) => handleDragStart(e, card.id)}
              className="transform hover:scale-105 hover:translate-y-[-10px] transition-transform cursor-pointer"
            >
              <GameCard
                id={card.id}
                title={card.title}
                attack={card.attack}
                mana={card.mana}
                health={card.health}
                type={card.type}
                isSelected={false}
              />
            </div>
          ))}
        </div>
        {/* the spore exchange */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="h-64 w-64 border-2 border-dashed border-red-500 flex items-center justify-center"
        >
          <p>Drop Here to Destroy</p>
        </div>
      </div>
      {/* Played Cards Section */}
      <div className="h-[35vh] p-4 border-b-2 border-purple-600 flex items-center">
        <div className="w-full flex justify-center gap-4">
          {playedCards.map((card) => (
            <div key={card.id}>
              <GameCard
                id={card.id}
                title={card.title}
                attack={card.attack}
                mana={card.mana}
                health={card.health}
                type={card.type}
                isSelected={false}
              />
            </div>
          ))}
          {/* Placeholder slots for cards */}
          {[...Array(5 - playedCards.length)].map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="w-48 h-64 border-2 border-dashed border-purple-400 rounded-lg opacity-30"
            />
          ))}
        </div>
      </div>

      {/* Player's Hand Section */}
      <div className="h-[30vh] p-4 flex items-start">
        <div className="w-full flex justify-center gap-4">
          {playerHand.map((card) => (
            <div
              key={card.id}
              onClick={() => handlePlayCard(card)}
              className="transform hover:scale-105 hover:translate-y-[-10px] transition-transform cursor-pointer"
            >
              <GameCard
                id={card.id}
                title={card.title}
                attack={card.attack}
                mana={card.mana}
                health={card.health}
                type={card.type}
                isSelected={selectedCard === card.id}
              />
            </div>
          ))}
        </div>
      </div>
      {/* popup section */}
      <div>
        <Popup message="You have not enough Mycelium" visible={popupVisible} />
      </div>
    </div>
  );
}

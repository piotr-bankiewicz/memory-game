import React, { useState } from "react";
import Card, { CardProps } from "../Card/Card";
import "./Game.css";

const Symbols: string[] = ["🦑", "🧳", "🦜", "🦴", "👾", "🧶", "🎩", "👑", "🐸", "🌵", "🍁", "🔥", "❄️", "🍬", "🥑", "🏀", "🚗", "❤️", "🦤", "🪶"];

const getGameDefaultState = (cardsCount: number): CardProps[] => {
  let result: CardProps[] = [];

  for (let i = 0; i < cardsCount; i++) {
    result.push({ keyValue: i, isFlipped: false, symbol: "", animate: true, animationDelay: ".3s", index: i, flip: () => {} });
  }

  return result;
};

function Game() {
  const [cardStates, setCardState] = useState<CardProps[]>(getGameDefaultState(36));
  const [gameActive, setGameActive] = useState<boolean>(false);

  const flipCard = (index: number) => {
    console.log("flip fired");
    if (gameActive) {
      const cards = cardStates.slice();
      cards[index] = { ...cards[index], isFlipped: !cards[index].isFlipped, animate: false, displaySymbol: true };
      setCardState(cards);
    }
  };

  const startGame = () => {
    setGameActive(true);
    setupCards();
  };

  const resetGame = () => {
    let cards: CardProps[] = cardStates.slice();
    cards.map((item, index) => ({ ...item, animate: true, symbol: "", displaySymbol: false, isFlipped: false, index: item.index + 1000, keyValue: item.keyValue + 1000 }));
    setCardState(cards);
  };

  const setupCards = () => {
    let cards: CardProps[] = cardStates.slice();
    let selectedPictures: string[] = utils.searchRandom(36 / 2, Symbols);
    cards.map((item, index) => {
      item.symbol = selectedPictures[index % selectedPictures.length];
      item.keyValue += 1000;
      item.animationDelay = "0s";
      return item;
    });
    setCardState(
      utils.shuffle(cards).map((item, index) => {
        item.index = index;
        return item;
      })
    );
  };

  return (
    <div>
      <button
        onClick={() => {
          startGame();
        }}
      >
        Start game
      </button>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {cardStates.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <Card key={item.index} {...item} flip={flipCard} />
              {index > 0 && (index + 1) % Math.sqrt(cardStates.length) === 0 && <div key={index + 80} className="line-break"></div>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default Game;

const utils = {
  searchRandom: (count: number, arr: string[]) => {
    let answer: string[] = [],
      counter = 0;

    while (counter < count) {
      let rand = arr[Math.floor(Math.random() * arr.length)];
      if (!answer.some((an) => an === rand)) {
        answer.push(rand);
        counter++;
      }
    }
    return answer;
  },

  shuffle: (array: CardProps[]) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  },
};

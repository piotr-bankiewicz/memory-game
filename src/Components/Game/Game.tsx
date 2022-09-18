import React, { useEffect, useState } from "react";
import Card, { CardProps } from "../Card/Card";
import "./Game.css";

const Symbols: string[] = ["🦑", "🧳", "🦜", "🦴", "👾", "🧶", "🎩", "👑", "🐸", "🌵", "🍁", "🔥", "❄️", "🍬", "🥑", "🏀", "🚗", "❤️", "🦤", "🪶"];
const Fireworks: number[] = Array(6).fill(0);

const getGameDefaultState = (cardsCount: number): CardProps[] => {
  let result: CardProps[] = [];

  for (let i = 0; i < cardsCount; i++) {
    result.push({ keyValue: i, isFlipped: false, symbol: "", animate: true, animationDelay: ".3s", index: i, flip: () => {}, disabled: true });
  }

  return result;
};

function Game() {
  const [cardStates, setCardState] = useState<CardProps[]>(getGameDefaultState(16));
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<CardProps[]>([]);
  const [gameWon, setGameWon] = useState<boolean>(false);

  useEffect(() => {
    if (selectedItems.length === 2) {
      const cards = cardStates.slice();
      if (selectedItems[0].symbol !== selectedItems[1].symbol) {
        setTimeout(() => {
          const selectedItemsCopy = selectedItems.slice();
          selectedItemsCopy.forEach((element) => {
            cards[element.index].isFlipped = false;
            cards[element.index].disabled = false;
          });
          setSelectedItems([]);
          setCardState(cards);
        }, 400);
      } else {
        selectedItems.forEach((element) => {
          cards[element.index].disabled = true;
        });
        setSelectedItems([]);
        console.log(selectedItems);
      }
    }

    if (!cardStates.some((element) => element.disabled === false) && gameActive) {
      setGameWon(true);
    }
  }, [selectedItems, cardStates, gameActive]);

  const flipCard = async (index: number) => {
    if (gameActive && !cardStates[index].disabled && selectedItems.length < 2) {
      console.log("flip fired");
      const cards = cardStates.slice();
      const selectedItemsCopy = selectedItems.slice();
      cards[index] = { ...cards[index], isFlipped: !cards[index].isFlipped, animate: false, displaySymbol: true, disabled: true };
      selectedItemsCopy.push(cards[index]);
      setSelectedItems(selectedItemsCopy);
      setCardState(cards);
    }
  };

  const startGame = () => {
    setGameActive(true);
    setupCards();
  };

  const resetGame = () => {
    setGameActive(false);
    let cards: CardProps[] = cardStates.slice();
    cards.map((item, index) => {
      item.animate = true;
      item.symbol = "";
      item.displaySymbol = false;
      item.isFlipped = false;
      item.index = item.index + 1000;
      item.keyValue = item.keyValue + 1000;
      return item;
    });
    setCardState(cards);
    setGameWon(false);
  };

  const setupCards = () => {
    let cards: CardProps[] = cardStates.slice();
    let selectedPictures: string[] = utils.searchRandom(cardStates.length / 2, Symbols);
    cards.map((item, index) => {
      item.symbol = selectedPictures[index % selectedPictures.length];
      item.keyValue += 1000;
      item.animationDelay = "0s";
      item.disabled = false;
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
      {Fireworks.map((item, index) => {
        return <div key={index} className={`${gameWon ? "firework" : ""}`}></div>;
      })}

      <button onClick={startGame} disabled={gameActive}>
        Start game
      </button>
      <button onClick={resetGame}>Reset</button>
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

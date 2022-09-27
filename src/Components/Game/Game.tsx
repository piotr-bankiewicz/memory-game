import React, { useCallback, useEffect, useReducer, useState } from "react";
import { ActionTypes } from "../../State/Card.actions";
import Card, { CardProps } from "../Card/Card";
import ControlPanel from "../ControlPanel/ControlPanel";
import { ButtonStyles } from "../CustomButton/CustomButton";
import "./Game.css";
import { v4 as uuidv4 } from "uuid";
import { CardReducer } from "../../State/Card.reducer";
import useCountdown from "../../Tools/CountDown";

export const Symbols: string[] = ["🦑", "🧳", "🦜", "🦴", "👾", "🧶", "🎩", "👑", "🐸", "🌵", "🍁", "🔥", "❄️", "🍬", "🥑", "🏀", "🚗", "❤️", "🦤", "🪶"];
const Fireworks: number[] = Array(6).fill(0);

export enum DifficultyLevel {
  EASY = 16,
  HARD = 36,
}

export enum GameState {
  ACTIVE,
  WON,
  INACTIVE,
  TIMEOUT,
}

export const getGameDefaultState = (cardsCount: number): CardProps[] => {
  let result: CardProps[] = [];

  for (let i = 0; i < cardsCount; i++) {
    result.push({ keyValue: uuidv4(), isFlipped: false, symbol: "", animate: true, animationDelay: ".3s", index: i, flip: () => {}, disabled: true, matched: false });
  }

  return result;
};

const DateTimeDisplay = (props: { value: string; type: string }) => {
  return <div>{props.value}</div>;
};

const ShowCounter = (props: { minutes: string; seconds: string }) => {
  console.log(props);
  return (
    <div className="fancy-text font-size-10vmin" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <DateTimeDisplay value={props.minutes} type={"m"} />:<DateTimeDisplay value={props.seconds} type={"s"} />
    </div>
  );
};

const CountdownTimer = (props: { targetTime: number; gameState: GameState; onGameEnd: () => void; visible: boolean }) => {
  const [minutes, seconds, countDown] = useCountdown({ seconds: props.targetTime, gameState: props.gameState });

  if (countDown <= 0 && props.gameState === GameState.ACTIVE) {
    props.onGameEnd();
  }
  if (props.visible) return <ShowCounter minutes={minutes} seconds={seconds} />;
  else return <></>;
};

const EndGameText = (props: { gameState: GameState }) => {
  if (props.gameState === GameState.WON) {
    return <div className="fancy-text font-size-10vmin">You Won!</div>;
  } else if (props.gameState === GameState.TIMEOUT) {
    return <div className="fancy-text font-size-10vmin">You Lose</div>;
  } else {
    return <></>;
  }
};

function Game() {
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>(DifficultyLevel.EASY);
  const [cardStates, dispatch] = useReducer(CardReducer, getGameDefaultState(difficultyLevel));
  const [gameState, setGameState] = useState<GameState>(GameState.INACTIVE);
  const [timeLimitValue, setTimeLimitValue] = useState<string>("");
  const [timeLimit, setTimeLimit] = useState<boolean>(false);

  useEffect(() => {
    let selectedCards: CardProps[] = cardStates.filter((x) => x.isFlipped && !x.matched);
    if (selectedCards.length === 2) {
      if (selectedCards[0].symbol !== selectedCards[1].symbol) {
        setTimeout(() => {
          unflipCards(selectedCards);
        }, 400);
      } else markCardAsMatched(selectedCards);
    }

    if (!cardStates.some((element) => element.disabled === false) && gameState === GameState.ACTIVE) {
      setGameState(GameState.WON);
    }
  }, [cardStates, gameState]);

  const handleTimeInputChange = (value: string) => {
    const valuePrepared: RegExpMatchArray | null = value
      .toString()
      .replace(/\D/g, "")
      .match(/[1-9][0-9]{0,2}/);
    setTimeLimitValue(valuePrepared ? valuePrepared[0] : "");
  };
  const unflipCards = (cardsToFlip: CardProps[]) => {
    cardsToFlip.forEach((element) => {
      dispatch({ type: ActionTypes.FLIP, payload: { animate: false, displaySymbol: true, disabled: false, flip: false, index: element.index, force: true, matched: false } });
    });
  };

  const onDifficultyChange = () => {
    if (gameState === GameState.INACTIVE) {
      const newDifficultyLevel: DifficultyLevel = difficultyLevel === DifficultyLevel.EASY ? DifficultyLevel.HARD : DifficultyLevel.EASY;
      setDifficultyLevel(newDifficultyLevel);
      dispatch({ type: ActionTypes.SETUP, payload: { cardCount: newDifficultyLevel } });
    }
  };

  const markCardAsMatched = (cardsToMark: CardProps[]) => {
    cardsToMark.forEach((item) => {
      dispatch({ type: ActionTypes.FLIP, payload: { animate: false, displaySymbol: true, disabled: true, flip: true, index: item.index, matched: true, force: true } });
    });
  };

  const flipCard = useCallback(
    (index: number) => {
      if (gameState === GameState.ACTIVE) {
        dispatch({ type: ActionTypes.FLIP, payload: { animate: false, displaySymbol: true, disabled: true, flip: true, index, matched: false, force: false } });
      }
    },
    [gameState]
  );

  const startGame = () => {
    setGameState(GameState.ACTIVE);
    dispatch({ type: ActionTypes.SETUP, payload: { cardCount: difficultyLevel } });
  };

  const resetGame = () => {
    setGameState(GameState.INACTIVE);
    dispatch({ type: ActionTypes.RESET });
  };

  const timeoutGame = () => {
    setGameState(GameState.TIMEOUT);
    dispatch({ type: ActionTypes.TIMEOUT });
  };

  return (
    <div>
      {Fireworks.map((item, index) => {
        return <div key={index} className={`${gameState === GameState.WON ? "firework" : ""}`}></div>;
      })}
      <ControlPanel
        ButtonConfigs={[
          { disabled: gameState !== GameState.INACTIVE, style: ButtonStyles.Green, text: "Start Game", onClick: startGame },
          { disabled: gameState === GameState.INACTIVE, style: ButtonStyles.Red, text: "Reset", onClick: resetGame },
        ]}
        onDifficultyChange={onDifficultyChange}
        difficultyLevel={difficultyLevel}
        disabled={gameState !== GameState.INACTIVE}
        onSetTimeLimit={handleTimeInputChange}
        timeLimitValue={timeLimitValue}
        timeLimit={timeLimit}
        onTimeLimitChange={(value: boolean) => {
          setTimeLimit(value);
        }}
      />
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {cardStates.map((item, index) => {
          return (
            <React.Fragment key={item.keyValue}>
              <Card key={item.keyValue} {...item} flip={flipCard} />
              {index > 0 && (index + 1) % Math.sqrt(cardStates.length) === 0 && <div className="line-break"></div>}
            </React.Fragment>
          );
        })}
      </div>
      <div>
        {timeLimit && gameState !== GameState.WON && gameState !== GameState.TIMEOUT && (
          <CountdownTimer gameState={gameState} targetTime={Number(timeLimitValue)} onGameEnd={timeoutGame} visible={timeLimit} key={gameState} />
        )}
      </div>
      <EndGameText gameState={gameState} />
    </div>
  );
}

export default Game;

export const utils = {
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

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  },
};

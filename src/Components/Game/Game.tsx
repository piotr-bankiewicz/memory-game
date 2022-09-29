import React, { ReactNode, useCallback, useEffect, useReducer, useState } from "react";
import { ActionTypes } from "../../State/Card.actions";
import Card, { CardProps } from "../Card/Card";
import ControlPanel from "../ControlPanel/ControlPanel";
import { ButtonStyles } from "../CustomButton/CustomButton";
import "./Game.css";
import { v4 as uuidv4 } from "uuid";
import { CardReducer } from "../../State/Card.reducer";
import Timer from "../Timer/Timer";
import DifficultyChanger from "../CustomDropDownItems/DifficultyChanger/DifficultyChanger";
import TimeLimit from "../CustomDropDownItems/TimeLimit/TimeLimit";

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

const EndGameInfo = (props: { gameState: GameState }) => {
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
  const [timerValue, setTimeValue] = useState<string>("");
  const [timerEnabled, setTimerEnabled] = useState<boolean>(false);

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
    setTimeValue(valuePrepared ? valuePrepared[0] : "");
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

  const onTimeLimitChange = (value: boolean) => {
    setTimerEnabled(value);
  };

  const DifficultyChangerInstance: ReactNode = DifficultyChanger({ currentDifficultyLevel: difficultyLevel, onDifficultyChange: onDifficultyChange });
  const TimeLimitInstance: ReactNode = TimeLimit({ onSetTimeLimit: handleTimeInputChange, timeLimitValue: timerValue, timeLimitEnabled: timerEnabled, onTimeLimitChange });

  return (
    <div>
      {Fireworks.map((item, index) => {
        return <div key={index} className={`${gameState === GameState.WON ? "firework" : ""}`}></div>;
      })}
      <ControlPanel
        ButtonConfigs={[
          { disabled: gameState !== GameState.INACTIVE || (timerEnabled && timerValue === ""), style: ButtonStyles.Green, text: "Start Game", onClick: startGame },
          { disabled: gameState === GameState.INACTIVE, style: ButtonStyles.Red, text: "Reset", onClick: resetGame },
        ]}
        customDropDownItems={[DifficultyChangerInstance, TimeLimitInstance]}
        disabled={gameState !== GameState.INACTIVE}
      />
      <div className="cards-wrapper">
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
        {timerEnabled && gameState !== GameState.WON && gameState !== GameState.TIMEOUT && (
          <Timer gameState={gameState} targetTime={Number(timerValue)} onGameEnd={timeoutGame} visible={timerEnabled} key={gameState} />
        )}
      </div>
      <EndGameInfo gameState={gameState} />
    </div>
  );
}

export default Game;

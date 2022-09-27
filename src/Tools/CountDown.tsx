import { useEffect, useState } from "react";
import { GameState } from "../Components/Game/Game";

const useCountdown = (props: { seconds: number; gameState: GameState }) => {
  const [countDown, setCountDown] = useState(props.seconds);

  useEffect(() => {
    if (props.gameState === GameState.ACTIVE) {
      const interval = setInterval(() => {
        setCountDown(countDown - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [countDown, props.gameState]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number): [minutes: string, seconds: string, countDown: number] => {
  // calculate time left
  const minutes: string = pad(Math.floor(countDown / 60), 2);
  const seconds: string = pad(countDown % 60, 2);

  return [minutes, seconds, countDown];
};

const pad = (num: number, size: number): string => {
  let result = num.toString();
  while (result.length < size) result = "0" + num;
  return result;
};

export default useCountdown;

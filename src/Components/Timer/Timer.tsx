import useCountdown from "../../Hooks/CountDown";
import { GameState } from "../Game/Game";

const TimerDisplay = (props: { minutes: string; seconds: string }) => {
  return (
    <div className="fancy-text font-size-10vmin" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div>{props.minutes}</div>:<div>{props.seconds}</div>
    </div>
  );
};

const Timer = (props: { targetTime: number; gameState: GameState; onGameEnd: () => void; visible: boolean }) => {
  const [minutes, seconds, countDown] = useCountdown({ seconds: props.targetTime, gameState: props.gameState });

  if (countDown <= 0 && props.gameState === GameState.ACTIVE) {
    props.onGameEnd();
  }
  if (props.visible) return <TimerDisplay minutes={minutes} seconds={seconds} />;
  else return <></>;
};

export default Timer;

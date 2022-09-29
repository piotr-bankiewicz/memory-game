import CustomButton, { ButtonStyles } from "../../CustomButton/CustomButton";
import { DifficultyLevel } from "../../Game/Game";
import "./DifficultyChanger.css";

export interface DifficultyChangerProps {
  currentDifficultyLevel: DifficultyLevel;
  onDifficultyChange: () => void;
}

const DifficultyChanger = (props: DifficultyChangerProps) => {
  return (
    <div
      onClick={(e) => {
        props.onDifficultyChange();
        e.stopPropagation();
      }}
      className="cursor-pointer"
    >
      Difficulty Level:{" "}
      <CustomButton
        disabled={false}
        text={Object.keys(DifficultyLevel)[Object.values(DifficultyLevel).indexOf(props.currentDifficultyLevel as unknown as DifficultyLevel)]}
        style={props.currentDifficultyLevel === DifficultyLevel.EASY ? ButtonStyles.Green : ButtonStyles.Red}
      ></CustomButton>
    </div>
  );
};

export default DifficultyChanger;

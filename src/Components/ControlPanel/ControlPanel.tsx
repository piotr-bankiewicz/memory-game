import CustomButton, { ButtonStyles } from "../CustomButton/CustomButton";
import "./ControlPanel.css";

const ControlPanel = () => {
  return (
    <>
      <CustomButton disabled={false} style={ButtonStyles.Green} text={"Start Game"} />
      <CustomButton disabled={false} style={ButtonStyles.Red} text={"Reset"} />
    </>
  );
};

export default ControlPanel;

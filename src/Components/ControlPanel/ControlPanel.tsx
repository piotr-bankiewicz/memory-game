import { ReactNode } from "react";
import CustomButton, { CustomButtonProps } from "../CustomButton/CustomButton";
import CustomDropDown from "../CustomDropDown/CustomDropDown";
import "./ControlPanel.css";

export interface ControlPanelProps {
  ButtonConfigs: CustomButtonProps[];
  disabled: boolean;
  customDropDownItems: ReactNode[];
}

const ControlPanel = (props: ControlPanelProps) => {
  return (
    <>
      <div>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "10px" }}>
          <h1 className="fancy-text" style={{ lineHeight: 1 }}>
            Memory Game
          </h1>
          <CustomDropDown disabled={props.disabled} items={props.customDropDownItems} />
        </div>
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          {props.ButtonConfigs.map((item, index) => (
            <CustomButton key={index} {...item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ControlPanel;

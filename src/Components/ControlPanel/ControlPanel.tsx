import { useEffect, useState } from "react";
import CustomButton, { CustomButtonProps } from "../CustomButton/CustomButton";
import { DifficultyLevel } from "../Game/Game";
import "./ControlPanel.css";

export interface ControlPanelProps {
  ButtonConfigs: CustomButtonProps[];
  difficultyLevel: DifficultyLevel;
  onDifficultyChange: () => void | undefined;
  disabled: boolean;
  onSetTimeLimit: (value: any) => void;
  timeLimitValue: any;
  timeLimit: boolean;
  onTimeLimitChange: (value: boolean) => void;
}

const ControlPanel = (props: ControlPanelProps) => {
  const [visibleDropDown, setVisibleDropdown] = useState<boolean>(false);

  useEffect(() => {
    const closeDropdownClick = () => {
      setVisibleDropdown(false);
      console.log("windowClick");
    };
    if (visibleDropDown) window.addEventListener("click", closeDropdownClick);
    else window.removeEventListener("click", closeDropdownClick);
  }, [visibleDropDown, props.difficultyLevel]);

  useEffect(() => {
    console.log("Time limit value: ", props.timeLimitValue);
  }, [props.timeLimitValue]);

  const handleTimeCheckBoxChange = (event: any) => {
    props.onTimeLimitChange(event.target.checked);
    props.onSetTimeLimit("");
  };

  return (
    <>
      <div>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "10px" }}>
          <h1 className="fancy-text" style={{ lineHeight: 1 }}>
            Memory Game
          </h1>
          <div style={{ display: "block" }} onClick={(e) => e.stopPropagation()}>
            <div
              className="dots"
              onClick={(e) => {
                console.log("dots clicked");
                if (!props.disabled) setVisibleDropdown(!visibleDropDown);
                e.stopPropagation();
              }}
            >
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <div className={`dropdown-content ${visibleDropDown ? "show" : ""}`}>
              <div
                className="item"
                onClick={(e) => {
                  props.onDifficultyChange();
                  e.stopPropagation();
                }}
              >
                Difficulty Level: {Object.keys(DifficultyLevel)[Object.values(DifficultyLevel).indexOf(props.difficultyLevel as unknown as DifficultyLevel)]}
              </div>
              <div className="item">
                Time Limit <input type="checkbox" onChange={handleTimeCheckBoxChange} checked={props.timeLimit} />
                {props.timeLimit && (
                  <input
                    style={{ width: "40px", marginLeft: "5px" }}
                    placeholder={"in sec"}
                    value={props.timeLimitValue}
                    onChange={(event) => {
                      props.onSetTimeLimit(event.target.value);
                    }}
                  ></input>
                )}
              </div>
            </div>
          </div>
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

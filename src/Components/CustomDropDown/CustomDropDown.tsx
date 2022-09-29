import { ReactNode, useEffect, useState } from "react";
import "./CustomDropDown.css";

export interface CustomDropDownProps {
  disabled: boolean;
  items: ReactNode[];
}

const CustomDropDown = (props: CustomDropDownProps) => {
  const [visibleDropDown, setVisibleDropdown] = useState<boolean>(false);

  useEffect(() => {
    const closeDropdownClick = () => {
      setVisibleDropdown(false);
      console.log("windowClick");
    };
    if (visibleDropDown) window.addEventListener("click", closeDropdownClick);
    else window.removeEventListener("click", closeDropdownClick);
  }, [visibleDropDown]);

  return (
    <div style={{ display: "block" }} onClick={(e) => e.stopPropagation()}>
      <div
        className="dots"
        onClick={(e) => {
          if (!props.disabled) setVisibleDropdown(!visibleDropDown);
          e.stopPropagation();
        }}
      >
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <div className={`dropdown-content ${visibleDropDown ? "show" : ""}`}>
        {props.items.map((item, index) => {
          return <div className="item">{item}</div>;
        })}
      </div>
    </div>
  );
};

export default CustomDropDown;

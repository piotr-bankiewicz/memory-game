import "./CustomButton.css";

export enum ButtonStyles {
  Green = "green-background",
  Red = "red-background",
}

export interface CustomButtonProps {
  style: ButtonStyles;
  disabled: boolean;
  text?: string;
  onClick?: () => void;
}

const CustomButton = (props: CustomButtonProps) => {
  return (
    <div className="bt-wrapper">
      <div className={`bt ${props.style} ${props.disabled ? "disabled" : ""}`} onClick={!props.disabled ? props.onClick : undefined}>
        <span>{props.text}</span>
      </div>
    </div>
  );
};

export default CustomButton;

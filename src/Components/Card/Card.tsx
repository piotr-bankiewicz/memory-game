import "./Card.css";

export interface CardProps {
  isFlipped?: boolean;
  symbol?: string;
  keyValue: number;
  animate?: boolean;
  animationDelay?: string;
  flip: (index: number) => void;
  index: number;
  displaySymbol?: boolean;
  disabled: boolean;
}

const Card = (props: CardProps) => {
  const CardCssClassName = () => {
    let result: string = "card";
    if (props.isFlipped) result += " is-flipped";
    if (props.animate) result += " card-animation";

    return result;
  };

  return (
    <>
      <div key={props.keyValue} className="scene">
        <div style={{ animationDelay: props.animationDelay }} className={CardCssClassName()} onClick={() => props.flip(props.index)}>
          <div className="card__face card__face--front"></div>
          <div className="card__face card__face--back">{props.displaySymbol ? props?.symbol : ""}</div>
        </div>
      </div>
    </>
  );
};

export default Card;

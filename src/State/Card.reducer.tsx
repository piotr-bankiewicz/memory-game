import { CardProps } from "../Components/Card/Card";
import { Symbols, getGameDefaultState } from "../Components/Game/Game";
import { utils } from "../Tools/Utils";
import { ActionTypes, CardActions } from "./Card.actions";
import { v4 as uuidv4 } from "uuid";

export const CardReducer = (state: CardProps[], action: CardActions): CardProps[] => {
  const stateCopy = state.slice();

  switch (action.type) {
    case ActionTypes.FLIP:
      if ((!stateCopy[action.payload.index].disabled && stateCopy.filter((x) => x.isFlipped && !x.matched).length < 2) || action.payload.force) {
        stateCopy[action.payload.index] = {
          ...stateCopy[action.payload.index],
          isFlipped: action.payload.flip,
          animate: action.payload.animate,
          displaySymbol: action.payload.displaySymbol,
          disabled: action.payload.disabled,
          matched: action.payload.matched,
        };
        return stateCopy;
      }
      return state;

    case ActionTypes.SETUP:
      let newState: CardProps[] = getGameDefaultState(action.payload.cardCount);
      let selectedPictures: string[] = utils.searchRandom(action.payload.cardCount / 2, Symbols);
      newState.map((item, index) => {
        item.symbol = selectedPictures[index % selectedPictures.length];
        item.keyValue = uuidv4();
        item.animationDelay = "0s";
        item.disabled = false;
        return item;
      });
      return utils.shuffle(newState).map((item, index) => {
        item.index = index;
        return item;
      });

    case ActionTypes.RESET:
      stateCopy.map((item, index) => {
        item.animate = true;
        item.symbol = "";
        item.displaySymbol = false;
        item.isFlipped = false;
        item.keyValue = uuidv4();
        return item;
      });
      return stateCopy;

    case ActionTypes.TIMEOUT:
      stateCopy.map((item, index) => {
        item.disabled = true;
        return item;
      });
      return stateCopy;
    default:
      return state;
  }
};

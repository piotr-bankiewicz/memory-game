export enum ActionTypes {
  FLIP,
  SETUP,
  RESET,
  TIMEOUT,
}

export type FlipCardAction = {
  type: ActionTypes.FLIP;
  payload: { flip: boolean; animate: boolean; displaySymbol: boolean; disabled: boolean; index: number; force: boolean; matched: boolean };
};

export type SetupCardsAction = {
  type: ActionTypes.SETUP;
  payload: { cardCount: number };
};

export type ResetCardsAction = {
  type: ActionTypes.RESET;
};

export type TimeoutGameAction = {
  type: ActionTypes.TIMEOUT;
};

export type CardActions = FlipCardAction | SetupCardsAction | ResetCardsAction | TimeoutGameAction;

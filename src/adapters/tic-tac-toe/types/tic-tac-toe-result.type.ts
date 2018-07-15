import { TicTacToePlayerEnum } from "../enums/tic-tac-toe-player.enum";

export type TicTacToeResult = {
  winner: TicTacToePlayerEnum;
  lastMove: number[];
};

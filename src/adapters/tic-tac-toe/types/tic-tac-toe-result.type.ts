import { TicTacToePlayerEnum } from "../enums/tic-tac-toe-player.enum";
import { TicTacToeBoard } from "./tic-tac-toe-board.type";

export type TicTacToeResult = {
  winner: TicTacToePlayerEnum;
  lastMove?: number[];
  invalidMove: boolean;
  board: TicTacToeBoard;
};

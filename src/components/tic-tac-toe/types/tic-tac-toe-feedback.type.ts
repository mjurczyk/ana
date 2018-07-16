import { TicTacToePlayerEnum } from 'adapters/tic-tac-toe/enums/tic-tac-toe-player.enum';
import { TicTacToeBoard } from 'adapters/tic-tac-toe/types/tic-tac-toe-board.type';

export class TicTacToeFeedback {
  winner: TicTacToePlayerEnum;
  didIWin: boolean;
  lastMove: number[];
  wasMyMoveWrong: boolean;
  wasIFirstPlayer: boolean;
  board: TicTacToeBoard;
};

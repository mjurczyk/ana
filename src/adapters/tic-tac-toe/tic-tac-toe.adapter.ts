import { flatten } from 'ramda';
import * as terminalKit from 'terminal-kit';
import { Adapter } from 'shared/decorators/adapter/adapter.decorator';
import { TicTacToeBoard } from './types/tic-tac-toe-board.type';
import { TicTacToeEnum } from './enums/tic-tac-toe.enum';
import { TicTacToePlayerEnum } from './enums/tic-tac-toe-player.enum';
import { TicTacToeResult } from './types/tic-tac-toe-result.type';
import { TicTacToeDeterministicResponse } from './types/tic-tac-toe-deterministic-response.type';

@Adapter()
export class TicTacToeAdapter {
  private terminal: any;
  private board: TicTacToeBoard = this.getClearBoard();
  private playerTurn: TicTacToePlayerEnum;
  private winner: TicTacToePlayerEnum;
  private lastPlayerMove: number[];
  private config;

  init(config?: {
    [TicTacToeEnum.circle]?: TicTacToeDeterministicResponse,
    [TicTacToeEnum.cross]?: TicTacToeDeterministicResponse
  }) {
    this.config = config;

    this.terminal = terminalKit.terminal;
    this.terminal.clear();

    this.nextTurn();
  }

  tick(): TicTacToeResult {
    this.checkResults();
    this.setHeadText('Basic TicTacToe');
    this.drawBoard();

    if (this.winner) {
      this.drawResults();

      return <TicTacToeResult>{
        winner: this.winner,
        lastMove: this.lastPlayerMove
      };
    } else {
      this.drawCurrentPlayer();
    }
  }

  reset(): void {
    this.board = this.getClearBoard();
    this.playerTurn = TicTacToePlayerEnum.first;
    this.winner = undefined;
  }

  getClearBoard(): TicTacToeBoard {
    return [
      [ 0, 0, 0 ],
      [ 0, 0, 0 ],
      [ 0, 0, 0 ]
    ];
  }

  setHeadText(text: string): void {
    this.terminal.moveTo(1, 1);
    this.terminal.cyan(text);
  }

  setPlayerTurn(player: TicTacToePlayerEnum): void {
    this.playerTurn = player;
  }

  nextTurn(): void {
    switch (this.playerTurn) {
      case TicTacToePlayerEnum.first:
        this.setPlayerTurn(TicTacToePlayerEnum.second);
        break;
      case TicTacToePlayerEnum.second:
        this.setPlayerTurn(TicTacToePlayerEnum.first);
        break;
      default:
        this.setPlayerTurn(TicTacToePlayerEnum.first);
    }
  }

  drawBoard(): void {
    const boardBaseCoordinates = [ 3, 3 ];
    this.terminal.moveTo(...boardBaseCoordinates);

    this.board.forEach((row: number[], rowIndex: number) => {
      row.forEach((column: number, columnIndex: number) => {
        this.terminal.moveTo(boardBaseCoordinates[0] + columnIndex, boardBaseCoordinates[1] + rowIndex);

        switch (column) {
          case TicTacToeEnum.none:
            this.terminal.gray('□');
            break;
          case TicTacToeEnum.circle:
            this.terminal.green('⊚');
            break;
          case TicTacToeEnum.cross:
            this.terminal.blue('✗');
            break;
          default:
            this.terminal.red('?');
            break;
        }
      });
    });
  }

  drawCurrentPlayer(): void {
    this.terminal.moveTo(1, 7);
    this.terminal.cyan(`Player ${this.playerTurn} turn... (eg. 1,1 ; 1,2 ; 2,2)`);

    this.askForMove();
  }

  askForMove(): void {
    this.terminal.moveTo(1, 8);
    this.terminal.eraseLine();

    if (this.config[this.playerTurn]) {
      const coordinates = this.config[this.playerTurn](this.lastPlayerMove);

      this.clearError();
      this.makeMove(coordinates);
    } else {
      this.terminal.inputField({
        cancelable: true
      }, (error, value) => {
        const coordinates = this.validateMove(value, () => this.askForMove());

        if (coordinates) {
          this.clearError();
          this.makeMove(coordinates);
        }
      });
    }
  }

  validateMove(move: string, errorCallback?: Function): number[] {
    const answerPattern = move.match(/([123]),([123])/) || [];
    const coordinates = [ parseInt(answerPattern[2]) - 1, parseInt(answerPattern[1]) - 1 ];

    if (!answerPattern || isNaN(coordinates[0]) || isNaN(coordinates[1])) {
      this.drawError('Invalid move, use X,Y notation.');
      
      if (typeof errorCallback === 'function') errorCallback();

      return;
    }

    const isEmpty = this.board[coordinates[0]][coordinates[1]] === TicTacToeEnum.none;

    if (!isEmpty) {
      this.drawError('Invalid move, field already taken.');
      
      if (typeof errorCallback === 'function') errorCallback();

      return;
    }

    return coordinates;
  }

  makeMove(coordinates): void {
    this.board[coordinates[0]][coordinates[1]] = this.playerTurn;
    this.lastPlayerMove = coordinates;

    this.nextTurn();
    this.tick();
  }

  drawError(error: string): void {
    this.terminal.moveTo(1, 10);
    this.terminal.red(`Error: ${error}`);
  }

  clearError(): void {
    this.terminal.moveTo(1, 10);
    this.terminal.eraseLine();
  }

  checkResults(): void {
    let winningPlayer: TicTacToePlayerEnum = this.checkStraights();

    if (!winningPlayer) {
      winningPlayer = this.checkDiagonals();
    }

    if (winningPlayer) {
      this.winner = winningPlayer;
      return;
    }

    if (!winningPlayer && !this.checkSolvability()) {
      this.drawError('This match cannot be won.');

      setTimeout(() => {
        this.reset();
      }, 2500);
    }
  }

  checkStraights(): TicTacToePlayerEnum {
    let winningPlayer: TicTacToePlayerEnum;

    this.board.forEach((direction: number[], directionIndex: number) => {
      const horizontal = this.board[0][directionIndex] === this.board[1][directionIndex] &&
        this.board[1][directionIndex] === this.board[2][directionIndex];
      const vertical = this.board[directionIndex][0] === this.board[directionIndex][1] &&
        this.board[directionIndex][1] === this.board[directionIndex][2];

      if (horizontal) {
        winningPlayer = this.board[0][directionIndex];
      }

      if (vertical) {
        winningPlayer = this.board[directionIndex][0];
      }
    });

    return winningPlayer;
  }

  checkDiagonals(): TicTacToePlayerEnum {
    let winningPlayer: TicTacToePlayerEnum;

    const primaryDiagonal = this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2];
    const secondaryDiagonal = this.board[2][0] === this.board[1][1] && this.board[1][1] === this.board[0][2];

    if (primaryDiagonal) {
      winningPlayer = this.board[0][0];
    }

    if (secondaryDiagonal) {
      winningPlayer = this.board[2][0];
    }

    return winningPlayer;
  }

  checkSolvability(): boolean {
    return flatten(this.board).filter((field) => field === TicTacToeEnum.none).length > 0;
  }

  drawResults(): void {
    this.terminal.moveTo(1, 7);
    this.terminal.eraseLine();
    this.terminal.cyan(`Player ${this.winner} won! 🎉`);

    setTimeout(() => {
      this.reset();
      this.tick();
    }, 2500);
  }
}

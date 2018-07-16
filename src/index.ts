import { Ana } from 'ana.module';
import { TicTacToeAdapter } from 'adapters/tic-tac-toe/tic-tac-toe.adapter';
import { TicTacToeEnum } from 'adapters/tic-tac-toe/enums/tic-tac-toe.enum';
import { TicTacToeFeedback } from 'components/tic-tac-toe/types/tic-tac-toe-feedback.type';
import { TicTacToeResult } from 'adapters/tic-tac-toe/types/tic-tac-toe-result.type';
import { TicTacToePlayerEnum } from 'adapters/tic-tac-toe/enums/tic-tac-toe-player.enum';

const anaAlpha = new Ana();
const anaBeta = new Ana();
const adapter = new TicTacToeAdapter();

adapter.init({
  [TicTacToeEnum.circle]: (previous: TicTacToeResult) => {
    const feedback = new TicTacToeFeedback();
    feedback.lastMove = previous.lastMove;
    feedback.winner = previous.winner;
    feedback.didIWin = (previous.winner as any) === TicTacToeEnum.circle;
    feedback.wasIFirstPlayer = (TicTacToeEnum.circle as any) === TicTacToePlayerEnum.first;
    feedback.wasMyMoveWrong = previous.invalidMove;
    feedback.board = previous.board;

    anaAlpha.learn(feedback);

    if (!feedback.winner) {
      const response = anaAlpha.respond();

      return response.TicTacToeComponent;
    }
  },
  [TicTacToeEnum.cross]: (previous: TicTacToeResult) => {
    const feedback = new TicTacToeFeedback();
    feedback.lastMove = previous.lastMove;
    feedback.winner = previous.winner;
    feedback.didIWin = (previous.winner as any) === TicTacToeEnum.cross;
    feedback.wasIFirstPlayer = (TicTacToeEnum.cross as any) === TicTacToePlayerEnum.first;
    feedback.wasMyMoveWrong = previous.invalidMove;
    feedback.board = previous.board;

    anaBeta.learn(feedback);

    if (!feedback.winner) {
      const response = anaBeta.respond();

      return response.TicTacToeComponent;
    }
  }
});
adapter.tick();

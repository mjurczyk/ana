import { Ana } from 'ana.module';
import { TicTacToeAdapter } from 'adapters/tic-tac-toe/tic-tac-toe.adapter';
import { TicTacToeEnum } from 'adapters/tic-tac-toe/enums/tic-tac-toe.enum';
import { TicTacToeResult } from 'adapters/tic-tac-toe/types/tic-tac-toe-result.type';

const ana = new Ana();
const adapter = new TicTacToeAdapter();

adapter.init({
  [TicTacToeEnum.circle]: (previous: TicTacToeResult) => {
    return [2, 2];
  }
});
adapter.tick();

import { TicTacToeComponent } from 'components/tic-tac-toe/tic-tac-toe.component';
import { Module } from 'shared/decorators/module/module.decorator';
import { CoreComponent } from 'components/core/core.component';

@Module({
  components: [
    TicTacToeComponent,
    CoreComponent
  ]
})
export class Ana {}

import { TicTacToeBasicComponent } from 'components/tic-tac-toe-basic/tic-tac-toe-basic.component';
import { Module } from 'shared/decorators/module/module.decorator';
import { CoreComponent } from 'components/core/core.component';

@Module({
  components: [
    TicTacToeBasicComponent,
    CoreComponent
  ]
})
export class Ana {}

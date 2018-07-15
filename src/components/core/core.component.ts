import { TicTacToeBasicComponent } from '../tic-tac-toe-basic/tic-tac-toe-basic.component';
import { Component } from 'shared/decorators/component/component.decorator';

@Component()
export class CoreComponent  {
  constructor(
    private ticTacToeComponent: TicTacToeBasicComponent
  ) {}

  init() {
    this.ticTacToeComponent.tick();
  }
  
}

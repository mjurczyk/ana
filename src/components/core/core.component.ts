import { TicTacToeComponent } from '../tic-tac-toe/tic-tac-toe.component';
import { Component } from 'shared/decorators/component/component.decorator';

@Component()
export class CoreComponent  {
  constructor(
    private ticTacToeComponent: TicTacToeComponent
  ) {}

  init() {
    this.ticTacToeComponent.tick();
  }
  
}

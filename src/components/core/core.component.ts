import { TicTacToeComponent } from '../tic-tac-toe/tic-tac-toe.component';
import { Component } from 'inject-me-timbers';
import { AbstractFeedback } from 'shared/types/feedback/abstract-feedback.type';

@Component()
export class CoreComponent {
  constructor(
    private ticTacToeComponent: TicTacToeComponent
  ) {}

  learn(feedback: AbstractFeedback) {

  }

  respond() {}
  
}

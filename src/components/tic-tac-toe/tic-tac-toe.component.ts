import { flatten } from 'ramda';
import * as brain from 'brain.js';
import { Component } from 'shared/decorators/component/component.decorator';

@Component()
export class TicTacToeComponent  {
  private neuralNetwork: brain.NeuralNetwork;

  constructor() {}

  init() {
    this.getNeuralNetwork();
  }

  getNeuralNetwork(): void {
    this.neuralNetwork = new brain.NeuralNetwork();
    this.neuralNetwork.train([
      {
        input: this.imagineBoard(),
        output: [ 0, 0 ]
      },
      {
        input: this.imagineBoard([
          [ 1, 1 ]
        ]),
        output: [ 1, 0 ]
      }
    ]);
  }

  tick(): void {
    const result: number[] = this.neuralNetwork.run(this.imagineBoard());
    const pick = result.map((answer) => Math.round(answer));

    console.info('tick', pick);
  }

  imagineBoard(ones: number[][] = []): any {
    const board: number[][] = [
      [ 0, 0, 0 ],
      [ 0, 0, 0 ],
      [ 0, 0, 0 ]
    ];

    ones.forEach((coordinates: [ number, number ]) => {
      board[coordinates[0]][coordinates[1]] = 1;
    });

    return flatten(board);
  }
}

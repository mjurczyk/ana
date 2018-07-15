import * as brain from 'brain.js';
import { Component } from 'shared/decorators/component/component.decorator';

@Component()
export class TicTacToeBasicComponent  {
  constructor() {}

  init() {}

  tick(): void {
    console.info('tick');
  }
}

import { forEachObjIndexed } from 'ramda';
import { TicTacToeComponent } from 'components/tic-tac-toe/tic-tac-toe.component';
import { Module } from 'shared/decorators/module/module.decorator';
import { CoreComponent } from 'components/core/core.component';
import { AnaModuleInterface } from 'shared/interfaces/ana-module/ana-module.interface';
import { AbstractFeedback } from 'shared/types/feedback/abstract-feedback.type';

@Module({
  components: [
    TicTacToeComponent,
    CoreComponent
  ]
})
export class Ana implements AnaModuleInterface {
  private components;

  constructor() {
    this.getComponents();
  }

  learn(feedback: AbstractFeedback): void {
    forEachObjIndexed((component) => component.learn(feedback))(this.components);
  }

  respond(): any {
    let combinedResponse = {};

    forEachObjIndexed((component, key) => {
      combinedResponse[key] = component.respond();
    })(this.components);

    return combinedResponse;
  }

  getComponents() {
    this.components = (this as any).__components__;
  }
}

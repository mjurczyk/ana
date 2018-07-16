import * as moment from 'moment';
import { flatten } from 'ramda';
import * as brain from 'brain.js';
import { Component } from 'shared/decorators/component/component.decorator';
import { TicTacToeFeedback } from './types/tic-tac-toe-feedback.type';
import { AbstractFeedback } from 'shared/types/feedback/abstract-feedback.type';
import * as fs from 'fs-extra';
import { TicTacToeBoard } from 'adapters/tic-tac-toe/types/tic-tac-toe-board.type';

@Component()
export class TicTacToeComponent {
  private sessionId = moment().format('DDMMYYY-HHmm');
  private neuralNetwork: brain.NeuralNetwork;
  private sessionsMemory: any[];
  private currentSession: string = '';
  private currentMoveInvalid: boolean;
  private currentBoardState: TicTacToeBoard;

  private latestSessionRecordingPath = './sessions/latest/recording.json';

  constructor() {}

  init() {
    this.getLatestSessionRecordings();
    this.getNeuralNetwork();
  }

  getLatestSessionRecordings(): void {
    let recordings;

    try {
      recordings = fs.readJsonSync(this.latestSessionRecordingPath);
    } catch (error) {
      recordings = [
        {
          input: '00',
          output: [ 1, 1 ]
        }
      ];
    }

    this.sessionsMemory = recordings;
  }

  learn(feedback: AbstractFeedback) {
    if (feedback instanceof TicTacToeFeedback) {
      this.currentMoveInvalid = feedback.wasMyMoveWrong;
      this.currentBoardState = feedback.board;

      if (!feedback.wasMyMoveWrong && feedback.lastMove) {
        this.currentSession += feedback.lastMove.join('');
      }

      if (feedback.winner) {
        let qeueShift = '';

        if ((feedback.wasIFirstPlayer && feedback.didIWin) || (!feedback.wasIFirstPlayer && !feedback.didIWin)) {
          qeueShift = '00';
        }

        this.currentSession = `${qeueShift}${this.currentSession}`;

        let learnedMoves = [];
        let pattern = '';

        this.currentSession.split(/(\d{4})/g).filter(Boolean)
          .map(pair => {
            const moves = pair.split(/(\d{2})/g).filter(Boolean);

            if (moves.length === 2) {
              const responseMove = [ parseInt(moves[1].substr(0, 1)), parseInt(moves[1].substr(1, 1)) ]

              const response = {
                input: `${pattern}${moves[0]}`,
                output: responseMove
              };

              learnedMoves.push(response);

              pattern += pair;
            }
          });

        this.sessionsMemory.push(...learnedMoves);

        const sessionRecordingPath = `./sessions/${this.sessionId}/recording.json`;

        fs.ensureFileSync(sessionRecordingPath);
        fs.writeJsonSync(sessionRecordingPath, this.currentSession);

        fs.ensureFileSync(this.latestSessionRecordingPath);
        fs.writeJsonSync(this.latestSessionRecordingPath, this.sessionsMemory);

        this.neuralNetwork.train(this.sessionsMemory);
        this.currentSession = '';
      }
    }
  }

  getNeuralNetwork(): void {
    this.neuralNetwork = new brain.NeuralNetwork({
      activation: 'sigmoid',
      binaryThresh: 0.5,
      hiddenLayers: [ 10, 10, 10 ]
    });
    this.neuralNetwork.train(this.sessionsMemory);
  }

  respond(): string {
    if (this.currentMoveInvalid) {
      const availableFields = this.currentBoardState.reduce((fields: number[][], row: number[], rowIndex: number) => {
        return fields.concat(row.map((column: number, columnIndex: number) => column === 0 ? [ rowIndex, columnIndex ] : undefined)
          .filter(value => typeof value !== undefined));
      }, []).filter(Boolean);

      const alternativePick = availableFields[Math.floor(Math.random() * availableFields.length)];

      this.currentSession += alternativePick.join('');

      return alternativePick.map((answer) => answer + 1).reverse().join(',');
    }

    const result: number[] = this.neuralNetwork.run(this.currentSession);
    const pick = result.map((answer) => Math.round(answer));

    this.currentSession += pick.join('');

    return pick.map((answer) => answer + 1).reverse().join(',');
  }
}

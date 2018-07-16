import 'reflect-metadata';
import { AbstractFeedback } from '../../types/feedback/abstract-feedback.type';

export function Component(config: {
  acceptFeedback?: AbstractFeedback[]
} = {}) {
  return (component => {
    Reflect.defineMetadata('ai:feedback', config.acceptFeedback, component);
  });
}

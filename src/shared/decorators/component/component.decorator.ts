import 'reflect-metadata';

import { ModuleComponentType } from '../module/module.decorator';

export type ComponentConstructor = (ModuleComponentType) => ModuleComponentType;

export function Component(): ComponentConstructor {
  return ((component: ModuleComponentType) => component);
}

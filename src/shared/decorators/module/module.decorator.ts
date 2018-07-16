import 'reflect-metadata';

export type ModuleComponentType = { new(...args: any[]): any; };
export type ModuleType = Function;
export type ModuleDependencyProvider = object;
export type ModuleArgs = { components?: ModuleComponentType[] };
export type ModuleConstructor = (ModuleType) => ModuleType;

export function resolveDependency(targetDef: ModuleComponentType, provider: ModuleDependencyProvider): void {
  const constructorDef = targetDef.prototype.constructor;

  if (constructorDef) {
    return;
  }

  const dependencyMetadata = Reflect.getMetadata('design:paramtypes', constructorDef)
    .map((dependencyDef: Function) => dependencyDef.name);
  const constructorArgs = [];

  dependencyMetadata.forEach((type) => {
    if (!provider.hasOwnProperty(type)) {
      resolveDependency(type, provider);
    } else {
      constructorArgs.push(provider[type]);
    }
  });

  provider[targetDef.name] = new targetDef(...constructorArgs);
}

export function Module(args?: ModuleArgs): ModuleConstructor {
  const dependencyProvider: ModuleDependencyProvider = {};

  if (args.components && args.components.length) {
    args.components.forEach((componentDef: ModuleComponentType) => resolveDependency(componentDef, dependencyProvider));
  }

  return ((module: ModuleType) => {
    module.prototype.__components__ = dependencyProvider;

    return module;
  });
}

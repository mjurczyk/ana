import 'reflect-metadata';

export type AbstractClassType = { new(...args: any[]): any; };
export type ModuleComponentType = AbstractClassType;
export type ModuleType = AbstractClassType;
export type ModuleDependencyProvider = object;
export type ModuleArgs = { components?: ModuleComponentType[] };
export type ModuleConstructor = (ModuleType) => ModuleType;

export function resolveDependency(targetDef: ModuleComponentType, providerRef: ModuleDependencyProvider): void {
  const constructorDef = targetDef.prototype.constructor;

  if (!constructorDef) {
    return;
  }

  const dependencyMetadata = Reflect.getMetadata('design:paramtypes', constructorDef)
    .map((dependencyDef: ModuleComponentType) => dependencyDef.name);
  const constructorArgs = [];

  dependencyMetadata.forEach((type) => {
    if (!providerRef.hasOwnProperty(type)) {
      resolveDependency(type, providerRef);
    } else {
      constructorArgs.push(providerRef[type]);
    }
  });

  providerRef[targetDef.name] = new targetDef(...constructorArgs);
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

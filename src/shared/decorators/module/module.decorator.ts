import 'reflect-metadata';

export type ModuleType = any;

export type ModuleParts = {
  components?: Function[]
}

export function _resolveDependency(target, provider) {
  const constructorDef = target.prototype.constructor;
  const argTypes = Reflect.getMetadata('design:paramtypes', constructorDef)
    .map((param) => param.name);
  const argDefs = [];

  argTypes.forEach((type) => {
    if (!provider.hasOwnProperty(type)) {
      _resolveDependency(type, provider);
    } else {
      argDefs.push(provider[type]);
    }
  });

  provider[target.name] = new target(...argDefs);
  
  if (typeof provider[target.name].init === 'function') {
    provider[target.name].init();
  }

  return provider[target.name];
}

export function Module(parts?: ModuleParts) {
  const provider = {};

  parts.components.forEach(component => _resolveDependency(component, provider));

  return (constructor: ModuleType) => {
    console.info('module', 'override');

    return constructor;
  };
}

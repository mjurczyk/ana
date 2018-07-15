import 'reflect-metadata';

export function Component() {
  return (component: any) => {
    console.info('component', 'override');

    return component;
  };
}

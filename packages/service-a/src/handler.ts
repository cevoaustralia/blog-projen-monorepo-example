import { sayHello } from '@my-app/shared-lib';

export const handler = async () => {
  return `${sayHello()} This is service a!!`;
};

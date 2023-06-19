import { sayHello } from './';

describe('Greeting', () => {
  it('says hello', () => {
    expect(sayHello()).toEqual('Hello, there!');
  });
});

export class WrongConfigError extends Error {
  constructor() {
    super(
      'Wrong configuration in the .env file, please check the documentation',
    );
    this.name = 'WrongConfigError';
  }
}

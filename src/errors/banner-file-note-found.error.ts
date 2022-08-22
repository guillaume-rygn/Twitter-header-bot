export class BannerFileNotFoundError extends Error {
  constructor() {
    super('Banner file not found');
    this.name = 'BannerFileNotFoundError';
  }
}

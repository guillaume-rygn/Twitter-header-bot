import { Injectable } from '@nestjs/common';

@Injectable()
export class ProgressService {
  abbreviateInt(numberToAbbreviate: number): string {
    if (numberToAbbreviate < 1000) {
      return numberToAbbreviate.toString();
    }

    const numOfDigits = numberToAbbreviate.toString().length;
    const unit = numOfDigits - (numOfDigits % 3 || 3);

    return (
      Math.floor(numberToAbbreviate / Math.pow(10, unit)) + ' kMB'[unit / 3]
    );
  }

  previousCheckpoint(previous: number): number {
    if (previous < 100) {
      return 0;
    }

    if (previous < 1000) {
      return Math.floor(previous / 100) * 100;
    }

    const numOfDigits = previous.toString().length;
    const num = Math.floor(
      previous / Math.pow(10, numOfDigits - (numOfDigits % 3 || 3)),
    );

    return num * Math.pow(10, numOfDigits - num.toString().length);
  }

  nextCheckpoint(next: number): number {
    if (next < 100) {
      return 100;
    }

    if (next < 1000) {
      return (Math.floor(next / 100) + 1) * 100;
    }

    const numOfDigits = next.toString().length;
    const num = Math.floor(
      next / Math.pow(10, numOfDigits - (numOfDigits % 3 || 3)),
    );

    return (num + 1) * Math.pow(10, numOfDigits - num.toString().length);
  }

  getProgress(followersCount: number): string {
    const prev = this.previousCheckpoint(followersCount);
    const next = this.nextCheckpoint(followersCount);

    const greenCubes = '🟩'.repeat(
      Math.floor((followersCount - prev) / ((next - prev) / 5)),
    );
    const yellowCube =
      ((followersCount - prev) / ((next - prev) / 5)) % 1 !== 0 ? '🟨' : '';
    const cubes = (greenCubes + yellowCube).padEnd(10, '⬜️');

    return `${this.abbreviateInt(prev)} ${cubes} ${this.abbreviateInt(
      next,
    )} followers`;
  }
}

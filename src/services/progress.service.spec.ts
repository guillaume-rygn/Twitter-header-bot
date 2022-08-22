import { Test, TestingModule } from '@nestjs/testing';
import { ProgressService } from './';

describe('ProgressService', () => {
  let service: ProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgressService],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('abbreviateInt', () => {
    it('should be defined', () => {
      expect(service.abbreviateInt).toBeDefined();
    });

    it('should return the number to string if under 1000', () => {
      expect(service.abbreviateInt(999)).toBe('999');
      expect(service.abbreviateInt(10)).toBe('10');
      expect(service.abbreviateInt(1)).toBe('1');
      expect(service.abbreviateInt(0)).toBe('0');
    });

    it('should return the number abbreviated above 1000', () => {
      expect(service.abbreviateInt(1000)).toBe('1k');
      expect(service.abbreviateInt(1855)).toBe('1k');
      expect(service.abbreviateInt(8521)).toBe('8k');
    });

    it('should return the number abbreviated above 100.000', () => {
      expect(service.abbreviateInt(100000)).toBe('100k');
      expect(service.abbreviateInt(108700)).toBe('108k');
      expect(service.abbreviateInt(180700)).toBe('180k');
      expect(service.abbreviateInt(191700)).toBe('191k');
      expect(service.abbreviateInt(478700)).toBe('478k');
    });

    it('should return the number abbreviated above 100.000.000', () => {
      expect(service.abbreviateInt(100000000)).toBe('100M');
      expect(service.abbreviateInt(180000000)).toBe('180M');
      expect(service.abbreviateInt(184000000)).toBe('184M');
      expect(service.abbreviateInt(899000000)).toBe('899M');
    });

    it('should return the number abbreviated above 100.000.000.000', () => {
      expect(service.abbreviateInt(100000000000)).toBe('100B');
      expect(service.abbreviateInt(180000000000)).toBe('180B');
      expect(service.abbreviateInt(184000000000)).toBe('184B');
      expect(service.abbreviateInt(899000000000)).toBe('899B');
    });
  });

  describe('previousCheckpoint', () => {
    it('should be defined', () => {
      expect(service.previousCheckpoint).toBeDefined();
    });

    it('should return 0 if inferior to 100', () => {
      expect(service.previousCheckpoint(99)).toBe(0);
      expect(service.previousCheckpoint(9)).toBe(0);
      expect(service.previousCheckpoint(1)).toBe(0);
      expect(service.previousCheckpoint(0)).toBe(0);
    });

    it('should return the previous check point by slice of 1000', () => {
      expect(service.previousCheckpoint(100)).toBe(100);
      expect(service.previousCheckpoint(2454)).toBe(2000);
      expect(service.previousCheckpoint(3000)).toBe(3000);
      expect(service.previousCheckpoint(3452)).toBe(3000);
      expect(service.previousCheckpoint(8542)).toBe(8000);
      expect(service.previousCheckpoint(15450)).toBe(15000);
    });
  });

  describe('nextCheckpoint', () => {
    it('should be defined', () => {
      expect(service.nextCheckpoint).toBeDefined();
    });

    it('should return 100 if inferior to 100', () => {
      expect(service.nextCheckpoint(99)).toBe(100);
      expect(service.nextCheckpoint(9)).toBe(100);
      expect(service.nextCheckpoint(1)).toBe(100);
      expect(service.nextCheckpoint(0)).toBe(100);
    });

    it('should return next check point by slice of 100', () => {
      expect(service.nextCheckpoint(100)).toBe(200);
      expect(service.nextCheckpoint(180)).toBe(200);
      expect(service.nextCheckpoint(845)).toBe(900);
    });

    it('should return next check point by slice of 1000', () => {
      expect(service.nextCheckpoint(2454)).toBe(3000);
      expect(service.nextCheckpoint(3000)).toBe(4000);
      expect(service.nextCheckpoint(3452)).toBe(4000);
      expect(service.nextCheckpoint(8542)).toBe(9000);
      expect(service.nextCheckpoint(15450)).toBe(16000);
    });
  });

  describe('getProgress', () => {
    it('should be defined', () => {
      expect(service.getProgress).toBeDefined();
    });

    it('should return 0 🟨⬜️⬜️⬜️⬜️ 100 followers', () => {
      expect(service.getProgress(4)).toBe('0 🟨⬜️⬜️⬜️⬜️ 100 followers');
    });

    it('should return 0 🟩🟨⬜️⬜️⬜️ 100 followers', () => {
      expect(service.getProgress(27)).toBe('0 🟩🟨⬜️⬜️⬜️ 100 followers');
    });

    it('should return 0 🟩🟩🟨⬜️⬜️ 100 followers', () => {
      expect(service.getProgress(57)).toBe('0 🟩🟩🟨⬜️⬜️ 100 followers');
    });

    it('should return 0 🟩🟩🟩🟨⬜️ 100 followers', () => {
      expect(service.getProgress(78)).toBe('0 🟩🟩🟩🟨⬜️ 100 followers');
    });

    it('should return 0 🟩🟩🟩🟩🟨 100 followers', () => {
      expect(service.getProgress(95)).toBe('0 🟩🟩🟩🟩🟨 100 followers');
    });

    it('should return 1k 🟨⬜️⬜️⬜️⬜️ 2k followers', () => {
      expect(service.getProgress(1101)).toBe('1k 🟨⬜️⬜️⬜️⬜️ 2k followers');
    });

    it('should return 1k 🟩🟨⬜️⬜️⬜️ 2k followers', () => {
      expect(service.getProgress(1250)).toBe('1k 🟩🟨⬜️⬜️⬜️ 2k followers');
    });

    it('should return 1k 🟩🟩🟨⬜️⬜️ 2k followers', () => {
      expect(service.getProgress(1445)).toBe('1k 🟩🟩🟨⬜️⬜️ 2k followers');
    });

    it('should return 1k 🟩🟩🟩🟨⬜️ 2k followers', () => {
      expect(service.getProgress(1685)).toBe('1k 🟩🟩🟩🟨⬜️ 2k followers');
    });

    it('should return 1k 🟩🟩🟩🟩🟨 2k followers', () => {
      expect(service.getProgress(1865)).toBe('1k 🟩🟩🟩🟩🟨 2k followers');
    });
  });
});

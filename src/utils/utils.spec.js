import {
  generateRoomCode,
  generateBoard,
  generateKeyCard,
} from './';

describe('utils', () => {
  describe('generateRoomCode', () => {
    it('should return a string of length 4');
    it('should only contain alphanumeric characters');
    it('should never return a room code that is already taken');
  });

  describe('generateBoard', () => {
    it('should return a 5-by-5 array');
    it('should include 25 unique, non-empty strings');
  });

  describe('generateKeyCard', () => {
    it('should return an object specifying the startingTeam and config');
    it('should only set startingTeam to BLUE or RED');
    describe('config', () => {
      it('should be a 5-by-5 array');
      it('should only contain values RED, BLUE, ASSASSIN, or NEUTRAL');
      it('should have the correct number of RED or BLUE tiles based on startingTeam');
      it('should include exactly one ASSASSIN');
    });
  });
});

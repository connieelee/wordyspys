/* eslint-disable arrow-body-style */
import db from './firebase/db';
import {
  generateRoomCode,
  generateBoard,
  generateKeyCard,
} from './utils';

describe('utils', () => {
  describe('generateRoomCode', () => {
    it('returns a promise for a four-long alphanumeric string', () => {
      return expect(generateRoomCode()).resolves.toMatch(/^[a-zA-Z0-9]{4}$/);
    });
    it('never resolves to a room code in use', () => {
      return generateRoomCode()
        .then(code => db.ref(`rooms/${code}`).once('value'))
        .then(snapshot => expect(snapshot.val()).toBe(null));
    });
  });

  describe('generateBoard', () => {
    let board;
    let cards = [];
    beforeEach(() => {
      return generateBoard()
        .then(_board => {
          board = _board;
          board.forEach(row => row.forEach(card => cards.push(card)));
        });
    });
    afterEach(() => { cards = []; });

    it('returns a promise for a 5-by-5 array (board) of objects (cards)', () => {
      expect(board).toHaveLength(5);
      board.forEach(row => {
        expect(row).toHaveLength(5);
        row.forEach(card => expect(card).toEqual(expect.any(Object)));
      });
    });
    it('cards should each hold a unique `word` (non-empty string)', () => {
      const words = {};
      cards.forEach(card => {
        const word = card.word;
        expect(word).not.toBeFalsy();
        expect(words[word]).toBeFalsy();
        words[word] = true;
      });
    });
    it('cards should have a valid `status` property', () => {
      const validStatuses = ['UNTOUCHED', 'RED', 'BLUE', 'ASSASSIN', 'NEUTRAL'];
      cards.forEach(card => {
        expect(validStatuses).toContain(card.status);
      });
    });
  });

  describe('generateKeyCard', () => {
    let keyCard;
    beforeEach(() => {
      return generateKeyCard()
    });
    it('returns a promise for an object with keys `startingTeam` and `config`');
    it('should only set startingTeam to BLUE or RED');
    describe('config', () => {
      it('should be a 5-by-5 array');
      it('should only contain values RED, BLUE, ASSASSIN, or NEUTRAL');
      it('should have the correct number of RED or BLUE tiles based on startingTeam');
      it('should include exactly one ASSASSIN');
    });
  });
});

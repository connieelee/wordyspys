import db from '../firebase/db';
import {
  generateRoomCode,
  generateBoard,
  generateKeyCard,
} from '../utils';

describe('utils', () => {
  describe('generateRoomCode', () => {
    it('returns a promise for a four-long alphanumeric string', () => (
      expect(generateRoomCode()).resolves.toMatch(/^[a-zA-Z0-9]{4}$/)
    ));
    it('never resolves to a room code in use', () => (
      generateRoomCode()
      .then(code => db.ref(`rooms/${code}`).once('value'))
      .then(snapshot => expect(snapshot.val()).toBe(null))
    ));
  });

  describe('generateBoard', () => {
    let board;
    let cards;
    beforeEach(() => {
      cards = [];
      return generateBoard()
      .then(_board => {
        board = _board;
        board.forEach(row => row.forEach(card => cards.push(card)));
      });
    });

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
        expect(word).toBeTruthy();
        expect(words[word]).toBeFalsy();
        words[word] = true;
      });
    });
    it('cards should have a valid `status` property', () => {
      const validStatuses = /UNTOUCHED|RED|BLUE|ASSASSIN|NEUTRAL/;
      cards.forEach(card => {
        expect(card.status).toEqual(expect.stringMatching(validStatuses));
      });
    });
  });

  describe('generateKeyCard', () => {
    let keyCard;
    beforeEach(() => { keyCard = generateKeyCard(); });

    describe('returns an object', () => {
      it('with keys `startingTeam` and `keys`', () => {
        expect(keyCard.startingTeam).toBeTruthy();
        expect(keyCard.keys).toBeTruthy();
      });
      it('startingTeam should be RED or BLUE', () => {
        expect(keyCard.startingTeam).toEqual(expect.stringMatching(/RED|BLUE/));
      });
    });

    describe('keys', () => {
      let flattenedKeys;
      beforeEach(() => {
        flattenedKeys = [];
        keyCard.keys.forEach(row => {
          row.forEach(key => flattenedKeys.push(key));
        });
      });

      it('should be a 5-by-5 array', () => {
        expect(keyCard.keys).toHaveLength(5);
        keyCard.keys.forEach(row => {
          expect(row).toHaveLength(5);
        });
      });
      it('should only contain values RED, BLUE, ASSASSIN, or NEUTRAL', () => {
        const validKeys = /RED|BLUE|ASSASSIN|NEUTRAL/;
        flattenedKeys.forEach(key => {
          expect(key).toEqual(expect.stringMatching(validKeys));
        });
      });
      it('should have correct numbers of each key', () => {
        const counter = {
          RED: 0,
          BLUE: 0,
          NEUTRAL: 0,
          ASSASSIN: 0,
        };
        flattenedKeys.forEach(key => { counter[key] += 1; });
        expect(counter.RED).toEqual(keyCard.startingTeam === 'RED' ? 9 : 8);
        expect(counter.BLUE).toEqual(keyCard.startingTeam === 'BLUE' ? 9 : 8);
        expect(counter.NEUTRAL).toEqual(7);
        expect(counter.ASSASSIN).toEqual(1);
      });
    });
  });
});

/* eslint-disable arrow-body-style */
import firebase from 'firebase';
import initializeFirebaseApp from './initFirebaseApp';
import {
  generateRoomCode,
  generateBoard,
  generateKeyCard,
} from './';

describe('utils', () => {
  initializeFirebaseApp();
  const db = firebase.database();

  describe('generateRoomCode', () => {
    it('returns a promise for a four-long alphanumeric string', () => {
      return expect(generateRoomCode(db)).resolves.toMatch(/^[a-zA-Z0-9]{4}$/);
    });
    it('never resolves to a room code in use', () => {
      return generateRoomCode(db)
        .then(code => db.ref(`rooms/${code}`).once('value'))
        .then(snapshot => expect(snapshot.val()).toBe(null));
    });
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

import db from '../src/firebase/db';
import words from './words';

const seedWords = db.ref('words').set(words);
const reserveTestRoom = db.ref('rooms/test').set({ roomCode: 'test' });

Promise.all([seedWords, reserveTestRoom])
.then(() => console.log('Seeding complete, ctrl+c to exit'))
.catch(err => console.error(err));

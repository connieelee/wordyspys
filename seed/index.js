import db from '../src/firebase/db';
import words from './words';
import room from './room';

const seedWords = db.ref('words').set(words);
const seedTestRoom = db.ref('rooms/test').set(room);

Promise.all([seedWords, seedTestRoom])
.then(() => console.log('Seeding complete, ctrl+c to exit'))
.catch(err => console.error(err));

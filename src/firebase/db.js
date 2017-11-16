import firebase from 'firebase';
import initializeFirebaseApp from './initialize';

initializeFirebaseApp();
export default firebase.database();

import { initializeApp } from 'firebase/app';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import firebaseConfig from './firebaseConfig';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const database = getDatabase(app)

export default app;

export { auth, database };
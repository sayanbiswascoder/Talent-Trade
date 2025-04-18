import { initializeApp } from 'firebase/app';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import firebaseConfig from './firebaseConfig';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app;

export { auth };
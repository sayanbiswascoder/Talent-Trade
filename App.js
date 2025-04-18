import React from 'react';
import { View} from 'react-native';
import firebase from './firebase/firebase';
import AuthContext from './contexts/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

const app = firebase;

const App = () => {
  const AuthProvider = ({ children }) => {
    return (
      <AuthContext.Provider value={{}}>
        {children}
      </AuthContext.Provider>
      );
  };
  
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};
export default App;
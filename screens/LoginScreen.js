// import React, { useEffect, useState, useContext } from 'react';
// import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// import { useNavigation } from '@react-navigation/native';
// import app from '../firebase/firebase';
// import { AuthContext } from '@/contexts/AuthContext';
// 
// const LoginScreen = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const auth = getAuth(app);
//   const navigation = useNavigation();
// 
//   const [user, setUser] = useState(null);
//   const { user: authUser } = useContext(AuthContext);
// 
//   useEffect(()=> {
//     console.log(user)
//     if(user) {
//       navigation.reset()
//       navigation.navigate('Matching')
//     }
//   }, [user])
// 
//   const handleLogin = () => {
//     signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       navigation.navigate('Profile');
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.log('Login error:', errorCode, errorMessage);
//     });
//   };
// 
//   return (
//     <View style={styles.mainView}>
//         <TextInput
//             style={styles.input}
//             placeholder="Email"
//             onChangeText={setEmail}
//             value={email}
//         />
//         <TextInput style={styles.input} placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry={true}/>
//         <Button title="Login" onPress={handleLogin} />
//         <Text>Don't have an acount? <TouchableOpacity onPress={()=> navigation.navigate("Signup")}><Text>Sign Up</Text></TouchableOpacity></Text>
//     </View>
// 
//   );
// };
// 
// const styles = StyleSheet.create({
//   mainView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     marginBottom: 20,
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//     input: {
//     width: '80%',
//     marginBottom: 10,
//     borderWidth: 1,
//         padding: 10,
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
// });
// 
// export default LoginScreen;

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import app from '../firebase/firebase';
import messaging from '@react-native-firebase/messaging';
import { AuthContext } from '@/contexts/AuthContext';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const auth = getAuth();
  const navigation = useNavigation();
  const { user: authUser } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // setUser(user);
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      
      const db = getFirestore(app);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        fcmToken: token
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'Matching' }],
      });
    } catch (error) {
      let errorMessage = 'An error occurred during login';
      console.log(error)
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // setLoading(true);
      // setError('');
// 
      // await GoogleSignin.signOut()
// 
      // await GoogleSignin.hasPlayServices();
// 
      // const { data } = await GoogleSignin.signIn();
// 
      // console.log(data)
      // 
      // const provider = new GoogleAuthProvider();
      // const result = await signInWithPopup(auth, provider);
      // const user = result.user;
      // 
      // setUser(user);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Profile' }],
      });
    } catch (error) {
      setError('Failed to sign in with Google');
      console.error('Google sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    navigation.navigate("Signup");
  };

  const navigateToForgotPassword = () => {
    // navigation.navigate("ForgotPassword");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subTitle}>Log in to continue</Text>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={
              showPassword
                ? { uri: 'https://img.icons8.com/ios-filled/50/000000/visible.png' }
                : { uri: 'https://img.icons8.com/ios-filled/50/000000/invisible.png' }
            }
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={navigateToForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.loginButton, loading && styles.disabledButton]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.orText}>Or log in with</Text>
      
      <TouchableOpacity 
        style={[styles.googleButton, loading && styles.disabledButton]} 
        onPress={handleGoogleLogin}
        disabled={loading}
      >
        <View style={styles.googleContent}>
          <Image
            source={{
              uri: 'https://th.bing.com/th/id/OIP.Y6dIiyezTz8ZQI8iLSHofQHaHj?rs=1&pid=ImgDetMain',
            }}
            style={styles.googleLogo}
          />
          <Text style={styles.googleButtonText}>
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={navigateToSignup}>
          <Text style={styles.signupLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#007BFF',
    fontSize: 14,
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  googleButton: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  googleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#333',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
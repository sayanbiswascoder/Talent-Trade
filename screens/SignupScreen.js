// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// import { addUser } from '../utils/api';
// import app from '../firebase/firebase';
// 
// const SignupScreen = () => {
//   const navigation = useNavigation();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
// 
//   const [offeredSkills, setOfferedSkills] = useState('');
//   const [requestedSkills, setRequestedSkills] = useState('');
//   const [bio, setBio] = useState('');
// 
//   const handleSignUp = async () => {
//     try {
//       const auth = getAuth(app);
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       await addUser({
//         uid: user.uid,
//         offeredSkills: offeredSkills.split(',').map(skill => skill.trim()),
//         requestedSkills: requestedSkills.split(',').map(skill => skill.trim()),
//         bio: bio
//       });
//       navigation.navigate('Profile');
//     } catch (error) {
//       console.log('Error signing up:', error);
//     }
//   };
// 
//   return (
//     <View style={styles.mainView}>
//       <Text>Email</Text>
// 
// 
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//       />
//       <Text>Password</Text>
// 
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//        <Text>Offered Skills</Text>
// 
//       <TextInput
//         style={styles.input}
//         placeholder="Offered Skills (comma-separated)"
//         value={offeredSkills}
//         onChangeText={setOfferedSkills}
//       />
//        <Text>Requested Skills</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Requested Skills (comma-separated)"
//         value={requestedSkills}
//         onChangeText={setRequestedSkills}
//       />
//        <Text>Bio</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Bio"
//         value={bio}
//         onChangeText={setBio}
//       />
//       <Button title="Sign up" onPress={handleSignUp} />
//       <Text>Already have an acount? <TouchableOpacity onPress={()=> navigation.navigate("Login")}><Text>Sign In</Text></TouchableOpacity></Text>
//     </View>
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
//     fontSize: 24,
//     fontWeight: 'bold',
//   }, input: {
//     borderWidth: 1,
//     borderColor: 'gray',
//     padding: 10,
//   },
// });
// 
// export default SignupScreen;

// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   StyleSheet, 
//   Alert,
//   Button
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// import { addUser } from '../utils/api';
// import app from '../firebase/firebase';
// 
// const SignUpScreen = () => {
//   const navigation = useNavigation();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
// 
//   const handleSignUp = async () => {
//     try {
//       if(password != confirmPassword) return;
//       const auth = getAuth(app);
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       await addUser({
//         uid: user.uid,
//         email: email,
//         profession: "",
//         skills: [],
//       });
//       navigation.navigate('CompleteProfile');
//     } catch (error) {
//       console.log('Error signing up:', error);
//     }
//   };
// 
// 
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sign Up</Text>
// 
//       <TextInput
//         style={styles.input}
//         placeholder="Name"
//         value={name}
//         onChangeText={setName}
//       />
// 
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         value={email}
//         onChangeText={setEmail}
//       />
// 
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
// 
//       <TextInput
//         style={styles.input}
//         placeholder="Confirm Password"
//         secureTextEntry
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//       />
// 
//       <TouchableOpacity style={styles.button} onPress={handleSignUp}>
//         <Text style={styles.buttonText}>Create Account</Text>
//       </TouchableOpacity>
// 
//       <Text style={styles.agreementText}>
//         By continuing, you agree to our{' '}
//         <Text style={styles.link} onPress={() => console.log('Terms pressed')}>
//           Terms of Service
//         </Text>{' '}
//         and{' '}
//         <Text style={styles.link} onPress={() => console.log('Privacy pressed')}>
//           Privacy Policy
//         </Text>.
//       </Text>
// 
//       <Text style={styles.footerText}>
//         Already have an account?{' '}
//         <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
//           Login
//         </Text>
//       </Text>
//     </View>
//   );
// };

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, signInWithCredential } from 'firebase/firestore';
import { GoogleSignin, GoogleAuthProvider } from '@react-native-google-signin/google-signin';
import { addUser } from '@/utils/api';
import app, { auth } from '@/firebase/firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle visibility for Password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle visibility for Confirm Password

  GoogleSignin.configure({
    webClientId: "468132285348-k9vilju8uru436ijlsp3idh8jmio90o3.apps.googleusercontent.com",
    scopes: ['https://www.googleapis.com/auth/drive.file'], // Access to files created by your app
    offlineAccess: false,
  });

  const handleSignUp = async () => {
    try {
      if(password != confirmPassword) return;
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await addUser({
        uid: user.uid,
        name: name,
        email: email,
        profession: "",
        skills: [],
      });
      navigation.navigate('CompleteProfile');
    } catch (error) {
      console.log('Error signing up:', error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      // sign out previous user if any
      await GoogleSignin.signOut()

      // Check if Play Services are available (Android only)
      await GoogleSignin.hasPlayServices();

      // Get user credentials
      const { data } = await GoogleSignin.signIn();
      console.log(data)

      // Create Firebase credential
      const googleCredential = await GoogleAuthProvider.credential(data?.idToken);

      // // Sign in to Firebase
      const user = await signInWithCredential(auth, googleCredential);
      await addUser({
        uid: user.user.uid,
        name: user.user.displayName,
        email: user.user.email,
        profession: "",
        skills: [],
      });
      navigation.navigate("CompleteProfile")
      console.log("Signed in with Google!");
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword} // Toggles secure text entry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={
              showPassword
                ? { uri: 'https://img.icons8.com/ios-filled/50/000000/visible.png' } // Open eye icon
                : { uri: 'https://img.icons8.com/ios-filled/50/000000/invisible.png' } // Closed eye icon
            }
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword} // Toggles secure text entry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Image
            source={
              showConfirmPassword
                ? { uri: 'https://img.icons8.com/ios-filled/50/000000/visible.png' } // Open eye icon
                : { uri: 'https://img.icons8.com/ios-filled/50/000000/invisible.png' } // Closed eye icon
            }
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      
      <Text style={styles.orText}>or</Text>
      
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
        <Image
          source={{
            uri: 'https://th.bing.com/th/id/OIP.Y6dIiyezTz8ZQI8iLSHofQHaHj?rs=1&pid=ImgDetMain',

          }}
          style={styles.googleLogo}
        />
        <Text style={styles.googleButtonText}>Sign Up with Google </Text>
      </TouchableOpacity>
      
      <Text style={styles.footerText}>
        By continuing, you agree to our{' '}
        <Text style={styles.link} onPress={() => console.log('Terms pressed')}>
          Terms of Service
        </Text>{' '}
        and{' '}
        <Text style={styles.link} onPress={() => console.log('Privacy pressed')}>
          Privacy Policy
        </Text>.
      </Text>
      <TouchableOpacity>
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
            Login
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#000',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#666',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 12,
    marginBottom: 15,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#000',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginVertical: 15,
  },
  link: {
    color: '#007BFF',
  },
  loginText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    color: '#333',
  },
});

export default SignUpScreen;
// import React, { useEffect, useState, useContext } from 'react';
// import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
// import { AuthContext } from '../contexts/AuthContext';
// import { useNavigation } from '@react-navigation/native';
// import { getFirestore, getDoc, doc } from 'firebase/firestore';
// import { app } from '../firebase/firebase';
// 
// const ProfileScreen = () => {
//   const [user, setUser] = useState(null);
//   const { user: authUser } = useContext(AuthContext);
// 
//   const navigation = useNavigation();
//   useEffect(() => {
//     const fetchData = async () => {
//       if (authUser) {
//         const db = getFirestore(app);
//         const docRef = doc(db, 'users', authUser.uid);
//         const docSnap = await getDoc(docRef);
// 
//         if (docSnap.exists()) {
//           setUser(docSnap.data());
//         } else {
//           console.log('No such document!');
//         }
//       }
//     };
// 
//     fetchData();
//   }, [authUser]);
// 
//   const handleEditProfile = () => {
//     navigation.navigate('EditProfile');
//   }
// 
//   const handleMyMatches = () => {
//     navigation.navigate('Matches')
//   }
//   return (
//     <ScrollView contentContainerStyle={styles.mainView}>
//       {user ? (
//         <>
//           <Text style={styles.label}>Skill Points:</Text>
//           <Text style={styles.text}>{user.skillPoints}</Text>
//         <Text style={styles.label}>User Email:</Text>
//           <Text style={styles.text}>{user.email}</Text>
//           <Text style={styles.label}>Bio:</Text>
//           <Text style={styles.text}>{user.bio}</Text>
//           <Text style={styles.label}>Offered Skills:</Text>
//            <Text style={styles.text}>{user.offeredSkills.join(', ')}</Text>
//           <Text style={styles.label}>Requested Skills:</Text>
// 
//           <Text style={styles.text}>{user.requestedSkills.join(', ')}</Text>
//            <View style={styles.buttonContainer}>
//             <Button title="Edit Profile" onPress={handleEditProfile} color="#007bff" />
//           </View>
//            <View style={styles.buttonContainer}>
//             <Button title="My Matches" onPress={handleMyMatches} color="#007bff" />
//           </View>
//            <View style={styles.buttonContainer}>
//             <Button title="Matche" onPress={()=> navigation.navigate("Matching")} color="#007bff" />
//           </View>
// 
//         </>
//       ) : (
//         <Text style={styles.text}>Loading user data...</Text>
//       )}
// 
//         
//     </ScrollView>
//   );
// };
// 
// const styles = StyleSheet.create({
//   mainView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     padding: 20,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     width: '100%',
// 
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   text: {
//     fontSize: 20,
//   }
// });
// 
// export default ProfileScreen;

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';

const ProfileScreen = () => {
  // Renamed timeAvailability to bio for clarity
  const [bio, setBio] = useState('');
  const [profession, setProfession] = useState('');
  // We'll use a separate input for adding individual skills
  const [skillInput, setSkillInput] = useState('');
  const [skillsList, setSkillsList] = useState([]);

  // Adds a new skill to the list if valid
  const addSkill = () => {
    const newSkill = skillInput.trim();
    if (newSkill.length > 0 && !skillsList.includes(newSkill)) {
      setSkillsList([...skillsList, newSkill]);
      setSkillInput('');
    }
  };

  // Removes a skill when pressing the cross button
  const removeSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = () => {
    // Replace this with your actual API or submission logic
    console.log('Profile Completed:', { bio, profession, skills: skillsList });
    Alert.alert('Profile Submitted', 'Your profile information has been submitted!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Complete Your Profile</Text>

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={styles.input}
        placeholder="About yourself..."
        value={bio}
        onChangeText={setBio}
        multiline
      />

      <Text style={styles.label}>Profession/Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., UI/UX Designer"
        value={profession}
        onChangeText={setProfession}
      />

      <Text style={styles.label}>Skills</Text>
      <View style={styles.skillsInputContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Add a skill, e.g., Python"
          value={skillInput}
          onChangeText={setSkillInput}
        />
        <TouchableOpacity style={styles.addSkillButton} onPress={addSkill}>
          <Text style={styles.addSkillButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.skillsContainer}>
        {skillsList.map((skill, index) => (
          <View key={index} style={styles.skillBox}>
            <Text style={styles.skillText}>{skill}</Text>
            <TouchableOpacity onPress={() => removeSkill(skill)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
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
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: 'black',
  },
  label: {
    fontSize: 16.5,
    marginBottom: 5,
    color: 'black',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  skillsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addSkillButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  addSkillButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  skillBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  skillText: {
    fontSize: 14,
    color: 'black',
  },
  removeButton: {
    marginLeft: 5,
  },
  removeButtonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'semibold',
  },
  submitButton: {
    backgroundColor: '#28a745', // Green button
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ProfileScreen;
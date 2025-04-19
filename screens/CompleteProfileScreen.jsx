// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   StyleSheet, 
//   Alert 
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { getAuth } from 'firebase/auth';
// import { getFirestore, doc, updateDoc } from 'firebase/firestore';
// import app from '../firebase/firebase';
// 
// 
// const CompleteProfileScreen = () => {
//   // Renamed timeAvailability to bio for clarity
//   const [bio, setBio] = useState('');
//   const [profession, setProfession] = useState('');
//   // We'll use a separate input for adding individual skills
//   const [skillInput, setSkillInput] = useState('');
//   const [skillsList, setSkillsList] = useState([]);
// 
//   const navigation = useNavigation()
// 
//   // Adds a new skill to the list if valid
//   const addSkill = () => {
//     const newSkill = skillInput.trim();
//     if (newSkill.length > 0 && !skillsList.includes(newSkill)) {
//       setSkillsList([...skillsList, newSkill]);
//       setSkillInput('');
//     }
//   };
// 
//   // Removes a skill when pressing the cross button
//   const removeSkill = (skillToRemove) => {
//     setSkillsList(skillsList.filter(skill => skill !== skillToRemove));
//   };
// 
//   const uplodeFile = () => {
//     
//   }
// 
//   const handleSubmit = async() => {
//     // Replace this with your actual API or submission logic
//     try {
//     const auth = getAuth(app);
//     const user = auth.currentUser;
//     const db = getFirestore(app);
//     const userRef = doc(db, 'users', user.uid);
//     
//     await updateDoc(userRef, {
//       bio: bio,
//       profession: profession,
//       skills: skillsList
//     });
//     
//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'Matching' }],
//     });
//     } catch (error) {
//         Alert.alert(
//             "Error",
//             "Failed to update profile. Please try again.",
//             [{ text: "OK" }]
//         );
//         console.error("Error updating account:", error);
//     }
//   };
// 
//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Complete Your Profile</Text>
// 
//       <Text style={styles.label}>Bio</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="About yourself..."
//         value={bio}
//         onChangeText={setBio}
//         multiline
//       />
// 
//       <Text style={styles.label}>Profession/Title</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="e.g., UI/UX Designer"
//         value={profession}
//         onChangeText={setProfession}
//       />
// 
//       <Text style={styles.label}>Skills</Text>
//       <View style={styles.skillsInputContainer}>
//         <TextInput
//           style={[styles.input, { flex: 1, marginBottom: 0 }]}
//           placeholder="Add a skill, e.g., Python"
//           value={skillInput}
//           onChangeText={setSkillInput}
//         />
//         <TouchableOpacity style={styles.addSkillButton} onPress={addSkill}>
//           <Text style={styles.addSkillButtonText}>Add</Text>
//         </TouchableOpacity>
//       </View>
// 
//       <View style={styles.skillsContainer}>
//         {skillsList.map((skill, index) => (
//           <View key={index} style={styles.skillBox}>
//             <Text style={styles.skillText}>{skill}</Text>
//             <TouchableOpacity onPress={() => removeSkill(skill)} style={styles.removeButton}>
//               <Text style={styles.removeButtonText}>×</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </View>
// 
//       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//         <Text style={styles.submitButtonText}>Submit</Text>
//       </TouchableOpacity>
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
  Alert,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import app from '../firebase/firebase';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '@/appwrite/appwrite';
import { ID } from 'react-native-appwrite';

const CompleteProfileScreen = () => {
  // State for profile and cover pictures
  const navigation = useNavigation()
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  // Renamed timeAvailability to bio for clarity
  const [bio, setBio] = useState('');
  const [profession, setProfession] = useState('');
  // We'll use a separate input for adding individual skills
  const [skillInput, setSkillInput] = useState('');
  const [skillsList, setSkillsList] = useState([]);

 
  // Function to pick Profile Picture
  const pickProfilePic = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access images is required!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // square aspect for profile
      quality: 1,
    });
    if (result.assets.length !== 0) {
      setProfilePic(result.assets[0].uri);
    }
  };
  // Function to pick Cover Picture
  const pickCoverPic = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access images is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 18], // rectangular aspect for cover
      quality: 1,
    });
    if (result.assets.length !== 0) {
      setCoverPic(result.assets[0].uri);
    }
  };
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

  const uriToFile = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = uri.split('/').pop();
      const mimeType = blob.type || 'image/jpeg'; // Fallback to JPEG if type is unknown
      return new File([blob], fileName, { type: mimeType });
    } catch (error) {
      console.error('Error converting URI to File:', error);
      throw error;
    }
  };

  const uploadFile = async(path) => {
    try {
      const file = await uriToFile(path)
      const uplodedFile = await storage.createFile('68031d830014fe45e41a', ID.unique(), {...file._data, uri: path})
      return uplodedFile;
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async() => {
    try {
      if( !bio && !profession && !skillsList && !profilePic && !coverPic ) return;
      const auth = getAuth(app);
      const user = auth.currentUser;
      const db = getFirestore(app);
      const userRef = doc(db, 'users', user.uid);

      const uploadedProfilePic = await uploadFile(profilePic)
      const uploadedCoverPic = await uploadFile(coverPic)

      
      await updateDoc(userRef, {
        bio: bio,
        profession: profession,
        skills: skillsList,
        profilePic: `https://fra.cloud.appwrite.io/v1/storage/buckets/68031d830014fe45e41a/files/${uploadedProfilePic.$id}/view?project=68031d14001185bc74f4`,
        coverPic: `https://fra.cloud.appwrite.io/v1/storage/buckets/68031d830014fe45e41a/files/${uploadedCoverPic.$id}/view?project=68031d14001185bc74f4`
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'Matching' }],
      });
    } catch (error) {
        Alert.alert(
            "Error",
            "Failed to update profile. Please try again.",
            [{ text: "OK" }]
        );
        console.error("Error updating account:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Complete Your Profile</Text>

     {/* Profile Picture Section */}
      <Text style={styles.label}>Profile Picture</Text>
      <TouchableOpacity style={styles.profilePicContainer} onPress={pickProfilePic}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
        ) : (
          <View style={styles.plusCircle}>
            <Text style={styles.plusText}>+</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Cover Picture Section */}
      <Text style={styles.label}>Cover Picture</Text>
      <TouchableOpacity style={styles.coverPicContainer} onPress={pickCoverPic}>
        {coverPic ? (
          <Image source={{ uri: coverPic }} style={styles.coverPic} />
        ) : (
          <View style={styles.plusCircleCover}>
            <Text style={styles.plusText}>+</Text>
          </View>
        )}
      </TouchableOpacity>

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
  profilePicContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  profilePic: {
    width: '100%',
    height: '100%',
  },
    coverPicContainer: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  coverPic: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
   plusCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
   plusCircleCover: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    fontSize: 30,
    color: '#888',
    fontWeight: 'bold',
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
    fontWeight: 'semi-bold',
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

export default CompleteProfileScreen;
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import app from '../firebase/firebase';


const CompleteProfileScreen = () => {
  // Renamed timeAvailability to bio for clarity
  const [bio, setBio] = useState('');
  const [profession, setProfession] = useState('');
  // We'll use a separate input for adding individual skills
  const [skillInput, setSkillInput] = useState('');
  const [skillsList, setSkillsList] = useState([]);

  const navigation = useNavigation()

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

  const handleSubmit = async() => {
    // Replace this with your actual API or submission logic
    try {
    const auth = getAuth(app);
    const user = auth.currentUser;
    const db = getFirestore(app);
    const userRef = doc(db, 'users', user.uid);
    
    await updateDoc(userRef, {
      bio: bio,
      profession: profession,
      skills: skillsList
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

export default CompleteProfileScreen;
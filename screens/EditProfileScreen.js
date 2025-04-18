import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/AuthContext';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import { app } from '../firebase/firebase';
import { updateUser } from '../utils/api';

const EditProfileScreen = () => {
    const [offeredSkills, setOfferedSkills] = useState('');
    const [requestedSkills, setRequestedSkills] = useState('');
    const [bio, setBio] = useState('');
    const { user } = useContext(AuthContext);
    const navigation = useNavigation();

    useEffect(() => {
        const db = getFirestore(app);
        const docRef = doc(db, 'users', user.uid);
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                setOfferedSkills(docSnap.data().offeredSkills.join(', '));
                setRequestedSkills(docSnap.data().requestedSkills.join(', '));
                setBio(docSnap.data().bio);
            }
        })
    }, [user]);

    const handleSave = async () => {
        await updateUser(user.uid, {
            offeredSkills: offeredSkills.split(',').map(s => s.trim()),
            requestedSkills: requestedSkills.split(',').map(s => s.trim()),
            bio: bio,
        });
        navigation.goBack();
    }

    return (
        <View style={styles.mainView}>
            <Text>Offered Skills:</Text>
            <TextInput value={offeredSkills} onChangeText={setOfferedSkills} />
            <Text>Requested Skills:</Text>
            <TextInput value={requestedSkills} onChangeText={setRequestedSkills} />
            <Text>Bio:</Text>
            <TextInput value={bio} onChangeText={setBio} />
            <Button title="Save" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfileScreen;
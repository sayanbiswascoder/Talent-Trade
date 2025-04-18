import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { getMatches, getUserFromId } from '../utils/api';
import AuthContext from '../contexts/AuthContext';

import { useNavigation } from '@react-navigation/native';
const MatchesScreen = () => {
  const [matches, setMatches] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMatches = async () => {
      const fetchedMatches = await getMatches(user.uid);
      setMatches(fetchedMatches);

    };

    fetchMatches();
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      const promises = matches.map(match => {
        const userId = match.userId === user.uid ? match.likedUserId : match.userId;
        return getUserFromId(userId);
      });
      const fetchedUsers = await Promise.all(promises);
      setUsers(fetchedUsers);
    }
    fetchUsers();
  }, [matches, user])

  const navigation = useNavigation();

  return (
    <View style={styles.mainView}>
      <ScrollView>
      {users.map((user) => (
        <View key={user.id}>
          <Button
            title="Chat"
            onPress={() =>
                navigation.navigate('ChatScreen', { receiverId: user.id })
            }
          />
          <Text style={styles.text}>
          {user.email}
        </Text>
        </View>
      ))}
      </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});


export default MatchesScreen;
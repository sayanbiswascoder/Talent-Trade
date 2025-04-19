// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
// import { getMatches, getUserFromId } from '../utils/api';
// import AuthContext from '../contexts/AuthContext';
// 
// import { useNavigation } from '@react-navigation/native';
// const MatchesScreen = () => {
//   const [matches, setMatches] = useState([]);
//   const [users, setUsers] = useState([]);
//   const { user } = useContext(AuthContext);
// 
//   useEffect(() => {
//     const fetchMatches = async () => {
//       const fetchedMatches = await getMatches(user.uid);
//       setMatches(fetchedMatches);
// 
//     };
// 
//     fetchMatches();
//   }, [user]);
// 
//   useEffect(() => {
//     const fetchUsers = async () => {
//       const promises = matches.map(match => {
//         const userId = match.userId === user.uid ? match.likedUserId : match.userId;
//         return getUserFromId(userId);
//       });
//       const fetchedUsers = await Promise.all(promises);
//       setUsers(fetchedUsers);
//     }
//     fetchUsers();
//   }, [matches, user])
// 
//   const navigation = useNavigation();
// 
//   return (
//     <View style={styles.mainView}>
//       <ScrollView>
//       {users.map((user) => (
//         <View key={user.id}>
//           <Button
//             title="Chat"
//             onPress={() =>
//                 navigation.navigate('ChatScreen', { receiverId: user.id })
//             }
//           />
//           <Text style={styles.text}>
//           {user.email}
//         </Text>
//         </View>
//       ))}
//       </ScrollView>
//     </View>
//   )
// };
// 
// const styles = StyleSheet.create({
//   mainView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: 20,
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });
// 
// 
// export default MatchesScreen;


import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getMutualMatches, getUser } from '@/utils/api';
import { AuthContext } from '@/contexts/AuthContext';


const sampleChats = [
  {
    id: '1',
    name: 'Alice Smith',
    profilePic: 'https://randomuser.me/api/portraits/women/10.jpg',
    lastMessage: 'Hey, how are you?',
    timestamp: '10:45 AM',
    isTyping: false,
    conversation: [
      { sender: 'Alice', text: 'Hey, how are you?' },
      { sender: 'You', text: 'I am fine, thanks!' },
    ],
  },
  {
    id: '2',
    name: 'Bob Johnson',
    profilePic: 'https://randomuser.me/api/portraits/men/20.jpg',
    lastMessage: 'Typing...',
    timestamp: '9:30 AM',
    isTyping: true,
    conversation: [
      { sender: 'Bob', text: 'Hello there!' },
      { sender: 'You', text: 'Hi Bob!' },
    ],
  },
  {
    id: '3',
    name: 'Carol White',
    profilePic: 'https://randomuser.me/api/portraits/women/30.jpg',
    lastMessage: 'See you later!',
    timestamp: 'Yesterday',
    isTyping: false,
    conversation: [
      { sender: 'Carol', text: 'See you later!' },
      { sender: 'You', text: 'Goodbye, Carol!' },
    ],
  },
];

const TypingIndicator = () => (
  <View style={styles.typingContainer}>
    <Text style={styles.typingDot}>●</Text>
    <Text style={[styles.typingDot, { marginLeft: 4 }]}>●</Text>
    <Text style={[styles.typingDot, { marginLeft: 4 }]}>●</Text>
  </View>
);

const ChatItem = ({ chat, index }) => {
  const navigation = useNavigation();

  const handleLongPress = () => {
    Alert.alert(
      'Chat Options',
      'Choose an action',
      [
        { text: 'Remove Friend', onPress: () => console.log("Remove Friend pressed for ${chat.name}") },
        { text: 'Block', onPress: () => console.log("Block pressed for ${chat.name}") },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handlePress = () => {
    navigation.navigate('Chat', { chatId: chat.chatId, userId: chat.id });
  };

  return (
    <TouchableOpacity
      style={styles.chatItemContainer}
      onLongPress={handleLongPress}
      onPress={handlePress}
    >
      <Image source={{ uri: chat.profilePic }} style={styles.chatProfilePic} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeaderRow}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <Text style={styles.chatTime}>{chat.timestamp}</Text>
        </View>
        <View style={styles.chatMessageRow}>
          {chat.isTyping ? (
            <TypingIndicator />
          ) : (
            <Text style={styles.chatLastMessage}>{chat.lastMessage}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ChatListScreen = () => {
  const [chats, setChats] = useState([])
  const { user: authUser } = useContext(AuthContext)

  useEffect(()=> {
    const fetchChats = async() => {
      let chats = await getMutualMatches(authUser.uid);
      chats = await Promise.all(chats.map(async chat => {
        const oppositeUserId = chat.userId1 === authUser.uid ? chat.userId2 : chat.userId1;
        const oppositeUser = await getUser(oppositeUserId);
        return {...oppositeUser, chatId: chat.chatId};
      }));
      setChats(chats)
    }
    fetchChats()
  }, [])
  return (
    <View style={styles.listContainer}>
      <Text style={styles.listHeader}>Chats</Text>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.uid}
        renderItem={({ item, index }) => <ChatItem chat={item} index={index} />}
        contentContainerStyle={styles.chatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  listHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  chatList: {
    paddingHorizontal: 10,
  },
  chatItemContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  chatProfilePic: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  chatMessageRow: {
    marginTop: 4,
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#555',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    fontSize: 16,
    color: 'green',
  },
  // Chat detail styles:
  detailContainer: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  detailProfilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  detailName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  conversationContainer: {
    flex: 1,
    padding: 15,
  },
  messageLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  messageRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#007BFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  input: {
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
  },
});

export default ChatListScreen;
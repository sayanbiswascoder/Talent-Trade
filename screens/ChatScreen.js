import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import * as FileSystem from "expo-file-system";
import { AuthContext } from "../contexts/AuthContext";
import { sendMessage, getMessages, getUser } from "../utils/api";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';

const ChatScreen = () => {
  const navigation = useNavigation()
  const [user, setUser] = useState({})
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "H5DlxTapaGPS2cvnhJbg5JSPMM62",
      text: "Hey",
      timestamp: new Date().toDateString(),
    },
    {
      sender: "BJxxG2g0v7Y9HoHJGCC098AIZez1",
      text: "Hello",
      timestamp: new Date().toDateString(),
    },
  ]);

  const { user: authUser } = useContext(AuthContext);
  const route = useRoute();
  const { uid } = route.params || { receiverId: "" };
  const fileUri = FileSystem.documentDirectory + `/chats/${uid}.json`;

  const readFile = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + '/chats');
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + '/chats', { intermediates: true });
      }
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify([]));
        return [];
      }
      const content = await FileSystem.readAsStringAsync(fileUri);
      return JSON.parse(content);
    } catch (error) {
      console.log("Error reading file:", error);
      return [];
    }
  };

  const fetchChat = async () => {
    const content = await readFile();
    setMessages(content)
    // requestUserPermission()
  };

  useEffect(() => {
    const fetchUser = async() => {
      const u = await getUser(uid)
      setUser(u)
    }
    fetchUser()
    fetchChat();
  }, [uid]);

  return (
    <View style={styles.mainView}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Image 
          source={{ uri: user.profilePic }} 
          style={styles.profilePic}
        />
        <Text style={styles.username}>{user.name}</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.sender === authUser.uid
                ? styles.sentMessage
                : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
            <Text style={styles.timestamp}>
              {message.timestamp
                ? new Date(message.timestamp).toLocaleTimeString()
                : ""}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !messageText && styles.sendButtonDisabled]}
          onPress={async () => {
            if (messageText.trim()) {
              await sendMessage(authUser.uid, uid, messageText);
              setMessageText("");
            }
          }}
          disabled={!messageText}
        >
          <Ionicons name="send" size={24} color={messageText ? "#fff" : "#999"} />
        </TouchableOpacity>
      </View>

      {/*<View>
        {useEffect(() => {
          getMessages(authUser?.uid, uid).then(setMessages);
        }, [])}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    width: '100%',
  },
  backButton: {
    marginRight: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginVertical: 20,
  },
  scrollView: {
    width: "100%",
    paddingHorizontal: 10,
    flex: 1,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    maxWidth: "80%",
    borderRadius: 10,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    marginLeft: "20%",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E8E8E8",
    marginRight: "20%",
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  messageInputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    backgroundColor: "#fff",
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
    backgroundColor: "#F5F5F5",
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
  },
  sendButtonDisabled: {
    backgroundColor: "#E8E8E8",
  },
});

export default ChatScreen;

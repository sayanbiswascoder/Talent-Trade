import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { sendMessage, getMessages } from '../utils/api';
import { useRoute } from '@react-navigation/native';

const ChatScreen = () => {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const { authUser } = useContext(AuthContext);
  const route = useRoute();
  const { receiverId } = route.params || { receiverId: "" };
  

  return (
    <View style={styles.mainView}>
      <Text style={styles.text}>Chat Screen</Text>
      <View>
        <Text>Message:</Text>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
        />
        <Button
          title="Send"
          onPress={async () => {
            await sendMessage(authUser.uid, receiverId, messageText);
            setMessageText('');
          }}
        />
      </View>
      <View>
        <ScrollView>
          {messages.map((message, index) => (
            <Text key={index}>{message.message}</Text>
          ))}
        </ScrollView>
      </View>

      <View>
        {useEffect(() => {
          getMessages(authUser?.uid, receiverId).then(setMessages);
        }, [])}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: 'black' },
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
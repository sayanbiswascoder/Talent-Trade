import { getFirestore, doc, setDoc, getDocs, collection, addDoc, query, where, getCountFromServer, getDoc, updateDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import app from '../firebase/firebase';

const db = getFirestore(app);

export const addUser = async (user) => {
  try {
    await setDoc(doc(db, 'users', user.uid), {
      name: user.name || '',
      email: user.email || '',
      offeredSkills: [],
      requestedSkills: [

      ],
      bio: "" || '',
      skillPoints: 0,
      // Add other user data here if needed
    });
    console.log('User added to Firestore');
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
  }
};

export const updateUser = async (userId, newData) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...newData
    });
    console.log('User added to Firestore');
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
  }
};

  export const sendMessage = async (senderId, receiverId, messageText) => {
    try {
        const chatQuery = query(
            collection(db, 'chats'),
            where('userIds', 'array-contains', senderId)
        );
        const chatQuerySnapshot = await getDocs(chatQuery);
        let chatId = null
        chatQuerySnapshot.forEach(doc =>{
            if(doc.data().userIds.includes(receiverId)) chatId = doc.id
        });
        if (!chatId) {
            const newChatRef = doc(collection(db, 'chats'));
            await setDoc(newChatRef, { userIds: [senderId, receiverId] });
            chatId = newChatRef.id;
        }
        await addDoc(collection(db, `chats/${chatId}/messages`), {
            senderId: senderId,
            receiverId: receiverId,
            text: messageText,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
    }
};

export const getMessages = async (userId1, userId2) => {
  try {
    const chatQuery = query(collection(db, 'chats'), where('userIds', 'array-contains', userId1));
    const chatQuerySnapshot = await getDocs(chatQuery);
    let chatId = null;
    chatQuerySnapshot.forEach(doc => {
      if (doc.data().userIds.includes(userId2)) chatId = doc.id;
    });
    const q = query(collection(db, `chats/${chatId}/messages`), orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    return [];
  }
};
export const getUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      });
    } catch (error) {
      console.error('Error getting users from Firestore:', error);
      return [];
    }
  };

  export const getUser = async (userId) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user from Firestore:', error);
      return null;
    }
  };


  export const getUserFromId = async (userId) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      return docSnap.data()
    } catch (error) {
      console.error('Error getting user from Firestore:', error);
      return [];
    }
  };

export const getMatches = async (userId) => {
    try {
        const q = query(collection(db, 'mutualMatches'), where('userId1', '==', userId));
        const querySnapshot = await getDocs(q);
        const matches1 = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return matches1
    } catch (error) {
        console.error('Error getting matches from Firestore:', error);
        return [];
    }
};

export const addMatchs = async (userId1, userId2) => {
    try {
        // Check if match already exists
        const existingMatchQuery1 = query(
            collection(db, 'mutualMatches'),
            where('userId1', '==', userId1),
            where('userId2', '==', userId2)
        );
        const existingMatchSnapshot1 = await getDocs(existingMatchQuery1);

        const existingMatchQuery2 = query(
            collection(db, 'mutualMatches'),
            where('userId1', '==', userId2),
            where('userId2', '==', userId1)
        );
        const existingMatchSnapshot2 = await getDocs(existingMatchQuery2);
        
        if (!existingMatchSnapshot1.empty && !existingMatchQuery2.empty) {
            console.log('Match already exists');
            return;
        }

        // Add new match
        await addDoc(collection(db, 'mutualMatches'), {
            userId1: userId1,
            userId2: userId2,
            timestamp: serverTimestamp()
        });

        console.log('Match added successfully');
    } catch (error) {
        console.error('Error adding match to Firestore:', error);
    }
};

export const checkLike = async (postId, userId) => {
  try {
    const q = query(
      collection(db, "likes"),
      where("postId", "==", postId),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking like in Firestore:', error);
    return false;
  }
  };

export const getComments = async (postId) => {
  try {
    const q = query(collection(db, 'comments'), where('postId', '==', postId), orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting comments from Firestore:', error);
    return [];
  }
};



  export const addLike = async (postId, userId) => {
    try {    
        const postRef = doc(db, 'posts', postId);
        const postSnapshot = await getDoc(postRef)
        if (postSnapshot.exists()) {
            const postData = postSnapshot.data();
            const postOwnerId = postData.userId;

            await updateDoc(postRef, {
              likes: increment(1)
            });
            await updateDoc(doc(db, 'users', postOwnerId), {
              skillPoints: increment(1)
            });
            await addDoc(collection(db, 'likes'), {
              postId: postId,
              userId: userId
            });
        }
      console.log('Like added to Firestore');
    } catch (error) {
      console.error('Error adding like to Firestore:', error);
    }
  };

export const addComment = async (postId, userId, commentText) => {
  try {
    await addDoc(collection(db, 'comments'), {
      postId: postId,
      userId: userId,
      text: commentText,
      timestamp: serverTimestamp(),
    });
    console.log('Comment added to Firestore');
  } catch (error) {
    console.error('Error adding comment to Firestore:', error);
  }
};


  export const addMatch = async (userId, likedUserId) => {
    try {
        await addDoc(collection(db, 'matches'), {
          userId: userId,
          likedUserId: likedUserId
        });
    } catch (error) {
        console.error('Error adding match to Firestore:', error);
    }
  };

export const checkMatch = async (userId, likedUserId) => {
    try {
        const q = query(
          collection(db, "matches"),
          where("userId", "==", likedUserId),
          where("likedUserId", "==", userId)
        );
        const querySnapshot = await getCountFromServer(q)
        
        if(querySnapshot.data().count > 0) return true;
        return false
      } catch (error) {
        console.error('Error checking match in Firestore:', error);
        return false;
      }
  }

  export const getMutualMatches = async (userId) => {
    try {
      const q = query(
        collection(db, "mutualMatches"),
        where("userId1", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const matches1 = querySnapshot.docs.map(doc => ({ chatId: doc.id, ...doc.data() }));

      const q2 = query(
        collection(db, "mutualMatches"),
        where("userId2", "==", userId)
      );
      const querySnapshot2 = await getDocs(q2);
      const matches2 = querySnapshot2.docs.map(doc => ({ chatId: doc.id, ...doc.data() }));

      return [...matches1, ...matches2];
    } catch (error) {
      console.error('Error getting mutual matches from Firestore:', error);
      return [];
    }
  };

  export const checkMutualMatch = async (userId, likedUserId) => {
    try {
      const q = query(
        collection(db, "matches"),
        where("userId", "==", likedUserId),
        where("likedUserId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
          await addDoc(collection(db, 'mutualMatches'), {
              userId1: userId,
              userId2: likedUserId
            });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking mutual match in Firestore:', error);
    }
  };

  export const addPost = async (text, userId) => {
    try {
      await addDoc(collection(db, 'posts'), {
        text: text,
        userId: userId,
        timestamp: serverTimestamp(),
        likes: 0
      });
      console.log('Post added to Firestore');
    } catch (error) {
      console.error('Error adding post to Firestore:', error);
    }
  };

  export const getPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error getting posts from Firestore:', error);
      return [];
    }
  };

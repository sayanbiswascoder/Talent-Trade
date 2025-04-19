import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Dimensions,
} from "react-native";
import Swiper from "react-tinder-card";
import app from "../firebase/firebase";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { checkMatch, checkMutualMatch, addMatch, addMatchs } from "@/utils/api";
import { AuthContext } from "@/contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import messaging from '@react-native-firebase/messaging'

const { width, height } = Dimensions.get("window");

const App = () => {
  const navigation = useNavigation()
  const [users, setUsers] = useState([]);
  const { user: authUser } = useContext(AuthContext)
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [swipedUsers, setSwipedUsers] = useState({
    left: [],
    right: [],
    up: [],
  });

  const fetchUsers = () => {
    setIsRefreshing(true)
    try {
      const db = getFirestore(app);
    const usersRef = collection(db, "users");
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const userData = snapshot.docs
        .map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.uid !== authUser?.uid);
      setUsers(userData);
    });

    return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsRefreshing(false)
    }
      
  }

  // Fetch users from Firestore
  useEffect(() => {
    fetchUsers()
  }, [authUser?.uid]);

  // Swipe handlers
  const onLeftSwipe = (userId) => {
    const swipedUser = users.find((user) => user.id === userId);
    setSwipedUsers((prev) => ({
      ...prev,
      left: [...prev.left, swipedUser],
    }));
    console.log(`Swiped left on ${swipedUser.name}`);
  };

  const onRightSwipe = async(userId) => {
    const swipedUser = users.find((user) => user.id === userId);
    setSwipedUsers((prev) => ({
      ...prev,
      right: [...prev.right, swipedUser],
    }));
    try {
      const hasLiked = await checkMatch(authUser.uid, swipedUser.uid);
      if (!hasLiked) {
        const isMutualMatch = await checkMutualMatch(authUser.uid, swipedUser.uid);
        if (!isMutualMatch) {
          await addMatch(authUser.uid, swipedUser.uid);
        }
      } else {
        addMatchs(authUser.uid, swipedUser.uid)
      }
    } catch (error) {
      console.error('Error in like action:', error);
    }
    console.log(`Swiped right on ${swipedUser.name}`);
  };

  const onUpSwipe = () => {
    navigation.navigate("Matches")
  };

  const onDownSwipe = () => {
    console.log('Swiped down to refresh');
    fetchUsers();
  };

  // Handle swipe
  const onSwipe = (direction, userId) => {
    if (direction === "left") onLeftSwipe(userId);
    else if (direction === "right") onRightSwipe(userId);
    else if (direction === "up") onUpSwipe(userId);
    else onDownSwipe();
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        {users.length > 0 ? (
        users.map((user) => (
          <Swiper
            key={user.uid}
            onSwipe={(dir) => onSwipe(dir, user.id)}
            swipeRequirementType="position"
            swipeThreshold={100}
            cardStyle={styles.card}
          >
            <View style={styles.card}>
              <Image
                source={{ uri: user.coverPic }}
                style={styles.coverImage}
              />
              <View style={styles.overlay}>
                <View style={styles.profileRow}>
                  <Image
                    source={{ uri: user.profilePic }}
                    style={styles.profilePic}
                  />
                  <Text style={styles.name}>{user.name}</Text>
                </View>
                <Text style={styles.skills}>
                  Skills: {user.skills.join(", ")}
                </Text>
                <Text style={styles.bio}>{user.bio}</Text>
              </View>
            </View>
          </Swiper>
        ))) : (
          <Text style={styles.emptyText}>
            {isRefreshing ? 'Refreshing...' : 'No users available'}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  cardContainer: {
    flex: 1,
    width: "100%",
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "#fff",
  },
  coverImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    overlay: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      padding: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    profilePic: {
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 2,
      borderColor: '#fff',
      marginRight: 15,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    skills: {
      fontSize: 16,
      color: '#fff',
      marginBottom: 5,
    },
    bio: {
      fontSize: 14,
      color: '#ddd',
    },
});

export default App;

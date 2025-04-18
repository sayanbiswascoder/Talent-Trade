import { checkMatch, checkMutualMatch, getUsers } from '@/utils/api';
import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { getDoc, doc, getFirestore } from 'firebase/firestore';
import app from '../firebase/firebase';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ExploreScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const currentUser = users[currentIndex];
  const navigation = useNavigation()

  
  const { user: authUser } = useContext(AuthContext) || {};

  useEffect(() => {
    if (authUser?.uid) {
      const fetchUser = async () => {
        try {
          const db = getFirestore(app);
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      fetchUser();
    }
  }, [authUser]);

  useEffect(()=> {
    console.log(users)
  }, [users])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      // Only start when one axis is clearly dominant
      onMoveShouldSetPanResponder: (e, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (e, gestureState) => {
        // Check which axis has the greater displacement.
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          // Horizontal move: update only x
          position.setValue({ x: gestureState.dx, y: 0 });
        } else {
          // Vertical move: update only y
          position.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: async(e, gestureState) => {
        // If the gesture is predominantly horizontal
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          if (gestureState.dx > 120) {
            try {
              console.log(users)
              const hasLiked = await checkMatch(authUser.uid, currentUser.uid);
              if (!hasLiked) {
                const isMutualMatch = await checkMutualMatch(authUser.uid, currentUser.uid);
                if (isMutualMatch) {
                  await addMatch(authUser.uid, currentUser.uid);
                }
              }
              Animated.timing(position, {
                toValue: { x: width, y: 0 },
                duration: 200,
                useNativeDriver: false,
              }).start(() => {
                goToNextUser();
              });
            } catch (error) {
              console.error('Error in like action:', error);
              Animated.spring(position, {
                toValue: { x: 0, y: 0 },
                friction: 4,
                useNativeDriver: false,
              }).start();
            }
          } else if (gestureState.dx < -120) {
            Animated.timing(position, {
              toValue: { x: -width, y: 0 },
              duration: 200,
              useNativeDriver: false,
            }).start(() => {
              console.log('Rejected:', users[currentIndex]?.name);
              goToNextUser();
            });
          } else {
            // Not far enough: reset to original
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              friction: 4,
              useNativeDriver: false,
            }).start();
          }
        } else {
          // Vertical gesture detected
          if (gestureState.dy > 150) {
            setIsRefreshing(true);
            Animated.timing(position, {
              toValue: { x: 0, y: height },
              duration: 300,
              useNativeDriver: false,
            }).start(async () => {
              await fetchUsers();
              setIsRefreshing(false);
              Animated.spring(position, {
                toValue: { x: 0, y: 0 },
                friction: 4,
                useNativeDriver: false,
              }).start();
            });
          } else if (gestureState.dy < -150) {
            navigation.navigate("Chat")
            // This could perform the same or a different action.
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              friction: 4,
              useNativeDriver: false,
            }).start();
          } else {
            // Not far enough vertical movement: reset
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              friction: 4,
              useNativeDriver: false,
            }).start();
          }
        }
      },
    })
  ).current;

  const goToNextUser = () => {
    // Reset position and move to the next user's card.
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((prevIndex) =>
      prevIndex === users.length - 1 ? 0 : prevIndex + 1
    );
  };

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Settings button on the top-right */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => console.log('Settings pressed')}
      >
        <Image
          source={{
            uri: user?.profilePic
          }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
      </TouchableOpacity>
      {/* Animated user card */}
      <Animated.View
        style={[styles.card, position.getLayout()]}
        {...panResponder.panHandlers}
      >
        <Image
          source={{ uri: currentUser.coverPic }}
          style={styles.coverImage}
        />
        <View style={styles.overlay}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: currentUser.profilePic }}
              style={styles.profilePic}
            />
            <Text style={styles.name}>{currentUser.name}</Text>
          </View>
          <Text style={styles.skills}>
            Skills: {currentUser.skills.join(', ')}
          </Text>
          <Text style={styles.bio}>{currentUser.bio}</Text>
        </View>
      </Animated.View>
      {isRefreshing && (
        <View style={styles.refreshIndicator}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.refreshText}>Refreshing...</Text>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  settingsButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 2,
    borderRadius: 25,
  },
  settingsText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  card: {
    width: width,
    height: height,
    backgroundColor: '#fff',
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
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  refreshIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
  },
  refreshText: {
    color: '#000',
    fontSize: 16,
  },
});

export default ExploreScreen;
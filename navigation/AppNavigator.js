import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import MatchingScreen from '../screens/MatchingScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CompleteProfileScreen from '../screens/CompleteProfileScreen'
import ProfileScreen from '../screens/ProfileScreen';
import CommunityHubScreen from '../screens/CommunityHubScreen';
import ChatScreen from '../screens/ChatScreen';
import MatchesScreen from '../screens/MatchesScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Matching" component={MatchingScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="CommunityHub" component={CommunityHubScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Matches" component={MatchesScreen} />
      </Stack.Navigator>
  );
}

export default AppNavigator;
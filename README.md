# Talent-Trade

# Overview
Our project is a React Native mobile application that includes authentication, user matching, and a chat system with real-time interactions. Users can sign up using Google authentication or email/password, match with other users via swipe gestures, and engage in conversations.

# Features
- 🔐 Authentication  
  - Users can sign up using Google login or email/password.  
  - Secure authentication via Firebase Authentication.  
  - Profile details are stored using Firebase Firestore.  

- 🔥 Swipe-to-Match System  
  - Swipe right to like, left to reject, and up/down for additional actions.  
  - Accepted matches become friends and appear in the chat list.  

- 💬 Real-Time Chat  
  - Displays user's profile picture, name, last message, and timestamp.  
  - Shows a **typing indicator when the other user is typing (three waving dots).  
  - Swipe **left/right** inside chat to navigate between conversations.  

- ⚙️ Settings & Friend Management  
  - Long-press on chats to remove or block users.  
  - Settings allow customization of preferences.  

---

# Tech Stack
# Frontend
- ⚛️ React Native (for cross-platform mobile UI)
- 📦 React Navigation (for seamless screen navigation)
- 🔵 Expo (optional—if using managed workflow)

# Backend
- 🔥 Firebase (Authentication, Firestore, Realtime Database)
- 📡 Cloud Firestore (Storing user profiles & chat history)

# Third-Party Packages
- 🏆 Google Sign-In (`@react-native-google-signin/google-signin`)
- 🔄 Animated & PanResponder (for swipe gestures)

---

# Installation & Setup
# 1. Clone the Repository
```sh
git clone https://github.com/sayanbiswascoder/Talent-Trade.git
cd YOUR_PROJECT
```

# 2. Install Dependencies
```sh
npm install
```
or
```sh
yarn install
```

# 3. Firebase Configuration
- Go to [Firebase Console](https://console.firebase.google.com/).
- Create a Firebase project.
- Enable Authentication → Google Sign-In.
- Enable Firestore Database.
- Copy Firebase configuration and paste it into `firebase.js`.

### 4. Run the App
For Expo-managed projects:
```sh
npx expo start
```

For React Native CLI:
```sh
npx react-native run-android    For Android
npx react-native run-ios        For iOS
```

---

# Usage
# User Authentication
- Users can register via email/password or Google login.
- User profiles are stored in Firebase Firestore.

# Swipe-to-Match
- Users can swipe right to like, left to reject, and up/down for additional options.
- When two users swipe right on each other, they appear in the chat list.

# Real-Time Chat
- Displays name, last message, timestamp, and profile picture.
- Typing indicator shows when the other user is actively typing.
- Swipe left/right inside chat to move to the next conversation.
- Long-press on a chat to remove or block the user.

---

# Troubleshooting
# Google Sign-In Issues
✔️ Ensure that Google Sign-In is enabled in Firebase Console  
✔️ Verify that you added the correct OAuth Client ID in `googleSignInConfig.js`  
✔️ Update package dependencies:
```sh
npm install @react-native-google-signin/google-signin
```

# Swipe Gestures Not Working?
✔️ Ensure you are using Animated & PanResponder correctly in swipe-based screens  
✔️ Check gesture thresholds (`dx > 100` for right swipe, etc.)  
✔️ Add logging to debug gesture detection

# Firebase Rules for Chat Not Working?
✔️ Update Firebase rules in Firestore database:
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```
✔️ Ensure Firestore listener correctly fetches data for new messages  
✔️ Log errors in the console to find missing permissions

---

# Contributing
We welcome contributions! Follow these steps:
1. Fork the repository.
2. Create a branch (`feature-new`).
3. Commit your changes (`git commit -m "Added new feature"`).
4. Submit a pull request.

---

# License
This project is licensed under the MIT License.

---

Let me know if you'd like additional details in this `README.md` file! 🚀 

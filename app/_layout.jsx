import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import firebase from "../firebase/firebase";
import { AuthContext, AuthProvider } from "../contexts/AuthContext";
import AppNavigator from "../navigation/AppNavigator";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";

export default function RootLayout() {
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  }

  useEffect(()=> {
    requestUserPermission();
  }, [])
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

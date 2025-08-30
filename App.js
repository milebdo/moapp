import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { Text, TextInput } from 'react-native';

import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignupScreen from './src/screens/SignupScreen';
import ChatroomScreen from './src/screens/ChatroomScreen';
import LoginScreen from './src/screens/LoginScreen';
import HelloScreen from './src/screens/HelloScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import QRISSettingsScreen from './src/screens/QRISSettingsScreen';
import QRISListScreen from './src/screens/QRISListScreen';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (fontsLoaded) {
    if (Text.defaultProps == null) Text.defaultProps = {};
    if (TextInput.defaultProps == null) TextInput.defaultProps = {};
    Text.defaultProps.style = [{ fontFamily: 'Inter_400Regular' }, Text.defaultProps.style];
    TextInput.defaultProps.style = [{ fontFamily: 'Inter_400Regular' }, TextInput.defaultProps.style];
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Hello" component={HelloScreen} />
          <Stack.Screen name="Chatroom" component={ChatroomScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="QRISList" component={QRISListScreen} />
          <Stack.Screen name="QRISSettings" component={QRISSettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 
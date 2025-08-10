import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import Logo from '../../assets/logo.svg';

const Splash = ({ navigation }) => {
  useEffect(() => {
    let mounted = true;

    const timer = setTimeout(() => {
      if (!mounted) return;
      navigation.replace('Welcome');
    }, 1200);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'} />
      <Logo width={180} height={110} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F3F5',
  },
});

export default Splash; 
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../assets/logo.svg';
import UploadIcon from '../../assets/upload-Regular.svg';

const PRIMARY = '#00C896';
const BG = '#F2F3F5';
const DARK = '#00AC81'

const ICON_SIZE = 110;
const SHADOW_SIZE = 140;
const OVERLAY_OFFSET = (ICON_SIZE - SHADOW_SIZE) / 2; // -15

const WelcomeScreen = ({ navigation }) => {
  const handleContinueGoogle = () => {
    navigation.navigate('Chatroom');
  };

  const handleSignupEmail = () => {
    navigation.navigate('Signup');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'} />
      <View style={styles.container}>
        {/* Header logo */}
        <View style={styles.brandRow}>
          <Logo width={44} height={44} />
          <Text style={styles.brandText}>Monalisa</Text>
        </View>

        {/* Heading */}
        <View style={styles.headingBlock}>
          <Text style={styles.h1}>Rapikan</Text>
          <Text style={styles.h1}>Keuangan Usaha</Text>
          <Text style={styles.h1}>Tanpa Ribet</Text>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Mulai catat, upload, atau rekam dan Monalisa siap mencatat, menghitung, dan merapikan laporan keuangan kamu, langsung dari obrolan!
        </Text>

        {/* Upload icon */}
        <View style={styles.centerIconWrap}>
          <View style={styles.centerIconShadow} />
          <View style={styles.centerIcon}>
            <UploadIcon width={44} height={40} />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.googleBtn} onPress={handleContinueGoogle}>
            <Ionicons name="logo-google" size={20} color="#fff" style={styles.leftIcon} />
            <Text style={styles.googleText}>Lanjutkan dengan google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.emailBtn} onPress={handleSignupEmail}>
            <Ionicons name="mail-outline" size={20} color={DARK} style={styles.leftIcon} />
            <Text style={styles.emailText}>Daftar dengan email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginText} color={DARK} >Masuk</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  brandText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 8,
  },
  headingBlock: {
    marginTop: 24,
  },
  h1: {
    fontSize: 44,
    lineHeight: 52,
    color: '#0F172A',
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
  },
  centerIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginTop: 24,
    marginBottom: 20,
    position: 'relative',
    alignSelf: 'center',
  },
  centerIconShadow: {
    position: 'absolute',
    width: SHADOW_SIZE,
    height: SHADOW_SIZE,
    borderRadius: SHADOW_SIZE / 2,
    backgroundColor: PRIMARY,
    opacity: 0.12,
    top: OVERLAY_OFFSET,
    left: OVERLAY_OFFSET,
  },
  centerIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00b886',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  actions: {
    marginTop: 'auto',
    marginBottom: 24,
  },
  googleBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 10,
  },
  googleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  emailBtn: {
    marginTop: 14,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: PRIMARY,
  },
  emailText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: '700',
  },
  loginBtn: {
    marginTop: 14,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1FBF5',
  },
  loginText: {
    color: '#00C291',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default WelcomeScreen; 